# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A **static marketing website** for **FinAxis Financial Services Limited** (finaxis.co.in) — an India-based financial services / lending firm (business loans, working capital, retail loans, wealth management, insurance). Mumbai-based, rated 5.0 on Google (151 reviews).

There is **no framework and no backend app** — it is plain HTML/CSS/JS files served statically, built on the **Canvas** HTML theme. Forms post to **Web3Forms** (client-side); a few legacy PHP handlers exist in `include/` but are mostly unused.

## Critical architecture facts

- **No templating / no shared includes.** Every page has its **own full copy of the `<head>`, `<header>` and `<footer>`**. There is no build step that injects them. Changing the nav or footer means editing **every** HTML file. This is the #1 source of drift — see "Site-wide edits" below.
- **URLs are extensionless in production.** Canonicals and `og:url` use `/about`, `/working-capital`, etc. (the host rewrites to `.html`). Internal links still use `.html` and that's fine. When adding a page, set `<link rel="canonical">` to the extensionless form and add the extensionless URL to `sitemap.xml`.
- **Pages are flat in the repo root.** Blog posts are `blog-<slug>.html` (NOT in a `/blog/` folder) specifically so relative asset paths keep working. Keep new pages in root.
- **Brand system:** colors `#264653` (dark) + `#0a9646` (green); fonts **Manrope** (body) + **DM Serif Text** (headings). Reuse these, not new ones.

## Page inventory (80 HTML files)

- **Core:** `index.html`, `about.html`, `faqs.html`, `gallery.html`, `careers.html`, `fldg.html`
- **Services:** `working-capital.html`, `corporate-funding.html`, `bridge-funding.html`, `retail-loans.html`, `wealth-management.html`, `insurance.html`
- **Lead/feature pages:** `become-partner.html`, `reviews.html`
- **Calculators:** `calculators.html` (hub) + `emi-calculator.html`, `loan-eligibility-calculator.html`, `sip-calculator.html`, `fd-calculator.html`
- **Blog:** `blog.html` (hub) + **60** `blog-<slug>.html` articles

## CSS conventions (`css/`)

- `style.css`, `font-icons.css`, `animate.css`, `swiper.css` — **Canvas theme vendor CSS** (don't edit).
- `custom.css` — global brand overrides.
- **`wc-container.css`** — the in-house design system (`.wc-hero`, `.wc-section`, `.wc-section-alt`, `.wc-card`, `.wc-eyebrow`, `.wc-section-title`, `.wc-enquiry*`, etc.). **Reuse these classes** for any new section — most service/feature pages are built from them.
- Feature-scoped stylesheets, reuse where possible: `emi-calculator.css` (reused by all calculators), `calculators.css` (hub grid), `blog.css`, `reviews.css`, `about.css`, `service-accordion.css` (`.fx-accordion*`), `sidebar-mobile.css` (mobile drawer).

## JS conventions (`js/`)

- Mostly Canvas theme vendor bundles (`functions.bundle.js`, `plugins.min.js`, etc.) — don't edit.
- **In-house, dependency-free** (vanilla JS IIFEs, no jQuery dependency): `emi-calculator.js`, `sip-calculator.js`, `fd-calculator.js`, `loan-eligibility.js`, `sidebar-mobile.js`. Calculators draw their donut charts on a raw `<canvas>` (no chart library). INR formatting uses `toLocaleString("en-IN")`.
- **`sidebar-mobile.js`** powers the mobile nav drawer: it moves `.sidebar-custom` to `<body>` (to escape the header's stacking context), adds a backdrop, locks scroll, and exposes `window.showsidebar` / `window.hidesidebar` (every page's hamburger calls these inline).

## Site-wide edits (nav / footer)

Because there are no includes, propagate nav/footer changes with a **small idempotent Perl script** that edits every `*.html`. This is the established pattern; examples live in `Content/_extract/` (gitignored): `navfix.pl` (primary menu + mobile sidebar + footer), `footer-reviews.pl`. They:
1. anchor on an existing item (e.g. the Gallery `<li>`),
2. skip if the link is already present (idempotent),
3. insert before the anchor.

The current nav set on every page: Home, Services (submenu), About, **Become a Partner**, **EMI Calculator**, **Blog**, Gallery, FAQs. Footer Company column also includes **Reviews**.

> `index.html` is the one page with a **hand-different** header/footer structure (no Gallery in its primary menu) — scripts that anchor on Gallery won't match it, so handle index manually.

## Adding a new page

1. Easiest: copy an existing similar page (e.g. `become-partner.html`) or generate it with an assembler script that lifts the `<header>`/`<footer>` from `become-partner.html` (see `Content/_extract/*-assemble.pl`).
2. Per-page SEO is required: unique `<title>`, meta description, `<link rel="canonical">` (extensionless), OG + Twitter tags, exactly **one `<h1>`**, and appropriate **JSON-LD** (`FinancialService` / `WebApplication` / `BlogPosting` / `FAQPage` / `AggregateRating`).
3. Add the extensionless URL to `sitemap.xml`.
4. If it should appear in nav/footer, run/extend the site-wide script.

## Build tooling

- **Gulp** (`gulpfile.js`) — SCSS compile, CSS/JS/HTML minify, image compression, BrowserSync dev server (`gulp watch`). Output → `dist/`. Note: there's no `package.json` in the repo, so `npm install` setup is needed before gulp runs.
- **No Node/Python/pandoc/ImageMagick** is reliably available in this environment. Use **Perl** (for HTML/text processing) and **PowerShell + .NET `System.Drawing`** (for image resize/compress) — that's how the blog images were compressed (~1.8 MB PNG → ~110 KB JPEG, max-width 1200, quality 82).

## The `Content/` folder (gitignored)

- Holds source material + build scripts and is **git-ignored on purpose** — it contains a **105 MB `FinAxis Blogs.docx`** that must never be committed/pushed.
- `Content/_extract/` holds the reusable generator/assembler scripts (`build.pl` parses the docx into the 60 blog posts; `*-assemble.pl` build feature pages; `navfix.pl`/`footer-reviews.pl` do site-wide nav edits). Keep these here; they're handy for regeneration but shouldn't ship.

## Content gotchas

- **Watch for the `" ,"` artifact** — earlier AI/Word content replaced em-dashes with comma-no-space (`"firms ,combining"`). Fix to em-dashes/proper punctuation when you see it.
- **Don't fabricate testimonials/reviews.** Only real, attributable reviews (the `/reviews` page uses genuine Google reviews + real `AggregateRating`). Fake review schema risks Google penalties and is legally dicey for a finance (YMYL) site.
- Placeholders are marked with `<!-- TODO -->` (e.g. About-page stats and team roles, partner-program payout figures) — surface these, don't invent numbers.

## Git

- Work is committed to `main`; remote is `origin` (github.com/KS-Hrishi/finaxis-uat-demo).
- Only commit/push when asked. Never commit `Content/` (the 105 MB docx).
