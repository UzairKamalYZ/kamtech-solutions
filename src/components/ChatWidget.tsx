import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowRight, Bot, MoreVertical, Send, X } from "lucide-react";
import { useDraggable, type Pos } from "./useDraggable";
import { buildIndex, clearIndexCache, loadCachedIndex } from "@/kb/indexer";
import { embed, setModelProgressListener } from "@/kb/embedClient";
import { rank, SIMILARITY_THRESHOLD } from "@/kb/search";
import { isContactIntent } from "@/kb/questions";
import { slugify, truncateAtSentence } from "@/kb/text";
import type { KBEntry } from "@/kb/types";

const W = 380;
const H = 540;
const PANEL_KEY = "kamtech-chat-panel";
const HISTORY_KEY = "kamtech-chat-history";
const WELCOME =
  "Hi 👋 I'm the KamTech Assistant. Ask me about our services, projects or tech stack.";
const FALLBACK = "I couldn't find that on our website. The best way is to contact us directly.";
const CONTACT_REPLY =
  "Rates and availability depend on the scope of your project. Get in touch and we'll send you a tailored quote.";
const QUICK: [string, string][] = [
  ["Services", "What services do you offer?"],
  ["Current projects", "What are you working on?"],
  ["Tech stack", "What technologies do you use?"],
  ["Contact", "How can I contact you?"],
];

type Msg = {
  role: "user" | "bot";
  text: string;
  link?: { route: string; headingId: string; title: string };
  related?: string[];
  contact?: boolean;
  score?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  buttonPos: Pos;
  buttonSize: number;
  resetButton: () => void;
};

function besideButton(b: Pos, size: number): Pos {
  const onRight = b.x + size / 2 > window.innerWidth / 2;
  const x = onRight ? b.x + size - W : b.x;
  const above = b.y - H - 12 >= 16;
  const y = above ? b.y - H - 12 : b.y + size + 12;
  return { x, y };
}

