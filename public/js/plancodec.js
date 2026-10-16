// Shared encode/decode for ScrumTrip plans. Plan -> compact JSON -> deflate-raw -> base64url (prefix "z"), fallback plain base64url (prefix "p").
(function(g){
 const b64u = bytes => { let s=''; bytes.forEach(b=>s+=String.fromCharCode(b)); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); };
 const unb64u = str => { str=str.replace(/-/g,'+').replace(/_/g,'/'); while(str.length%4) str+='='; const s=atob(str); return Uint8Array.from(s,c=>c.charCodeAt(0)); };
 async function pipe(bytes, stream){ const r = new Blob([bytes]).stream().pipeThrough(stream); return new Uint8Array(await new Response(r).arrayBuffer()); }
 const pack = p => JSON.stringify({v:1,t:p.team,m:p.matches,a:p.arrive,d:p.depart,h:p.home,n:p.name,g:p.mates});
 const unpack = o => ({team:o.t,matches:o.m||[],arrive:o.a,depart:o.d,home:o.h,name:o.n,mates:o.g});
 g.encodePlan = async p => { const raw = new TextEncoder().encode(pack(p));
   if (typeof CompressionStream!=='undefined') return 'z'+b64u(await pipe(raw,new CompressionStream('deflate-raw')));
   return 'p'+b64u(raw); };
 g.decodePlan = async s => { const k=s[0], bytes=unb64u(s.slice(1));
   const raw = k==='z' ? await pipe(bytes,new DecompressionStream('deflate-raw')) : bytes;
   return unpack(JSON.parse(new TextDecoder().decode(raw))); };
})(typeof window!=='undefined'?window:globalThis);
