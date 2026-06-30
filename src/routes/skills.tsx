import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { skillGroups, certifications } from "@/data/skills";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Stack — KamTech Solutions" },
      {
        name: "description",
        content:
          "The full KamTech Solutions toolkit — languages, frameworks, cloud, data and AI, testing, and infrastructure.",
      },
      { property: "og:title", content: "Skills & Stack — KamTech Solutions" },
      {
        property: "og:description",
        content: "A categorized look at the tools KamTech uses in production.",
      },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Skills & stack"
        title={<>The tools behind the work.</>}
        subtitle="Production-tested across banking, mobility, search, and enterprise platforms. Grouped by what they actually do, not by buzzwords."
      />

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div
              key={g.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                {g.title}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-surface-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Certifications & training
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {certifications.map((c) => (
              <div
                key={c.name}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.issuer}</p>
                </div>
                <span className="shrink-0 rounded-md bg-surface px-2 py-1 text-xs text-surface-foreground">
                  {c.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
