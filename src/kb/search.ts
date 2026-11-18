import type { KBEntry } from "./types";

export const SIMILARITY_THRESHOLD = 0.45;

export const dot = (a: ArrayLike<number>, b: ArrayLike<number>) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

export type Hit = { entry: KBEntry; score: number };

export function rank(query: ArrayLike<number>, index: KBEntry[], k = 3): Hit[] {
  return index
    .map((entry) => ({ entry, score: Math.max(...entry.vectors.map((v) => dot(query, v))) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
