// Offline-Cache. Wird beim Bauen automatisch hochgezählt.
const VERSION='rrm-web-4';
const SHELL=['./', 'index.html', 'fonts.css', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'fonts/archivo-latin-400-normal.woff2', 'fonts/archivo-latin-500-normal.woff2', 'fonts/archivo-latin-600-normal.woff2', 'fonts/archivo-latin-700-normal.woff2', 'fonts/ibm-plex-mono-latin-400-normal.woff2', 'fonts/ibm-plex-mono-latin-500-normal.woff2', 'fonts/ibm-plex-mono-latin-600-normal.woff2', 'fonts/saira-condensed-latin-600-normal.woff2', 'fonts/saira-condensed-latin-700-normal.woff2', 'fonts/saira-condensed-latin-800-normal.woff2', 'fonts/cabin-sketch-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  if(new URL(req.url).origin!==location.origin)return; // Zählung u. a. nicht cachen
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(VERSION).then(x=>x.put(req,c))}return r})));
});
