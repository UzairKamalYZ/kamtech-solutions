import { del, get, set } from "idb-keyval";
import { crawlSite } from "./crawler";
import { embed } from "./embedClient";
import { questionsFor } from "./questions";
import { hashString } from "./text";
import type { KBEntry } from "./types";

const CACHE_KEY = "kamtech-kb-v1";
type Cached = { hash: string; entries: KBEntry[] };

export async function clearIndexCache() {
  await del(CACHE_KEY);
}

export async function buildIndex(onProgress: (msg: string) => void): Promise<KBEntry[]> {
  const pages = await crawlSite((d, t) => onProgress(`Getting to know KamTech… (${d}/${t} pages)`));
  const chunks = pages.flatMap((p) => p.chunks);
  const hash = hashString(chunks.map((c) => c.title + "|" + c.text).join("\n"));
  const cached = await get<Cached>(CACHE_KEY).catch(() => undefined);
  if (cached?.hash === hash) return cached.entries;

  onProgress("Loading language model…");
  const firstIds = new Set(pages.map((p) => p.chunks.find((c) => c.id !== "contact")?.id));
  const entries: KBEntry[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    onProgress(`Learning content… (${i + 1}/${chunks.length})`);
    const texts = [`${c.title}. ${c.text}`.slice(0, 1000), ...questionsFor(c, firstIds.has(c.id))];
    entries.push({ ...c, vectors: await embed(texts) });
  }
  await set(CACHE_KEY, { hash, entries } satisfies Cached).catch(() => {});
  return entries;
}

/** Fast path: use cached index without crawling when available. */
export async function loadCachedIndex(): Promise<KBEntry[] | null> {
  const cached = await get<Cached>(CACHE_KEY).catch(() => undefined);
  return cached?.entries ?? null;
}
