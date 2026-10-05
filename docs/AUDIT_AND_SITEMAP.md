# LearnTheStrat v2: Audit, Information Architecture and Sitemap

Status: approved plan, written 2026-10-05. Phase 0 (protection) is complete; see [PROTECTION_AND_ROLLBACK.md](./PROTECTION_AND_ROLLBACK.md).
Phase 1 has **not** started and waits for the owner's go-ahead.

Decisions confirmed by the owner:
- Production deploys on Vercel from this repo.
- The new build uses **Astro**.
- The brand is **LearnTheStrat by Primo**, crediting Rob Smith as creator of The Strat.
- Email runs on **Kit (ConvertKit)**.

Baseline screenshots of the current production site are in [`baseline-screenshots/`](./baseline-screenshots/).

## 1. Audit of the current site

**Repository:** `primo157/learnthestrat`. It has 1 commit (`b458d02`, "Add files via upload", 2025‑11‑16) on `main` and 9 files, all in `learnthestrat-deploy (1)/`:
- Vite 4 + React 18 + Tailwind 3 + lucide-react. The whole site is one component in `src/learnthestrat.com.jsx` (610 lines, exported as `Landing50K`).
- `vercel.json`: `npm install && npm run build`, output `dist`, framework vite, **nodeVersion 18.x**.
- No router, no other URLs, no environment variables (`import.meta.env` is never used), no analytics, no forms, no favicon/OG image, no robots.txt or sitemap.

**Page sections:** nav (logo SVG, "Join Free Discord"), hero ("Trade with Precision"), a VSL video *placeholder*, "Everything Included" (4 cards), a "4-step system", "Member Results" (3 testimonials), pricing (Free Discord vs $100/mo "Full Access" with a 3-day trial), a final CTA and a footer with a risk disclaimer.

**Critical findings**
1. **None of the CTAs do anything.** Every "Join Free Discord" and "Start 3-Day Free Trial" control is a `<button>` with no `href` or `onClick`. The site currently converts no one.
2. **Google sees nothing.** The site is rendered on the client into an empty `<div id="root">`. It has one generic title and description, and no OG, canonical or schema tags.
3. **The VSL is a placeholder.** It shows "Click to watch VSL" with no video.
4. **Trust risk.** It has testimonials (Alex M., Jordan K., Sam T.), a "1000+ Members" counter and "No credit card required". If any of these aren't verifiably true, they're a compliance and credibility liability.
5. **Brand risk.** `companyName: 'TheStrat'` reads as the official Strat source.
6. **The design conflicts with your brief.** It leans on neon green, glow blobs, pulsing badges, scale-on-hover and the "This Is Your Moment" urgency copy you said you don't want.
7. **Code quality:**
   - Duplicate scroll listeners and a scroll-driven re-render on every frame.
   - Unused refs and state (`canvasRef`, `sceneRef`, `candlesRef`, `isMobile`).
   - Non-existent Tailwind classes (`text-10xl`, `scale-200`, `animate-in…`).
   - The Inter font is referenced but never loaded.
   - A `<style>` tag is injected at runtime.
8. **Build reproducibility risk, which matters for rollback:**
   - There's no lockfile and `lucide-react` is pinned to `"latest"`, so a rebuild today won't match what's live.
   - `nodeVersion: 18.x` is deprecated on Vercel, so a fresh rebuild of `main` may fail.
   - **Rollback must therefore rely on the already-built Vercel deployment, not on rebuilding.**

**Missing entirely:** education content, routing, SEO, email capture, newsletter, glossary, search, case studies, Stratalyst/PAL pages, analytics, legal pages (privacy, terms, risk disclosure), a 404 page, favicon and OG images.

## 2. Keep / improve / merge / remove

| Existing element | Decision |
|---|---|
| Risk disclaimer | **Keep.** Expand it into a `/disclaimer` page and a footer line on every page. |
| 4-step system (Catalyst → Signal → Execute → Scale) | **Improve.** It becomes the core framework: Catalyst → Reaction → Strat Confirmation → Entry → Target → Risk. |
| "Everything Included" (premarket, live room, watchlists, course) | **Move** to `/price-action-lab`. |
| Pricing ($100/mo, 3-day trial) | **Move** to `/price-action-lab` once you confirm the price and trial are current. |
| Free Discord CTA | **Keep**, with a real link, under Community. |
| Testimonials / "1000+" counter | **Remove** unless they're real and attributable. If real, bring them back on the PAL page. |
| VSL placeholder | **Remove** from home. Use real YouTube embeds (lazy-loaded facade) inside lessons. |
| Hero, animations, neon styling | **Replace** with a calm, typographic, chart-led design system. |
| `/` URL | **Keep.** It's the only existing URL, so there's no redirect debt. Before launch I'll check Search Console for any indexed variants (`/index.html`, `www`) and add redirects. |

