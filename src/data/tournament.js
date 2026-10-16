import fs from 'node:fs';
export const venues = {
  'perth': {lat:-31.95104, lon:115.88908, name:'Perth Stadium', city:'perth', tz:'Australia/Perth'},
  'adelaide': {lat:-34.91559, lon:138.59616, name:'Adelaide Oval', city:'adelaide', tz:'Australia/Adelaide'},
  'docklands': {lat:-37.81653, lon:144.94752, name:'Docklands Stadium', city:'melbourne', tz:'Australia/Melbourne'},
  'stadium-australia': {lat:-33.84711, lon:151.06338, name:'Stadium Australia', city:'sydney', tz:'Australia/Sydney'},
  'sfs': {lat:-33.88916, lon:151.22514, name:'Sydney Football Stadium', city:'sydney', tz:'Australia/Sydney'},
  'brisbane': {lat:-27.46486, lon:153.00961, name:'Brisbane Stadium', city:'brisbane', tz:'Australia/Brisbane'},
  'townsville': {lat:-19.26623, lon:146.81643, name:'North Queensland Stadium', city:'townsville', tz:'Australia/Brisbane'},
  'newcastle': {lat:-32.91882, lon:151.7265, name:'Newcastle Stadium', city:'newcastle', tz:'Australia/Sydney'},
};
export const cities = {
  perth:{name:'Perth', state:'WA', blurb:'Hosts the opening match and two Round of 16 ties. Closest host city to South Africa.'},
  adelaide:{name:'Adelaide', state:'SA', blurb:'Pool-stage city with six matches at the iconic Adelaide Oval.'},
  melbourne:{name:'Melbourne', state:'VIC', blurb:'Roofed Docklands Stadium hosts pool games, two Round of 16 ties.'},
  sydney:{name:'Sydney', state:'NSW', blurb:'Two stadiums; Stadium Australia hosts two quarter-finals, both semis, the bronze final and the Final.'},
  brisbane:{name:'Brisbane', state:'QLD', blurb:'Busy pool and knockout hub, including two quarter-finals.'},
  townsville:{name:'Townsville', state:'QLD', blurb:'Tropical North Queensland host of four evening pool matches.'},
  newcastle:{name:'Newcastle', state:'NSW', blurb:'Coastal city two hours north of Sydney with five pool matches.'},
};
export const pools = {
  A:['New Zealand','Australia','Chile','Hong Kong China'],
  B:['South Africa','Italy','Georgia','Romania'],
  C:['Argentina','Fiji','Spain','Canada'],
  D:['Ireland','Scotland','Uruguay','Portugal'],
  E:['France','Japan','USA','Samoa'],
  F:['England','Wales','Tonga','Zimbabwe'],
};
export const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
export const teams = Object.entries(pools).flatMap(([p,ts])=>ts.map(t=>({name:t, slug:slug(t), pool:p})));
function offsetMin(tz, date){
  const s = new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset'}).formatToParts(date).find(x=>x.type==='timeZoneName').value;
  const m = s.match(/GMT([+-])(\d\d):?(\d\d)?/); if(!m) return 0;
  return (m[1]==='-'?-1:1)*(parseInt(m[2])*60+parseInt(m[3]||'0'));
}
const raw = fs.readFileSync(process.cwd()+'/src/data/raw.txt','utf8').trim().split('\n');
export const matches = raw.map((l,i)=>{
  const [date,stage,title,venue,ko]=l.split('|');
  const v=venues[venue];
  const naive=new Date(`${date}T${ko}:00Z`);
  const utc=new Date(naive.getTime()-offsetMin(v.tz,naive)*60000);
  const [home,away] = stage.length===1 ? title.split(' v ') : [null,null];
  return {id:i+1,date,stage,title,venue,venueName:v.name,lat:v.lat,lon:v.lon,city:v.city,cityName:cities[v.city].name,ko,utc:utc.toISOString(),home,away};
}).sort((a,b)=>a.utc.localeCompare(b.utc)).map((m,i)=>({...m,n:i+1}));
export const stageLabel = s => s.length===1?`Pool ${s}`:({R16:'Round of 16',QF:'Quarter-final',SF:'Semi-final',Bronze:'Bronze final',Final:'Final'})[s];
export function ics(list, name){
  const f=d=>d.replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');
  const ev=list.map(m=>{const s=f(m.utc);const e=f(new Date(new Date(m.utc).getTime()+2*3600e3).toISOString());
    return ['BEGIN:VEVENT',`UID:scrumtrip-${m.n}@scrumtrip.com`,`DTSTAMP:20261016T000000Z`,`DTSTART:${s}`,`DTEND:${e}`,`SUMMARY:${m.title} (${stageLabel(m.stage)})`,`LOCATION:${m.venueName}, ${m.cityName}, Australia`,'DESCRIPTION:Kick-off '+m.ko+' local time. Unofficial calendar by ScrumTrip.','END:VEVENT'].join('\r\n');});
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ScrumTrip//RWC2027//EN',`X-WR-CALNAME:${name}`,...ev,'END:VCALENDAR'].join('\r\n');
}
// Knockout paths from the official bracket (R16 slots -> QF -> SF -> Final)
const koBy = code => matches.find(m=>m.title.startsWith(code+':'));
const ord = {1:'1st',2:'2nd',3:'3rd'};
export function knockoutPaths(pool){
  const r16 = matches.filter(m=>m.stage==='R16');
  const find = pos => r16.filter(m=>{const slots=m.title.split(': ')[1].split(' v ');
    return slots.some(s=>{const x=s.match(/^(\d)\w\w Pool ([A-F/]+)$/); return x && x[1]==pos && x[2].split('/').includes(pool);});});
  return [1,2,3].map(pos=>({pos, label:`${ord[pos]} Pool ${pool}`, routes: find(pos).map(r=>{
    const code=r.title.split(':')[0]; const qf=matches.find(m=>m.stage==='QF'&&m.title.includes(`W ${code}`));
    const qc=qf.title.split(':')[0]; const sf=matches.find(m=>m.stage==='SF'&&m.title.includes(`W ${qc}`));
    const fin=matches.find(m=>m.stage==='Final');
    return {r16:r, qf, sf, final:fin};
  })})).filter(p=>p.routes.length);
}
// ---- Finish options (shared by nation pages and planner; same labels, order, set) ----
export function finishOptions(pool){
  const L={1:`Top Pool ${pool} (likely)`,2:`2nd in Pool ${pool}`,3:`Best 3rd in Pool ${pool}`};
  return [...knockoutPaths(pool).map(p=>({pos:p.pos,label:L[p.pos],paths:p.routes})),{pos:0,label:'Pool only',paths:[]}];
}
// ---- Opponent rule + guess. Guess = pools listed in draw-band order (band 1 first), i.e. seeding
// from the World Rugby rankings used for the 2025 draw. A GUESS, not a prediction.
import { identity as _id } from './identity.js';
const nick = t => _id[t]?.nick || t;
const slotsOf = m => m.title.split(': ')[1].split(' v ');
const W_RE=/^(?:W|Winner) (.+)$/;
function feeders(code){ const m=matches.find(z=>z.title.startsWith(code+':')); return slotsOf(m).flatMap(s=>{const w=s.match(W_RE); return w?feeders(w[1]):[s];}); }
function fav(side){ // favourite of a bracket side: {rank, teams}
  const w=side.match(W_RE);
  if(!w){ const x=side.match(/^(\d)\w\w Pool ([A-F/]+)$/); const r=+x[1]; const ps=x[2].split('/');
    return {rank:r, teams: r<3&&ps.length===1 ? [pools[ps[0]][r-1]] : []}; }
  const m=matches.find(z=>z.title.startsWith(w[1]+':')); const [a,b]=slotsOf(m).map(fav);
  return a.rank===b.rank ? {rank:a.rank, teams:[...a.teams,...b.teams]} : (a.rank<b.rank?a:b);
}
export function opponent(match, mySlot, self){
  const ss=slotsOf(match);
  const side = match.stage==='R16' ? ss.find(s=>s!==mySlot) : ss.find(s=>{const w=s.match(W_RE); return !feeders(w[1]).includes(mySlot);});
  let ruleTxt;
  if(match.stage==='R16') ruleTxt=`v ${side}`;
  else { const w=side.match(W_RE); const f=feeders(w[1]); ruleTxt = f.length===2 ? `v winner of ${f.join(' v ')}` : f.length===4 ? `v winner of ${w[1]} (${f.slice(0,2).join(' v ')} / ${f.slice(2).join(' v ')} side)` : `v winner of ${w[1]}`; }
  const g=fav(side); const teams=[...new Set(g.teams)].filter(t=>t!==self);
  if(!teams.length || teams.length>3 || g.rank===3) return {rule:ruleTxt, guess:null};
  return {rule:ruleTxt, guess:teams.map(nick).join(' or ')};
}

// Per-team knockout plan: options (same as buttons) with each match + opponent rule/guess
export const KO_STAGES=[['R16','Round of 16'],['QF','Quarter-finals'],['SF','Semi-finals'],['Final','Final']];
export function teamKnockouts(team){
  const pool=teams.find(t=>t.name===team).pool;
  return finishOptions(pool).map(o=>({pos:o.pos,label:o.label, items:o.paths.flatMap(r=>{
    const slot=slotsOf(r.r16).find(x=>{const m=x.match(/Pool ([A-F/]+)$/); return m&&m[1].split('/').includes(pool)&&x.startsWith(['','1st','2nd','3rd'][o.pos]);});
    return [r.r16,r.qf,r.sf,r.final].map(m=>({m, ...opponent(m,slot,team)}));
  })}));
}
