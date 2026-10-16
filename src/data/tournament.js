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
