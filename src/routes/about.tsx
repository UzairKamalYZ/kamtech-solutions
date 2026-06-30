import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Heart, Target } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { languages, certifications } from "@/data/skills";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — KamTech Solutions" },
      {
        name: "description",
        content:
          "KamTech Solutions is an independent Brussels-based IT consultancy founded by senior software engineer Uzair Kamal.",
      },
      { property: "og:title", content: "About — KamTech Solutions" },
      {
        property: "og:description",
        content:
          "Who we are, what we believe, and why we built KamTech Solutions.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About"
        title={<>A small consultancy with an enterprise spine.</>}
        subtitle="KamTech Solutions is an independent IT consultancy based in Brussels. We partner with companies that need senior engineering minds embedded in their teams — not contractors, not body shops."
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            The studio was founded on a simple belief: most enterprise software pain doesn't come
            from missing frameworks — it comes from missing judgment. Over {site.yearsExperience}+
            years building platforms in banking, AI/ML, search, and high-volume data systems,
            we've learned that the most valuable engineer in the room is the one who knows what
            <em> not </em> to build.
          </p>
          <p>
            That perspective shapes everything we do at KamTech. We bring the same engineering
            rigor we apply at Isabel — Belgium's multibanking backbone — to every engagement,
            whether you're scaling a payment platform, modernizing a legacy estate, or shipping
            your first production API.
          </p>
          <p>
            Today the company operates out of Brussels, working with European enterprises and
            ambitious teams that care about software the way good engineers do.
          </p>

          <div className="grid gap-4 pt-6 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Outcomes over output",
                body: "We measure ourselves by working software in your users' hands.",
              },
              {
                icon: Compass,
                title: "Senior by default",
                body: "Every engagement gets engineers who've shipped at scale.",
              },
              {
                icon: Heart,
                title: "Long-term partnership",
                body: "We optimize for the next 5 years, not the next sprint.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-5">
                <v.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Founder
            </h3>
            <p className="mt-3 font-display text-lg font-semibold text-foreground">Uzair Kamal</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Senior Software Engineer · Brussels
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Belgian software engineer with a BS in Computer Engineering from UET Peshawar and
              a career spanning Pakistan, Belgium, and remote engagements with global teams.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Languages
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {languages.map((l) => (
                <li key={l.name} className="flex justify-between gap-3">
                  <span className="text-foreground">{l.name}</span>
                  <span className="text-muted-foreground">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Recent training
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {certifications.map((c) => (
                <li key={c.name}>
                  <div className="font-medium text-foreground">{c.name}</div>
                  <div className="text-muted-foreground">
                    {c.issuer} · {c.period}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="container-page pb-20">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:-translate-y-0.5 hover:transition-transform"
        >
          Work with KamTech <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </SiteShell>
  );
}