export default function ChatWidget({ open, onClose, buttonPos, buttonSize, resetButton }: Props) {
  const router = useRouter();
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      return (
        JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? "null") ?? [
          { role: "bot", text: WELCOME },
        ]
      );
    } catch {
      return [{ role: "bot", text: WELCOME }];
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<string | null>("Getting to know KamTech…");
  const [menu, setMenu] = useState(false);
  const indexRef = useRef<KBEntry[] | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPos = useCallback(
    () => besideButton(buttonPos, buttonSize),
    [buttonPos, buttonSize],
  );
  const panel = useDraggable({
    storageKey: PANEL_KEY,
    width: W,
    height: H,
    defaultPos,
    disabled: mobile,
  });

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Open next to the button unless the user placed the panel somewhere.
  useEffect(() => {
    if (open) {
      if (!panel.hasSaved()) panel.place(besideButton(buttonPos, buttonSize));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const build = useCallback(async (force = false) => {
    if (force) await clearIndexCache();
    const cached = force ? null : await loadCachedIndex();
    // Only surface model progress while building; with a cached index the chat is already
    // usable and the model loads (from cache) in the background on the first question.
    setModelProgressListener(
      cached
        ? null
        : (s, p) => {
            if (s === "progress" && p != null)
              setStatus(`Downloading language model… ${Math.round(p)}%`);
          },
    );
    if (cached) {
      indexRef.current = cached;
      setStatus(null);
      // Silently refresh in the background if site content changed.
      buildIndex(() => {})
        .then((e) => (indexRef.current = e))
        .catch(() => {});
      return;
    }
    setStatus("Getting to know KamTech… (0/6 pages)");
    try {
      indexRef.current = await buildIndex(setStatus);
      setStatus(null);
    } catch (e) {
      console.error(e);
      setStatus("Sorry, the assistant couldn't start. Please use the contact page.");
    }
  }, []);

  useEffect(() => {
    void build();
  }, [build]);

  const ask = async (q: string) => {
    q = q.trim();
    if (!q || !indexRef.current || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setTyping(true);
    try {
      const [vec] = await embed([q]);
      const hits = rank(vec, indexRef.current, 3);
      const best = hits[0];
      const contact = isContactIntent(q);
      let reply: Msg;
      if (contact && best?.entry.id !== "contact") {
        // Pricing / hiring questions: don't answer with an unrelated section, route to contact.
        reply = { role: "bot", text: CONTACT_REPLY, contact: true, score: best?.score };
      } else if (!best || best.score < SIMILARITY_THRESHOLD) {
        reply = { role: "bot", text: FALLBACK, contact: true, score: best?.score };
      } else {
        const e = best.entry;
        reply = {
          role: "bot",
          text: truncateAtSentence(e.text, 400),
          link: { route: e.route, headingId: e.headingId, title: e.title },
          related: [
            ...new Set(
              hits
                .slice(1)
                .map((h) => h.entry.title)
                .filter((t) => t !== e.title),
            ),
          ],
          contact: contact || e.id === "contact",
          score: best.score,
        };
      }
      await new Promise((r) => setTimeout(r, 300));
      setMessages((m) => [...m, reply]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "bot", text: FALLBACK, contact: true }]);
    } finally {
      setTyping(false);
    }
  };

  const go = (route: string, headingId?: string) => {
    router.history.push(route);
    if (!headingId) return;
    let tries = 0;
    const find = () => {
      const el = Array.from(document.querySelectorAll("main h1,main h2,main h3,main h4")).find(
        (h) => slugify(h.textContent ?? "") === headingId,
      );
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (tries++ < 20) setTimeout(find, 100);
    };
    setTimeout(find, 150);
  };

  if (!open || (!mobile && !panel.pos)) return null;
  const ready = !status;

  return (
    <section
      role="dialog"
      aria-label="KamTech Assistant"
      style={
        mobile
          ? undefined
          : {
              left: panel.pos!.x,
              top: panel.pos!.y,
              width: W,
              height: H,
              transition: panel.animating ? "left 250ms ease, top 250ms ease" : undefined,
            }
      }
      className={`fixed z-[9998] flex flex-col overflow-hidden bg-card text-card-foreground shadow-lift ${mobile ? "inset-0" : "rounded-2xl border border-border"}`}
    >
      <header
        {...(mobile ? {} : panel.handlers)}
        style={{ touchAction: mobile ? undefined : "none" }}
        className={`relative flex select-none items-center gap-3 bg-primary px-4 py-3 text-primary-foreground ${mobile ? "" : panel.dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-display text-sm font-semibold">KamTech Assistant</div>
          <div className="text-xs opacity-80">Answers from this website</div>
        </div>
        <button
          type="button"
          aria-label="Chat menu"
          aria-haspopup="menu"
          aria-expanded={menu}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setMenu((m) => !m)}
          className="rounded-md p-1.5 hover:bg-primary-foreground/15"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Close chat"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="rounded-md p-1.5 hover:bg-primary-foreground/15"
        >
          <X className="h-4 w-4" />
        </button>
        {menu && (
          <div
            role="menu"
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-3 top-full z-10 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-popover py-1 text-sm text-popover-foreground shadow-lift"
          >
            {[
              [
                "Reset position",
                () => {
                  panel.reset();
                  resetButton();
                  localStorage.removeItem(PANEL_KEY);
                },
              ],
              ["Rebuild knowledge base", () => void build(true)],
              ["Clear conversation", () => setMessages([{ role: "bot", text: WELCOME }])],
            ].map(([label, fn]) => (
              <button
                key={label as string}
                role="menuitem"
                type="button"
                onClick={() => {
                  setMenu(false);
                  (fn as () => void)();
                }}
                className="block w-full px-3 py-2 text-left hover:bg-surface"
              >
                {label as string}
              </button>
            ))}
          </div>
        )}
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto bg-background p-4"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-card text-foreground"}`}
            >
              {m.role === "bot" && m.link && (
                <div className="mb-1 text-xs font-semibold text-primary">{m.link.title}</div>
              )}
              <p>{m.text}</p>
              {m.link && (
                <button
                  type="button"
                  onClick={() => go(m.link!.route, m.link!.headingId)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Read more <ArrowRight className="h-3 w-3" />
                </button>
              )}
              {m.contact && (
                <button
                  type="button"
                  onClick={() => go("/contact")}
                  className="mt-2 flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  Contact us <ArrowRight className="h-3 w-3" />
                </button>
              )}
              {!!m.related?.length && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Related:</span>
                  {m.related.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => ask(r)}
                      className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-surface-foreground hover:border-primary/40"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
              {import.meta.env.DEV && m.score != null && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  score {m.score.toFixed(3)}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-3">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK.map(([label, q]) => (
              <button
                key={label}
                type="button"
                disabled={!ready}
                onClick={() => ask(q)}
                className="rounded-full border border-primary/30 bg-brand-soft px-3 py-1 text-xs font-medium text-primary disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {status && (
        <div className="border-t border-border bg-surface px-4 py-2 text-xs text-muted-foreground">
          {status}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="flex items-center gap-2 border-t border-border bg-card p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Type your question"
          placeholder={ready ? "Ask about services, projects, skills…" : "Preparing…"}
          maxLength={300}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!ready || typing || !input.trim()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
