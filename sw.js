const CACHE = 'carnet-voyage-20260618-184146';

const CORE = [
  './',
  './index.html',
  './manifest.json',
  './jr-pass.png',
];

const IMAGES = [
  './akihabara-arcades.jpg',
  './arashiyama-lunch.jpg',
  './bambouseraie.jpg',
  './buddha-temple.jpg',
  './candeo-osaka-hotel.jpg',
  './canyon-club.jpg',
  './cela-vi-skybar.jpg',
  './central-park.jpg',
  './changi-t1.jpg',
  './chemin-philosophes.jpg',
  './clarke-quay.jpg',
  './daikokuya.jpg',
  './don-quijote.jpg',
  './dotonbori-nuit.jpg',
  './dotonbori.jpg',
  './fushimi-inari.jpg',
  './garden-rhapsody.jpg',
  './gardens-by-the-bay.jpg',
  './genbaku-dome.jpg',
  './ginkakuji.jpg',
  './gion.jpg',
  './glico-man.jpg',
  './godzilla.jpg',
  './golden-gai.jpg',
  './gundam-odaiba.jpg',
  './gyumon.jpg',
  './haneda-ichiba.jpg',
  './inari-brunch.jpg',
  './itsukushima.jpg',
  './jewel-changi.jpg',
  './kimono-asakusa.jpg',
  './kinkakuji.jpg',
  './kiyomizudera.jpg',
  './maid-cafe.jpg',
  './maxwell.jpg',
  './meiji.jpg',
  './merlion-park.jpg',
  './minami-machiya.jpg',
  './mondrian-duxton-hotel.jpg',
  './mont-misen.jpg',
  './nakamise.jpg',
  './nara-deer.jpg',
  './nara-lunch.jpg',
  './nijojo.jpg',
  './nishiki.jpg',
  './nonbei.jpg',
  './odaiba-sunset.jpg',
  './okonomiyaki.jpg',
  './omoide-soir.jpg',
  './omoide-yokocho.jpg',
  './omotesando-dej.jpg',
  './omotesando-miyajima.jpg',
  './osaka-jo.jpg',
  './pan-pacific-orchard-hotel.jpg',
  './peace-museum.jpg',
  './premier-repas.jpg',
  './rain-vortex-show.jpg',
  './river-cruise.jpg',
  './satay-by-the-bay.jpg',
  './sensoji.jpg',
  './shibuya-crossing.jpg',
  './shibuya-parco.jpg',
  './shibuya-sky.jpg',
  './shinjuku-apt.jpg',
  './shinjuku-gyoen.jpg',
  './shinsaibashi.jpg',
  './skyspa-candeo.jpg',
  './skytree.jpg',
  './spectra.jpg',
  './sri-temple.jpg',
  './sumida-cruise.jpg',
  './sumida-walk.jpg',
  './sumo-kyoto.jpg',
  './super-potato.jpg',
  './supertree-grove.jpg',
  './takeshita.jpg',
  './tanjong-beach.jpg',
  './teamlab-planets.jpg',
  './tenryuji.jpg',
  './the-maiko.jpg',
  './tim-ho-wan-jewel.jpg',
  './tmg-building.jpg',
  './todaiji.jpg',
  './toji.jpg',
  './yoyogi.jpg',
];

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

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
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url.pathname);

  if (isImage) {
    // Images : cache-first (elles ne changent pas, rapide + hors-ligne)
    e.respondWith(
      caches.match(req).then(cached =>
        cached || fetch(req).then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const clone = resp.clone();
            caches.open(CACHE).then(cache => cache.put(req, clone));
          }
          return resp;
        }).catch(() => cached)
      )
    );
    return;
  }

  // HTML / code / manifest / reste : NETWORK-FIRST
  // => a chaque ouverture en ligne, on recupere la derniere version GitHub.
  // Hors-ligne : on sert la derniere version mise en cache.
  e.respondWith(
    fetch(req).then(resp => {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(req, clone));
      }
      return resp;
    }).catch(() =>
      caches.match(req).then(cached => cached || caches.match('./index.html'))
    )
  );
});
