import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KamTech Solutions — Enterprise software engineering, Brussels" },
      {
        name: "description",
        content:
          "KamTech Solutions is a Brussels-based IT consultancy specializing in enterprise Java, cloud platforms, and data/AI engineering for banking and regulated industries.",
      },
      { property: "og:title", content: "KamTech Solutions — Enterprise software engineering" },
      {
        property: "og:description",
        content:
          "Independent IT consultancy building dependable banking, data and platform software from Brussels.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = projects.filter((p) => p.status === "current").slice(0, 3);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Brussels · Independent IT consultancy"
        title={
          <>
            Engineering software that <span className="text-primary">enterprises trust</span>.
          </>
        }
        subtitle={site.description}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
          >
            See our work <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            What we do
          </Link>
        </div>

        <div className="relative mt-12 max-w-2xl overflow-hidden rounded-2xl bg-foreground px-8 py-8 shadow-glow">
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative grid grid-cols-3 gap-6">
            {[
              { value: "15+", label: "Years building production systems" },
              { value: "20M+", label: "End users served via our platforms" },
              { value: "B2B", label: "Banking · AI · enterprise" },
            ].map((s, i) => (
              <div key={s.label} className={i > 0 ? "border-l border-primary-foreground/15 pl-6" : ""}>
                <div className="font-display text-2xl font-semibold text-brand-soft md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-primary-foreground/60 md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Services preview */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Services
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              How we help engineering teams ship
            </h2>
          </div>
          <Link
            to="/services"
            className="hidden text-sm font-medium text-primary hover:underline md:inline-flex"
          >
            All services →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
              <div className="mt-5 h-1 w-0 rounded-full bg-primary transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-y border-border/60 bg-surface/40 py-20">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Currently building
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Active engagements
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featured.map((p) => (
              <article
                key={p.slug}
                className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
              >
                <div className="text-xs font-medium uppercase tracking-wider text-primary">
                  {p.client}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                  {p.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((t) => (
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

          <div className="mt-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skills snapshot */}
      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Toolkit
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              A deep, opinionated stack.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From low-level JVM tuning to streaming pipelines and modern frontends — we pick
              the right tool for the job, not the trendiest one.
            </p>
            <Link
              to="/skills"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Browse full skill set <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.slice(0, 4).map((g) => (
              <div key={g.title} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {g.skills.slice(0, 6).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-10 md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Have a system that needs a steady pair of hands?
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Let's talk about your platform, the team behind it, and where KamTech can help.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant hover:-translate-y-0.5 hover:transition-transform"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
