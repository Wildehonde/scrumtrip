// Post-build: rewrite root-relative URLs for a sub-path deploy (e.g. GitHub Pages /scrumtrip/).
import fs from 'node:fs'; import path from 'node:path';
const BASE = (process.env.BASE || '').replace(/\/$/,''); const SITE = process.env.SITE || 'https://scrumtrip.com';
if (!BASE && SITE==='https://scrumtrip.com') process.exit(0);
const walk = d => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for (const f of walk('dist')) {
  if (!/\.(html|xml|txt|ics|css|js)$/.test(f)) continue;
  let s = fs.readFileSync(f,'utf8'), o = s;
  s = s.replaceAll('https://scrumtrip.com/', SITE + BASE + '/').replaceAll('https://scrumtrip.com', SITE + BASE);
  if (/\.html$/.test(f)) {
    s = s.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`);
    s = s.replace(/(["'`])\/(ics|plan|js|tickets|visa|nations|cities|schedule|tracker)\//g, `$1${BASE}/$2/`);
    s = s.replace(/\$\{location\.origin\}\/plan\//g, `\${location.origin}${BASE}/plan/`);
  }
  if (s !== o) fs.writeFileSync(f, s);
}
console.log('rebased dist for', SITE + BASE);
