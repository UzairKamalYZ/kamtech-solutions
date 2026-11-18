import type { Chunk, CrawledPage } from "./types";
import { chunkPage, textOf } from "./chunker";
import { clean } from "./text";

export const SEED_ROUTES = ["/", "/services", "/projects", "/skills", "/about", "/contact"];

function normalizeHref(href: string | null): string | null {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  const path = href.split("#")[0].split("?")[0];
  return path.length > 1 ? path.replace(/\/$/, "") : "/";
}

function loadInIframe(route: string): Promise<{ doc: Document; dispose: () => void }> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.cssText =
      "position:fixed;left:-10000px;top:0;width:1280px;height:900px;visibility:hidden;pointer-events:none;";
    iframe.src = route;
    const dispose = () => iframe.remove();
    iframe.onload = () => {
      const doc = iframe.contentDocument!;
      let timer: ReturnType<typeof setTimeout>;
      const done = () => {
        obs.disconnect();
        clearTimeout(timer);
        clearTimeout(max);
        resolve({ doc, dispose });
      };
      const obs = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(done, 500);
      });
      obs.observe(doc, { subtree: true, childList: true, characterData: true });
      timer = setTimeout(done, 500);
      const max = setTimeout(done, 5000);
    };
    document.body.appendChild(iframe);
  });
}

function contactChunk(doc: Document): Chunk | null {
  const links = Array.from(doc.querySelectorAll("a[href]")) as HTMLAnchorElement[];
  const email = links
    .find((a) => a.getAttribute("href")!.startsWith("mailto:"))
    ?.getAttribute("href")!
    .slice(7);
  const phone = links.find((a) => a.getAttribute("href")!.startsWith("tel:"))?.textContent?.trim();
  const linkedin = links.find((a) => /linkedin\.com/i.test(a.href))?.href;
  const body = clean(textOf(doc.body));
  const address = body.match(/Brussels,?\s*Belgium/i)?.[0];
  const parts = [
    "You can reach KamTech Solutions directly.",
    email && `Email: ${email}.`,
    phone && `Phone: ${phone}.`,
    address && `Office: ${address}.`,
    linkedin && `LinkedIn: ${linkedin}.`,
    "Send a short note about your project via the contact form — we reply within two working days.",
  ].filter(Boolean);
  return {
    id: "contact",
    title: "Contact KamTechSolutions",
    text: parts.join(" "),
    route: "/contact",
    headingId: "",
  };
}

export async function crawlSite(
  onProgress?: (done: number, total: number) => void,
): Promise<CrawledPage[]> {
  const queue = [...SEED_ROUTES];
  const seen = new Set(queue);
  const pages: CrawledPage[] = [];
  for (let i = 0; i < queue.length; i++) {
    const route = queue[i];
    onProgress?.(i, queue.length);
    const { doc, dispose } = await loadInIframe(route);
    try {
      doc.querySelectorAll("a[href]").forEach((a) => {
        const r = normalizeHref(a.getAttribute("href"));
        if (r && !seen.has(r)) {
          seen.add(r);
          queue.push(r);
        }
      });
      const main = (doc.querySelector("main") ?? doc.body).cloneNode(true) as Element;
      const pageTitle = clean(doc.title.split("—")[0]) || route;
      const chunks = chunkPage(main, route, pageTitle);
      if (route === "/contact") {
        const c = contactChunk(doc);
        if (c) chunks.push(c);
      }
      pages.push({ route, chunks });
    } finally {
      dispose();
    }
  }
  onProgress?.(queue.length, queue.length);
  return pages;
}
