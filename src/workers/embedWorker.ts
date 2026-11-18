/// <reference lib="webworker" />
import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

type Extractor = (t: string[], o: object) => Promise<{ data: Float32Array; dims: number[] }>;
let extractor: Promise<Extractor> | null = null;

const getExtractor = () =>
  (extractor ??= pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    progress_callback: (p: { status: string; progress?: number }) =>
      self.postMessage({ type: "model-progress", status: p.status, progress: p.progress }),
  }) as unknown as Promise<Extractor>);

self.onmessage = async (e: MessageEvent<{ id: number; texts: string[] }>) => {
  const { id, texts } = e.data;
  try {
    const ext = await getExtractor();
    const out = await ext(texts, { pooling: "mean", normalize: true });
    const dim = out.dims[out.dims.length - 1];
    const vectors: number[][] = [];
    for (let i = 0; i < texts.length; i++)
      vectors.push(Array.from(out.data.slice(i * dim, (i + 1) * dim)));
    self.postMessage({ type: "result", id, vectors });
  } catch (err) {
    self.postMessage({ type: "error", id, error: String(err) });
  }
};
