// Offline-Cache für den Kettenblatt-Cup. Bei jeder neuen Version VERSION hochzählen.
const VERSION='kbc-web-12';
const SHELL=['./','index.html','fonts.css','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','fonts/black-ops-one-latin-400-normal.woff2','fonts/saira-condensed-latin-500-normal.woff2','fonts/saira-condensed-latin-700-normal.woff2','fonts/playfair-display-latin-900-normal.woff2','fonts/playfair-display-latin-700-normal.woff2','fonts/playfair-display-latin-400-italic.woff2','fonts/unifrakturmaguntia-latin-400-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('kbc-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  if(new URL(req.url).origin!==location.origin)return;
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(VERSION).then(x=>x.put(req,c))}return r})));
});
