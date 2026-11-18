export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Split into sentences. */
export function sentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

/** Cut text to ~max chars at a sentence end. */
export function truncateAtSentence(text: string, max = 400): string {
  if (text.length <= max) return text;
  let out = "";
  for (const s of sentences(text)) {
    if ((out + " " + s).trim().length > max) break;
    out = (out + " " + s).trim();
  }
  return out || text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export function hashString(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}
