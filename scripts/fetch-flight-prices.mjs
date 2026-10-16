// ScrumTrip flight price fetcher (Travelpayouts / Aviasales Data API).
// NOT ACTIVE: needs TRAVELPAYOUTS_TOKEN (free partner account, not created yet).
// Without a token it exits and leaves the EXAMPLE data file untouched.
// Endpoint below follows Travelpayouts' documented "prices_for_dates" v3 API. Confirm against current docs before enabling.
import fs from 'node:fs';
const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const ROUTES = [ // origin IATA -> host-city IATA, departure month
  ['JNB','PER'],['JNB','SYD'],['CPT','PER'],['LHR','SYD'],['DUB','PER'],['AKL','SYD'],['EZE','BNE'],['CDG','MEL'],['NRT','BNE'],['EDI','MEL'],
];
const MONTH = '2027-09'; // fly in late Sep for 1 Oct start
if (!TOKEN) { console.log('No TRAVELPAYOUTS_TOKEN set. Skipping; site keeps showing EXAMPLE data.'); process.exit(0); }
const out = { generatedAt: new Date().toISOString(), isExample: false, currency: 'usd', routes: {} };
for (const [o,d] of ROUTES) {
  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${o}&destination=${d}&departure_at=${MONTH}&currency=usd&sorting=price&limit=1&token=${TOKEN}`;
  const r = await fetch(url); const j = await r.json();
  const best = j?.data?.[0];
  const file = `src/data/prices/history.json`;
  const hist = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : {};
  (hist[`${o}-${d}`] ??= []).push({ date: out.generatedAt.slice(0,10), price: best?.price ?? null });
  fs.writeFileSync(file, JSON.stringify(hist,null,1));
  out.routes[`${o}-${d}`] = hist[`${o}-${d}`];
}
fs.writeFileSync('src/data/prices/latest.json', JSON.stringify(out,null,1));
console.log('Saved', Object.keys(out.routes).length, 'routes');
// Run daily (e.g. Cloudflare Cron / GitHub Actions), then rebuild the site.
