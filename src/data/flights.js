// Live Aviasales fares (written by scripts/fetch-flight-prices.mjs) + affiliate deep links.
import fs from 'node:fs';
import { ORIGINS, DESTS, CITY_IATA, IATA_NAME } from './origins.js';
export { ORIGINS, DESTS, CITY_IATA, IATA_NAME };
export const MARKER = '586463';
const f = process.cwd() + '/src/data/prices/live.json';
export const live = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : { fetchedAt: null, routes: {} };
export const checked = live.fetchedAt ? new Date(live.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Johannesburg' }) : null;
// Aviasales search deep link: /search/{ORIG}{DDMM}{DEST}1 = one-way, 1 adult.
export const avLink = (o, d, date = '2027-09-28') => `https://www.aviasales.com/search/${o}${date.slice(8, 10)}${date.slice(5, 7)}${d}1?marker=${MARKER}`;
export const fare = (o, d) => live.routes[`${o}-${d}`] || null;
