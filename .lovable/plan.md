## KamTech Solutions — Portfolio Website (Static, Phase 1)

A clean, enterprise-feeling portfolio site that positions KamTech Solutions as an IT freelance company, not a personal CV. All content seeded from your uploaded resume, structured for an easy upgrade to dynamic later.

### Design direction
- **Palette:** Cloud White — off-white `#fafbfc` background, soft gray `#e8ecf1` surfaces, slate `#94a3b8` muted, electric blue `#3b82f6` as the single accent. Tokens added to `src/styles.css` in oklch.
- **Typography:** Sora (display/headings) + Manrope (body), loaded via `@fontsource` packages.
- **Layout system:** Hero-grid — big confident hero on every page, followed by card grids for services, projects, skills.
- **Tone:** Quiet, precise, enterprise-credible. Sharp 8px radii, generous whitespace, one tasteful gradient accent (blue → light blue) reserved for hero/CTAs, subtle elevation shadows.

### Site map (separate routes, not hash anchors)
| Route | Purpose |
| --- | --- |
| `/` | Hero, company positioning, services preview, featured projects, skills overview, CTA |
| `/about` | Company story (framed as KamTech Solutions, founded by Uzair Kamal), mission, values, snapshot stats (15+ years, 6 companies, Brussels-based) |
| `/services` | Service offerings — Enterprise Java/Spring, Cloud & DevOps, Data/AI engineering, API integrations, Modernization & consulting |
| `/projects` | Project cards grouped as **Current** (Isabel 6, Isabel Connect, CCTool) and **Previous** (Sentiance, Ansell SmartSheet, IntuiRA, SanMar Design Center, Pakistan Railways RTS) — each with description + tech stack |
| `/skills` | Categorized skill grid — Languages, Frameworks, Cloud/DevOps, Data/AI, Testing, Frontend |
| `/contact` | Email + phone, contact form (static — opens mailto for now), location (Brussels, Belgium), languages, "Download Company Profile" button (placeholder; wire to real PDF later) |

Shared header (logo + nav) and footer (copyright, contact, languages) on all pages. Each route gets unique `head()` meta (title, description, OG tags) for SEO.

### Content seeded from resume
- Company identity: KamTech Solutions, Brussels-based IT consultancy
- Founder profile (About page): 15+ years building enterprise software across banking (Isabel), AI/ML (Sentiance, IntuiRA), and large-scale platforms
- Projects populated from each role on resume
- Skills aggregated and grouped from the resume's digital skills section
- Trainings (AWS AI/ML Scholar, CKA & CKAD) shown on About as credentials
- Languages on Contact/About

### Technical approach
- TanStack Start file-based routing — one route file per page
- Shared `Header` and `Footer` components in `src/components/site/`
- Reusable `ServiceCard`, `ProjectCard`, `SkillGroup` components
- Project + skill data in plain TS files under `src/data/` so the Phase 2 dynamic upgrade is just swapping the source (DB/CMS) without touching components
- Lucide icons for service/skill iconography
- `@fontsource/sora` + `@fontsource/manrope` installed and imported
- All colors via semantic tokens (`bg-background`, `text-foreground`, `text-primary`, etc.) — no hardcoded hex in components
- Subtle motion: hero fade-in, card hover lift (CSS transitions only — no extra deps)

### Phase 2 readiness (not built now, but structured for it)
- Data files isolated so they can be replaced by Lovable Cloud queries later
- Contact form component shaped to accept an `onSubmit` so wiring to a backend later is a one-line change
- "Download Company Profile" button is a placeholder link — easy to point at a real PDF/asset later

### Out of scope for this build
- Lovable Cloud / database (Phase 2)
- Real contact form submission (mailto for now)
- Blog / CMS
- Auth, admin panel

After approval, I'll set the preview to desktop, install the fonts, scaffold all routes and components, and seed the content from your resume.
