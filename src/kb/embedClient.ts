let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (v: number[][]) => void; reject: (e: Error) => void }>();
export let onModelProgress: ((status: string, progress?: number) => void) | null = null;
export const setModelProgressListener = (fn: typeof onModelProgress) => (onModelProgress = fn);

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/embedWorker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (e) => {
    const m = e.data;
    if (m.type === "model-progress") return onModelProgress?.(m.status, m.progress);
    const p = pending.get(m.id);
    if (!p) return;
    pending.delete(m.id);
    if (m.type === "result") p.resolve(m.vectors);
    else p.reject(new Error(m.error));
  };
  // If the worker fails to load or throws at top level, fail all pending calls
  // instead of leaving them hanging, and allow a fresh worker on the next call.
  worker.onerror = (e) => {
    e.preventDefault();
    const err = new Error(`Embedding worker failed: ${e.message || "unknown error"}`);
    for (const p of pending.values()) p.reject(err);
    pending.clear();
    worker?.terminate();
    worker = null;
  };
  return worker;
}

export function embed(texts: string[]): Promise<number[][]> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, texts });
  });
}
