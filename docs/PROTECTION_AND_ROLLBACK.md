# LearnTheStrat v2: Production Protection and Rollback

**Rule for this project:** production stays stable and development happens separately. Production is replaced only after the new version is fully reviewed and the owner intentionally approves the cutover.

Last updated: 2026-10-05 (Phase 0 complete).

---

## 1. Current state at a glance

| Item | Value |
|---|---|
| Repository | `primo157/learnthestrat` |
| Production branch | `main` @ `b458d02` ("Add files via upload", 2025‑11‑16) |
| Production source folder | `learnthestrat-deploy (1)/` (**never modified by this project**) |
| Production hosting | Vercel project linked to this repo (confirmed by owner), domain learnthestrat.com |
| Production build | `npm install && npm run build` → `dist/`, Vite 4 + React 18 + Tailwind 3; `vercel.json` says `nodeVersion: 18.x` |
| Baseline tag | `prod-baseline-2025-11-16` → `b458d02` |
| Development branch | `claude/magical-tesla-s8oui1` |
| Development folder | `site/` (duplicate of production; all v2 work happens here) |
| Staging | New, separate Vercel project (to be created by owner, see §4) |

### Environment variables and integrations found in code
**None.** The production code uses no environment variables (`import.meta.env` is never referenced). It has:
- no analytics script
- no forms
- no email provider
- no API calls
- no outbound links (every CTA is a `<button>` with no action)

Things that may still exist **only in the Vercel dashboard**, which I can't see. The owner should record them (see §3):
- Vercel Web Analytics or Speed Insights toggles
- Environment variables set but unused
- Domain and `www` redirect configuration
- The project's Node.js version setting and Root Directory setting
- Deploy hooks or integrations

---

## 2. What was done in Phase 0

1. **Baseline tag.** `prod-baseline-2025-11-16` is an annotated tag on `b458d02`, the exact code currently on `main`.
2. **Off-GitHub backups**, created in `backups/`. That folder is git-ignored and exists only in the work environment, so **the owner should keep their own copy**: see §3 for how to make one in 30 seconds.
   - `learnthestrat-prod-baseline.bundle` is a full git bundle of all history, verified with `git bundle verify`.
   - `learnthestrat-prod-baseline-b458d02.zip` is a zip of the production commit.
   - SHA-256: zip `8e68adf2…ba3793`, bundle `73ad68d2…4d9d`.
3. **Duplicate.** `learnthestrat-deploy (1)/` was copied byte-for-byte to `site/` (commit `bd21a38`). `diff -r` confirms they're identical.
4. **Duplicate verified working:**
   - The untouched original was built in a scratch copy, outside the repo, so the original folder was never touched.
   - Both builds succeeded and produced **identical asset hashes** (`index-184e5e57.js`, `index-7cad4232.css`).
   - Both were served and loaded in Chromium at 1280×800 and 390×844. Each returned HTTP 200 with the same title and the same six sections, and **zero console errors or warnings**.
   - The screenshots are visually identical. Byte differences come only from in-flight animations (the pulse badge and the counter). Production baseline screenshots are saved in `docs/baseline-screenshots/`.
5. **Reproducible builds for the duplicate only** (commit `13a6ae0`): `site/package-lock.json` was added, and Node is pinned to 22.x in `site/package.json` (`engines`) and `site/vercel.json`. Re-verified with a clean `npm ci && npm run build`, and the output is identical. **The production folder still has no lockfile and still says Node 18; that's deliberate, so production stays untouched.**
6. **Nothing was changed on:**
   - `main` or the production folder
   - the Vercel project, its environment variables or its domains
   - DNS, analytics, email or Discord

---

## 3. Owner actions before development continues (≈10 minutes, recommended)

These cover the parts of the safety net that live outside the repo and that I can't access.

1. **Keep your own copy of the code.** On GitHub, go to Tags → `prod-baseline-2025-11-16` → *Download ZIP*, and store it somewhere outside GitHub (Drive, Dropbox, your computer).
2. **Record the Vercel production project.** Screenshot these pages for the current production project:
   - **Settings → General**: Framework, Root Directory, Build and Output settings, Node.js Version.
   - **Settings → Domains**: learnthestrat.com, `www`, and the redirect between them.
   - **Settings → Environment Variables**: names only. Don't share the values.
   - **Settings → Git**: Production Branch.
   - **Deployments**: the current Production deployment's URL and ID. **This deployment is the real rollback target.**
3. **Don't change anything on that project** until cutover.

---

## 4. Staging setup (owner creates once; it doesn't touch production)

