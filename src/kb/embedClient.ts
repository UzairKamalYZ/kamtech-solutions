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
  return worker;
}

export function embed(texts: string[]): Promise<number[][]> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, texts });
  });
}
