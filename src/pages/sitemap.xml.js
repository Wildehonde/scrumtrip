import { teams, cities } from '../data/tournament.js';
export function GET(){
  const paths=['/','/schedule/','/nations/','/cities/','/tracker/','/visa/','/plan/','/tickets/',...teams.map(t=>`/nations/${t.slug}/`),...Object.keys(cities).map(c=>`/cities/${c}/`)];
  const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p=>`<url><loc>https://scrumtrip.com${p}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(xml,{headers:{'Content-Type':'application/xml'}});
}
