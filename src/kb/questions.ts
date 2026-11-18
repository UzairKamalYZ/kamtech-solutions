import type { Chunk } from "./types";
import { sentences } from "./text";

export const templateQuestions = (t: string) => [
  t,
  `What is ${t}?`,
  `Tell me about ${t}`,
  `Do you offer ${t}?`,
  `Can you help with ${t}?`,
  `Experience with ${t}?`,
];

type Intent = { questions: string[]; target: "contact" | string };

export const INTENTS: Intent[] = [
  { target: "/services", questions: ["What services do you offer?", "What does KamTech do?"] },
  {
    target: "/projects",
    questions: ["What are you working on?", "Show me your projects", "Who are your clients?"],
  },
  {
    target: "/skills",
    questions: [
      "What technologies do you use?",
      "Do you know Java?",
      "Do you know Spring?",
      "Do you know AWS?",
      "Do you know Kubernetes?",
      "Do you know React?",
    ],
  },
  { target: "/about", questions: ["Who is behind KamTechSolutions?", "Where are you based?"] },
  {
    target: "contact",
    questions: [
      "How can I contact you?",
      "I want to hire you",
      "Can we schedule a call?",
      "Are you available?",
    ],
  },
];

/** Questions to embed for a chunk. `firstOfRoute` marks the first chunk of its page. */
export function questionsFor(chunk: Chunk, firstOfRoute: boolean): string[] {
  const qs = templateQuestions(chunk.title);
  for (const intent of INTENTS) {
    const hit =
      intent.target === "contact"
        ? chunk.id === "contact"
        : firstOfRoute && chunk.route === intent.target;
    if (hit) qs.push(...intent.questions);
  }
  const first = sentences(chunk.text)[0];
  if (first && first.length > 15) qs.push(first);
  return qs;
}

const CONTACT_INTENT =
  /\b(price|prices|pricing|cost|costs|rate|rates|fee|fees|hire|hiring|budget|quote|available|availability|how much|tariff|salary|day ?rate)\b/i;

export const isContactIntent = (q: string) => CONTACT_INTENT.test(q);
