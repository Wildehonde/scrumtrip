// ScrumTrip flight price fetcher (Travelpayouts / Aviasales Data API v3 prices_for_dates).
// Needs TRAVELPAYOUTS_TOKEN in env (sent as a header; never printed or written to disk).
// Tries Sep 2027, then Oct 2027; if the API has no fares that far out it falls back to the
// cheapest fare currently cached for the route (any date) and marks it "indicative".
import fs from 'node:fs';
const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
if (!TOKEN) { console.log('No TRAVELPAYOUTS_TOKEN set. Skipping.'); process.exit(0); }
import { ORIGINS, DESTS } from '../src/data/origins.js';
const api = async q => { const r = await fetch(`https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${q}&currency=usd&sorting=price&limit=1&one_way=true`, { headers: { 'X-Access-Token': TOKEN } });
  if (!r.ok) return null; const j = await r.json(); return j?.data?.[0] || null; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = { fetchedAt: new Date().toISOString(), source: 'Aviasales (Travelpayouts Data API)', currency: 'usd', note: 'Cheapest cached one-way fare. Indicative = no fares cached yet for Sep-Oct 2027, so the nearest available date is shown.', routes: {} };
const origins = [...new Set(Object.values(ORIGINS).flat())];
for (const o of origins) for (const d of DESTS) {
  let best = null, indicative = false;
  for (const m of ['2027-09', '2027-10']) { best = await api(`origin=${o}&destination=${d}&departure_at=${m}`); await sleep(250); if (best) break; }
  if (!best) { best = await api(`origin=${o}&destination=${d}`); indicative = !!best; await sleep(250); }
  out.routes[`${o}-${d}`] = best ? { price: best.price, departure: best.departure_at.slice(0, 10), airline: best.airline, transfers: best.transfers, indicative } : null;
}
fs.writeFileSync('src/data/prices/live.json', JSON.stringify(out, null, 1));
const hf = 'src/data/prices/history.json'; const hist = fs.existsSync(hf) ? JSON.parse(fs.readFileSync(hf, 'utf8')) : {};
for (const [k, v] of Object.entries(out.routes)) if (v) (hist[k] ??= []).push({ date: out.fetchedAt.slice(0, 10), price: v.price, indicative: v.indicative });
fs.writeFileSync(hf, JSON.stringify(hist, null, 1));
const n = Object.values(out.routes).filter(Boolean).length;
console.log(`Saved ${n}/${Object.keys(out.routes).length} routes with data (${Object.values(out.routes).filter(v => v && !v.indicative).length} for Sep-Oct 2027).`);
