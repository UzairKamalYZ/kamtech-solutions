export type Chunk = {
  id: string;
  title: string;
  text: string;
  route: string;
  headingId: string;
};

export type KBEntry = Chunk & { vectors: number[][] };

export type CrawledPage = { route: string; chunks: Chunk[] };
