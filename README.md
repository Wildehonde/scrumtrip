# ScrumTrip
Unofficial Rugby World Cup 2027 trip planner (static Astro site). Not affiliated with World Rugby or Rugby World Cup 2027.
- `npm ci && npm run build` → `dist/` (set `SITE` and `BASE` env for sub-path hosting, e.g. `SITE=https://wildehonde.github.io BASE=/scrumtrip`).
- Deploys to GitHub Pages via `.github/workflows/pages.yml` (Settings → Pages → Source: GitHub Actions).
- Flight prices: `scripts/fetch-flight-prices.mjs` (needs `TRAVELPAYOUTS_TOKEN`; site shows EXAMPLE data until then).
