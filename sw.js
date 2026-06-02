const CACHE = 'carnet-voyage-v13';

const CORE = [
  './',
  './index.html',
  './manifest.json',
  './jr-pass.png',
];

const IMAGES = [
  './arashiyama-lunch.jpg',
  './bambouseraie.jpg',
  './buddha-temple.jpg',
  './candeo-osaka-hotel.jpg',
  './canyon-club.jpg',
  './cela-vi-skybar.jpg',
  './changi-t1.jpg',
  './chemin-philosophes.jpg',
  './clarke-quay.jpg',
  './daikokuya.jpg',
  './dotonbori-nuit.jpg',
  './dotonbori.jpg',
  './fushimi-inari.jpg',
  './garden-rhapsody.jpg',
  './gardens-by-the-bay.jpg',
  './genbaku-dome.jpg',
  './ginkakuji.jpg',
  './gion.jpg',
  './glico-man.jpg',
  './gyumon.jpg',
  './inari-brunch.jpg',
  './itsukushima.jpg',
  './jewel-changi.jpg',
  './kimono-asakusa.jpg',
  './kinkakuji.jpg',
  './kiyomizudera.jpg',
  './maxwell.jpg',
  './merlion-park.jpg',
  './minami-machiya.jpg',
  './mondrian-duxton-hotel.jpg',
  './mont-misen.jpg',
  './nakamise.jpg',
  './nara-deer.jpg',
  './nara-lunch.jpg',
  './nijojo.jpg',
  './nishiki.jpg',
  './okonomiyaki.jpg',
  './omoide-yokocho.jpg',
  './omotesando-miyajima.jpg',
  './osaka-jo.jpg',
  './pan-pacific-orchard-hotel.jpg',
  './peace-museum.jpg',
  './premier-repas.jpg',
  './rain-vortex-show.jpg',
  './river-cruise.jpg',
  './satay-by-the-bay.jpg',
  './sensoji.jpg',
  './shinjuku-apt.jpg',
  './shinsaibashi.jpg',
  './skyspa-candeo.jpg',
  './skytree.jpg',
  './spectra.jpg',
  './sri-temple.jpg',
  './sumida-cruise.jpg',
  './sumida-walk.jpg',
  './sumo-kyoto.jpg',
  './supertree-grove.jpg',
  './tanjong-beach.jpg',
  './tenryuji.jpg',
  './the-maiko.jpg',
  './tim-ho-wan-jewel.jpg',
  './tmg-building.jpg',
  './todaiji.jpg',
  './toji.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(CORE).then(() =>
        Promise.all(IMAGES.map(url => cache.add(url).catch(() => null)))
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