1. In Vercel, choose **Add New → Project** and import `primo157/learnthestrat` *again*. This creates a **second** project, e.g. `learnthestrat-v2`.
2. Set **Root Directory** to `site`. Keep the default Vite build for now; Phase 1 switches it to Astro and the config will be committed in `site/`.
3. Set **Settings → Git → Production Branch** to `claude/magical-tesla-s8oui1`.
4. **Do not add a custom domain.** Staging lives at `learnthestrat-v2.vercel.app` or similar.
5. Kit API keys and form IDs go into **this project's** environment variables only. Also add `PUBLIC_SITE_ENV=staging`.

Isolation guarantees:
- The two Vercel projects share no settings, env vars, domains or analytics.
- Pushes to the dev branch also create *Preview* deployments on the original project. Those build the old folder and never become Production.
- Staging will send `noindex`, both as a header and as a meta tag, whenever `PUBLIC_SITE_ENV !== 'production'`. Google won't index a duplicate of the site.

---

## 5. Things that could affect production, and how each is prevented

| Risk | Prevention |
|---|---|
| Merging the dev branch into `main` | No merge happens without the owner's explicit approval at launch. |
| Editing `learnthestrat-deploy (1)/` | The project rule is never to touch it. A reviewer can check this with `git diff prod-baseline-2025-11-16 -- "learnthestrat-deploy (1)"`, which must be empty. |
| Rebuilding production fails or changes appearance | `main` has no lockfile, uses `lucide-react@latest` (today 1.52.0; the version live in Nov 2025 was likely older) and targets deprecated Node 18. **Never "Redeploy" production with build cache off as a fix.** Roll back to an existing deployment instead (§6). |
| Staging gets indexed by Google | `noindex` on staging; the sitemap is submitted only at launch. |
| Accidental domain or DNS change | Domains are moved only during cutover, by the owner. DNS doesn't need to change at all, because Vercel moves the domain between projects. |
| Shared secrets | Staging gets its own env vars; production has none. |

---

## 6. Rollback plan

### During development
There's nothing to roll back, because production is untouched. Any bad change in `site/` is reverted with `git revert` on the dev branch.

### At launch (recommended cutover)
1. In the **new** project, add `learnthestrat.com` (and `www`) under Settings → Domains. Vercel moves the domain away from the old project.
2. The old project and its last Production deployment remain intact, untouched.

### Rollback after launch (about 1 minute, no rebuild)
- **Option A (if cutover used the domain move):** in the **old** project, go to Settings → Domains and add `learnthestrat.com` (and `www`) back. Traffic returns to the original deployment.
- **Option B (if cutover was done inside the old project):** go to **Deployments**, find the pre-launch Production deployment (recorded in §3), then **⋯ → Instant Rollback** (or "Promote to Production").
- Check the result: load `https://learnthestrat.com` in a private window, hard-refresh, and confirm the "Trade with Precision" page matches `docs/baseline-screenshots/`.

### Last resort (if the Vercel deployment itself is gone)
1. Check out tag `prod-baseline-2025-11-16`, or restore it from the bundle or zip.
2. Build `learnthestrat-deploy (1)/` with the lockfile from commit `13a6ae0` (`site/package-lock.json`). That reproduces the verified build from 2026-10-05.
3. Deploy that build.

### Redirects
The current site has exactly one URL (`/`), and the new site keeps `/`. Before launch, the indexed URLs in Google Search Console will be checked, and every URL that would change gets a 301 in the new `vercel.json`.

---

## 7. Production Launch Checklist (draft; finalized before cutover)

Nothing is pointed at the new version until **every** box is checked and the owner approves in writing.

- [ ] All major pages reviewed on staging
- [ ] Mobile tested (iOS Safari and Android Chrome) and desktop tested (Chrome, Safari, Firefox)
- [ ] Navigation, search, breadcrumbs, TOC and related links work
- [ ] Kit forms submit and deliver the Catalyst Playbook; the Week Ahead signup works
- [ ] Discord, Stratalyst and PAL links are correct, with UTMs
- [ ] Analytics records page views and CTA events
- [ ] No console or runtime errors on any route (automated Playwright crawl)
- [ ] Lighthouse mobile scores ≥ 95 for Performance and SEO on representative pages
- [ ] Rich Results test passes for Article, Breadcrumb, FAQ and DefinedTerm
- [ ] No `NeedsPrimo` placeholders on published pages (the build enforces this)
- [ ] Old URLs checked against Search Console and redirects in place
- [ ] `PUBLIC_SITE_ENV=production` set; `noindex` removed on production only
- [ ] Production deployment ID recorded as the rollback target (§3)
- [ ] The owner has intentionally approved replacing production
