const CACHE_NAME = 'bqc-v2-fixed-1';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c)=>c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys)=>Promise.all(keys.map((k)=>k===CACHE_NAME?null:caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Cache-first for same-origin GET
  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then((cached)=> cached || fetch(req).then((res)=>{
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c)=>c.put(req, copy));
        return res;
      }).catch(()=>cached))
    );
  }
});
