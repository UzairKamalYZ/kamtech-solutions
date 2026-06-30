import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { projects, type Project } from "@/data/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — KamTech Solutions" },
      {
        name: "description",
        content:
          "Selected work from KamTech Solutions — Isabel multibanking, Sentiance AI, IntuiRA knowledge platform, and more across 15+ years.",
      },
      { property: "og:title", content: "Projects — KamTech Solutions" },
      {
        property: "og:description",
        content:
          "A portfolio of enterprise platforms, banking APIs, and data/AI systems built and maintained by KamTech Solutions.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const current = projects.filter((p) => p.status === "current");
  const previous = projects.filter((p) => p.status === "previous");

  return (
    <SiteShell>
      <PageHero
        eyebrow="Selected work"
        title={<>Platforms we've shipped and still ship.</>}
        subtitle="From multibanking APIs serving thousands of Belgian organizations to AI-driven mobility platforms — a snapshot of the systems behind the headlines."
      />

      <section className="container-page py-16">
        <ProjectGroup title="Current engagements" items={current} />
        <div className="mt-16">
          <ProjectGroup title="Previous work" items={previous} />
        </div>
      </section>
    </SiteShell>
  );
}

function ProjectGroup({ title, items }: { title: string; items: Project[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {items.map((p) => (
          <article
            key={p.slug}
            className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">{p.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{p.client}</p>
              </div>
              <span className="shrink-0 rounded-md border border-border bg-surface px-2 py-1 text-xs text-surface-foreground">
                {p.period}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-surface px-2 py-0.5 text-xs text-surface-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
