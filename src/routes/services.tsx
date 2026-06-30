import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { services } from "@/data/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — KamTech Solutions" },
      {
        name: "description",
        content:
          "Enterprise Java, cloud & DevOps, data and AI engineering, system integration, modernization, and technical consulting from KamTech Solutions.",
      },
      { property: "og:title", content: "Services — KamTech Solutions" },
      {
        property: "og:description",
        content:
          "What KamTech Solutions does — and how we partner with engineering teams in banking and enterprise.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Services"
        title={<>What we build, and how we build it.</>}
        subtitle="Six focused practices, each backed by 15+ years of production engineering. We work as senior contributors inside your team, not as outside consultants throwing decks over a wall."
      />

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.title}
              className="rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
                {s.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-surface-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
