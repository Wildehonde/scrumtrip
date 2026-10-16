import { matches, teams, ics } from '../../data/tournament.js';
export function getStaticPaths(){
  return [{params:{file:'all'}}, ...teams.map(t=>({params:{file:t.slug}})), ...matches.map(m=>({params:{file:`match-${m.n}`}}))];
}
export function GET({ params }){
  const f=params.file; let list, name;
  if(f==='all'){list=matches;name='RWC 2027 – all matches';}
  else if(f.startsWith('match-')){list=matches.filter(m=>`match-${m.n}`===f);name=list[0].title;}
  else {const t=teams.find(t=>t.slug===f);list=matches.filter(m=>m.home===t.name||m.away===t.name);name=`${t.name} – RWC 2027`;}
  return new Response(ics(list,name),{headers:{'Content-Type':'text/calendar'}});
}
