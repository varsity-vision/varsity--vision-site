// একটি ক্যাশ নাম দিন
const CACHE_NAME = 'varsity-vision-v5;

// ক্যাশ করার জন্য ফাইলগুলোর তালিকা
const assetsToCache = [
  '/',
  '/index.html',
  // আপনার অন্যান্য প্রয়োজনীয় ফাইল এখানে যুক্ত করুন
  // যেমন: '/style.css', '/script.js', '/image_2.png'
];

// ইনস্টল ইভেন্ট - ফাইলগুলো ক্যাশ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(assetsToCache);
    })
  );
});

// ফচ ইভেন্ট - অফলাইনে ক্যাশ থেকে ফাইল দেখানো
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// অ্যাক্টিভেট ইভেন্ট - পুরনো ক্যাশ মুছে ফেলা
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
