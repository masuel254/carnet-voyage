const CACHE = 'carnet-voyage-v5';

// Coeur de l'app : indispensable, mis en cache en bloc.
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './jr-pass.png',
];

// Images des fiches Infos : optionnelles, mises en cache une par une.
// Une image absente sur GitHub ne doit PAS empecher l'installation du SW.
const IMAGES = [
  './changi-t1.jpg',
  './jewel-changi.jpg',
  './rain-vortex-show.jpg',
  './tim-ho-wan-jewel.jpg',
  './pan-pacific-orchard-hotel.jpg',
  './mondrian-duxton-hotel.jpg',
  './candeo-osaka-hotel.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(CORE).then(() =>
        // chaque image est ajoutee individuellement ; on ignore les 404
        Promise.all(IMAGES.map(url =>
          cache.add(url).catch(() => null)
        ))
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
