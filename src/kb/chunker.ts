import type { Chunk } from "./types";
import { clean, sentences, slugify } from "./text";

const HEADINGS = new Set(["H1", "H2", "H3"]);
const BLOCK_SKIP = "nav,header,footer,script,style,noscript,svg,form,[data-chat-widget]";

/** Text of an element with spaces between child elements. */
export function textOf(el: Node): string {
  if (el.nodeType === 3) return el.textContent ?? "";
  if (el.nodeType !== 1) return "";
  const parts: string[] = [];
  el.childNodes.forEach((c) => parts.push(textOf(c)));
  return parts.join(" ");
}

/** Split long text into ~500-char pieces at sentence boundaries. */
export function splitLong(text: string): string[] {
  if (text.length <= 800) return [text];
  const out: string[] = [];
  let cur = "";
  for (const s of sentences(text)) {
    if (cur && (cur + " " + s).length > 500) {
      out.push(cur);
      cur = s;
    } else cur = (cur + " " + s).trim();
  }
  if (cur) out.push(cur);
  return out;
}

function pushChunk(out: Chunk[], route: string, title: string, text: string) {
  title = clean(title);
  text = clean(text);
  const headingId = slugify(title);
  splitLong(text).forEach((piece, i) => {
    if (piece.length < 30) return;
    out.push({
      id: `${route}#${headingId}${i ? "-" + i : ""}-${out.length}`,
      title,
      text: piece,
      route,
      headingId,
    });
  });
}

/** Chunk a page root (already cleaned clone of <main>). */
export function chunkPage(root: Element, route: string, pageTitle: string): Chunk[] {
  root.querySelectorAll(BLOCK_SKIP).forEach((n) => n.remove());
  const out: Chunk[] = [];

  // Cards become their own chunks.
  root.querySelectorAll("article").forEach((card) => {
    const h = card.querySelector("h1,h2,h3,h4");
    const title = h ? textOf(h) : pageTitle;
    h?.remove();
    pushChunk(out, route, title, textOf(card));
    card.remove();
  });

  // Remaining content split by h1/h2/h3.
  let title = pageTitle;
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) pushChunk(out, route, title, buf.join(" "));
    buf = [];
  };
  const walk = (node: Node) => {
    if (node.nodeType === 1 && HEADINGS.has((node as Element).tagName)) {
      flush();
      title = clean(textOf(node)) || pageTitle;
      return;
    }
    if (node.nodeType === 3) {
      buf.push(node.textContent ?? "");
      return;
    }
    node.childNodes.forEach(walk);
    if (node.nodeType === 1) buf.push(" ");
  };
  walk(root);
  flush();
  return out;
}