## 3. What should change (architecture decisions)
- **Astro (static output)** in a new folder. Every page is pre-rendered HTML with near-zero JS. Only search, the TOC highlighter and forms ship JS, as small islands.
- **Content collections with Zod schemas** (`lessons`, `glossary`, `caseStudies`, `guides`, `leadMagnets`). Lessons are authored in **MDX** with reusable components. Content is plain files in git: easy to add, review and diff.
- **Search: Pagefind.** It builds a static index at build time and loads only when someone opens search. There's no server or monthly cost, and "failed 2U" finds the right lesson.
- **Content accuracy guardrail.** Each lesson separates `<StratConcept>` (established Strat knowledge) from `<PrimosMethod>` (your execution).
  - Where your method isn't documented, I insert `<NeedsPrimo topic="…"/>`. It shows a visible yellow placeholder on staging.
  - **The production build fails if any published page still contains one.** No invented rules can ship.
- **SEO built in.** One `<SEO>` component handles title, description, canonical, OG/Twitter, and JSON-LD (`Article`, `BreadcrumbList`, `FAQPage`, `DefinedTerm`, `Course`). Pages also get breadcrumbs, a sitemap via `@astrojs/sitemap`, robots.txt and auto-generated OG images.
- **Topic clusters.** Every lesson declares a `cluster`, `prerequisites` and `related`. Hub pages, "Next lesson" and "Related" blocks are generated from that data, so internal linking is structural rather than manual.
- **Analytics-ready.** Every CTA uses a `data-track` and `data-cta` attribute model behind a tiny adapter, and outbound Stratalyst/PAL links get UTMs (`utm_content=<lesson-slug>`). That attributes customers to topics. The provider (Vercel Web Analytics or Plausible) is chosen at launch.
- **Content engine.** Lesson frontmatter has a `source` field (YouTube ID) and a `repurpose` checklist (article, email, PDF, tweets, shorts, Discord post). Every video → article → derivative chain is tracked in one place. No AI automation yet.

## 4. Information architecture

Primary nav: **Learn ▾** (Start Here · The Strat · Setups · Timeframes · Price Action · Catalysts · Opening Range · Options · Risk) · **Resources ▾** (Case Studies · Glossary · Week Ahead · Guides/Downloads · Videos) · **Stratalyst** · **Price Action Lab**. Search (⌘K) sits in the header.

URL pattern: `/learn/{cluster}/{slug}`. Clusters are stable and meaningful to users and Google, and breadcrumbs mirror the URL. I'm recommending `/learn` over `/docs` because it matches search intent and reads more human. The section has its own landing page at `/learn`.

## 5. Complete sitemap
Phase 1 pages are marked ★. Every other page gets its route, schema entry and draft scaffold later, and stays unpublished until written.

