import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useDraggable } from "./useDraggable";

const ChatWidget = lazy(() => import("./ChatWidget"));
const SIZE = 56;
const BTN_KEY = "kamtech-chat-btn";

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const defaultPos = useCallback(
    () => ({ x: window.innerWidth - SIZE - 16, y: window.innerHeight - SIZE - 16 }),
    [],
  );
  const btn = useDraggable({ storageKey: BTN_KEY, width: SIZE, height: SIZE, snapToEdge: true, defaultPos });

  useEffect(() => {
    if (open) setLoaded(true);
  }, [open]);

  if (!btn.pos) return null;

  return (
    <div data-chat-widget>
      <button
        type="button"
        aria-label={open ? "Close KamTech Assistant" : "Open KamTech Assistant"}
        aria-expanded={open}
        {...btn.handlers}
        onKeyDown={btn.onKeyDown}
        onClick={() => {
          if (btn.wasDragged()) return;
          setOpen((o) => !o);
        }}
        style={{
          left: btn.pos.x,
          top: btn.pos.y,
          width: SIZE,
          height: SIZE,
          transition: btn.animating ? "left 250ms ease, top 250ms ease" : undefined,
          touchAction: "none",
        }}
        // On mobile the open panel is fullscreen with its own close button; hide the launcher so it doesn't cover the input.
        className={`${open ? "max-sm:hidden" : ""} fixed z-[9999] inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift ring-4 ring-brand-soft/70 outline-none focus-visible:ring-primary/40 ${btn.dragging ? "cursor-grabbing scale-105" : "cursor-pointer hover:scale-105"} transition-transform`}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {loaded && (
        <Suspense fallback={null}>
          <ChatWidget
            open={open}
            onClose={() => setOpen(false)}
            buttonPos={btn.pos}
            buttonSize={SIZE}
            resetButton={btn.reset}
          />
        </Suspense>
      )}
    </div>
  );
}
