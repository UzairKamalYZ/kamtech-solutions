import { createFileRoute } from "@tanstack/react-router";
import { Download, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { site } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KamTech Solutions" },
      {
        name: "description",
        content:
          "Get in touch with KamTech Solutions in Brussels. Email, phone, and a short project brief form.",
      },
      { property: "og:title", content: "Contact — KamTech Solutions" },
      {
        property: "og:description",
        content: "Start a conversation with KamTech Solutions about your next project.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title={<>Let's talk about what you're building.</>}
        subtitle="Send a short note about your project — what it does, who uses it, and where you're stuck. We reply to every enquiry within two working days."
      />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-7 md:p-9"
        >
          <h2 className="font-display text-xl font-semibold text-foreground">
            Project enquiry
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This form opens your email client with a draft message.
          </p>

          <div className="mt-6 grid gap-4">
            <Field label="Your name">
              <input
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Tell us about your project">
              <textarea
                required
                rows={6}
                maxLength={2000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:-translate-y-0.5 hover:transition-transform"
            >
              Send enquiry <Send className="h-4 w-4" />
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <InfoCard icon={Mail} label="Email">
            <a href={`mailto:${site.email}`} className="hover:text-primary">
              {site.email}
            </a>
          </InfoCard>
          <InfoCard icon={Phone} label="Phone">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-primary">
              {site.phone}
            </a>
          </InfoCard>
          <InfoCard icon={MapPin} label="Office">
            {site.location}
          </InfoCard>

          <div className="rounded-xl border border-dashed border-border bg-surface/40 p-6">
            <h3 className="font-semibold text-foreground">Company profile</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              A short PDF overview of KamTech Solutions, our services and recent engagements.
            </p>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              <Download className="h-4 w-4" />
              Download PDF · coming soon
            </button>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}