```
/                                   Home (education-first; framework; start-here path; Playbook CTA) ★
/learn                              Learning hub (all clusters, beginner path) ★
/learn/start-here                   Start Here + 10-step recommended path ★
  /learn/start-here/what-is-the-strat ★
  /learn/start-here/how-the-strat-works
  /learn/start-here/terminology
  /learn/start-here/how-to-read-candles
  /learn/start-here/three-candle-scenarios
  /learn/start-here/multiple-timeframes
  /learn/start-here/how-primo-uses-the-strat   (needs Primo)

/learn/the-strat                    Cluster hub ★
  scenario-1 ★ · scenario-2 ★ · scenario-3 ★ · directional-changes
  actionable-signals ★ · failed-2s ★ (covers failed 2U / failed 2D, with anchors)
  broadening-formations ★ · full-timeframe-continuity

/learn/setups                       Setup library hub
  1-2-2 · 2-1-2 · 3-1-2 · 3-2 · 2-2-continuation · 2-2-reversal
  failed-2u · failed-2d · outside-bar-reversal · inside-bar-breakout
  (each uses the 11-section setup template)

/learn/timeframes                   Cluster hub
  timeframe-continuity ★ · bullish-tfc · bearish-tfc · mixed-tfc
  quarterly · monthly · weekly · daily · 2-hour · 1-hour · 30-minute · 15-minute
  higher-timeframes-control-lower · top-down-trading-plan (needs Primo)

/learn/price-action                 Cluster hub
  previous-day-high-low · previous-week-high-low · previous-month-high-low
  opening-price · premarket-high-low · gap-ups-gap-downs · gap-fills · vwap
  support-resistance-price-structure · opening-range-reversals
  (high/low pairs are combined into one page each: same concept, stronger page; glossary terms point to anchors)

/learn/catalysts                    Cluster hub
  catalysts-and-the-strat ★ · what-is-a-catalyst · why-catalysts-create-opportunity
  trade-the-reaction · scheduled-vs-unscheduled
  earnings · guidance · cpi · jobs-report · jolts · ism-pmi · fomc · fed-speakers
  investor-days · product-events · monthly-sales · upgrades-downgrades
  buybacks · sector-news · company-headlines

/learn/opening-range                Cluster hub
  opening-range-breakouts ★ · 15-minute-orb · 30-minute-orb · orb-economic-data
  orb-and-the-strat · failed-orbs · choosing-an-opening-range

/learn/options                      Cluster hub
  why-trade-options · weeklies-vs-0dte ★ · choosing-expiration · choosing-strikes
  liquidity-bid-ask · position-sizing-options · scaling-out-partials-runners
  strangles · earnings-strangles · event-strangles · gamma-exposure-gex · gex-with-price-action

/learn/risk                         Cluster hub
  risk-management ★ · position-sizing · sizing-for-zero · max-daily-loss
  max-trades-per-day · when-to-stop-trading · cutting-losing-options
  scaling-out-of-winners · revenge-trading · fomo · cash-is-a-position
  you-dont-need-to-trade-every-day · you-cant-catch-every-move

/glossary                           A–Z index ★
  /glossary/{term}                  1, 2u, 2d, 3, ftfc, pdh, pdl, pwh, pwl, pmh, pml, orb, vwap,
                                    gex, gamma, catalyst, actionable-signal, broadening-formation,
                                    inside-bar, outside-bar … ★ (structure + first ~20 terms)
/case-studies                       Index (filter by setup, catalyst, ticker) ★ (template + empty state)
  /case-studies/{ticker-yyyy-mm-dd-setup}
/week-ahead                         Primo's Week Ahead: newsletter landing + archive ★ (landing)
  /week-ahead/{yyyy-mm-dd}
/downloads                          Lead magnets
  /downloads/catalyst-playbook ★ (Kit form)   · strat-cheat-sheet · tfc-cheat-sheet · orb-playbook · risk-checklist
/videos                             YouTube library mapped to lessons
/stratalyst                         "LearnTheStrat teaches the setup. Stratalyst finds the opportunity." ★ (short page)
/price-action-lab                   PAL: course, premarket, live, community, pricing ★ (short page)
/community                          Free Discord
/about                              Primo + Rob Smith / The Strat attribution ★
/disclaimer · /privacy · /terms     ★
/search                             Pagefind results page (also ⌘K modal) ★
/404                                ★
/sitemap-index.xml · /robots.txt · /rss.xml  ★
```

## 6. Phase 1 scope (starts only after owner approval)
1. Convert `site/` to Astro + Tailwind + MDX + `@astrojs/sitemap` + Pagefind (Node 22, lockfile, no `latest` pins).
2. Design system:
   - Tokens: neutral ink and paper, one restrained accent, and bull/bear colors used only in charts.
   - Typography: Inter or similar, self-hosted. Light and dark modes.
   - Components: `ChartFigure` (responsive, lazy images) and a `Candle` SVG diagram component, so scenario visuals are crisp, tiny and themable.
3. Layouts: `BaseLayout` (SEO, header, footer, disclaimer), `LessonLayout` (title, one-liner, difficulty, read time, related; sticky desktop TOC; Key Takeaway, Common Mistakes, Real Example, FAQ, Related, CTA) and a setup variant with the 11 required sections.
4. Content schemas for lessons, glossary, caseStudies, leadMagnets and weekAhead, including the CTA fields (`leadMagnet`, `stratalystCta`, `palCta`) and the `NeedsPrimo` build guard.
5. Header and mobile nav, ⌘K search, breadcrumbs, and hub pages generated from the collections.
6. Kit integration: one `EmailCapture` component (inline/compact variants) posting to Kit's form endpoint. The Catalyst Playbook download page, Week Ahead landing and inline CTAs come from it. No popups.
7. Glossary structure and the first ~20 terms. Case-study template and empty index. Short Stratalyst and PAL pages. About, legal and 404 pages.
8. 12 cornerstone lessons, written with established Strat concepts only. Every personal-method section is a `NeedsPrimo` placeholder for you to fill:
   - What Is The Strat
   - Scenario 1, 2 and 3
   - Timeframe Continuity
   - Actionable Signals
   - Failed 2s
   - Broadening Formations
   - ORBs
   - Catalysts + The Strat
   - Risk Management
   - Weeklies vs 0DTE
9. Analytics adapter plus UTM'd outbound links. Lighthouse budget: ≥95 performance and SEO on mobile for lesson pages.

**Inputs needed from you, by Phase 1. None of them block Phase 0:**
- URLs for Discord, Stratalyst, PAL signup/checkout and YouTube.
- Confirm the PAL price and trial.
- Are the testimonials and the "1000+" figure real?
- Kit form IDs for the Playbook and Week Ahead, plus the Playbook PDF.
- Logo files.
- Chart screenshots for lessons.

