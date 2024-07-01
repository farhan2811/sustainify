
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';
// import { initializeApp } from 'firebase/app';
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: "AIzaSyAC_6CZcn61_i0DZ4fFKWMkOPRqItvNswQ",
//   authDomain: "sustainify-67c1e.firebaseapp.com",
//   databaseURL: "https://sustainify-67c1e-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "sustainify-67c1e",
//   storageBucket: "sustainify-67c1e.appspot.com",
//   messagingSenderId: "673118394696",
//   appId: "1:673118394696:web:4ce9922d360167fe8a7b7d",
//   measurementId: "G-FFMBQER2WZ"
// };

// initializeApp(firebaseConfig);
// const messaging = getMessaging();


const worker = (self as unknown) as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;

// `build` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(FILES)
			.then((cache) => cache.addAll(to_cache))
			.then(() => {
				worker.skipWaiting();
			})
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// delete old caches
			for (const key of keys) {
				if (key !== FILES) await caches.delete(key);
			}

			worker.clients.claim();
		})
	);
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
	const cache = await caches.open(`offline${version}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;

		throw err;
	}
}

worker.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

	const url = new URL(event.request.url);

	// don't try to handle e.g. data: URIs
	const isHttp = url.protocol.startsWith('http');
	const isDevServerRequest =
		url.hostname === self.location.hostname && url.port !== self.location.port;
	const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
	const skipBecauseUncached = event.request.cache === 'only-if-cached' && !isStaticAsset;

	if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
		event.respondWith(
			(async () => {
				// always serve static files and bundler-generated assets from cache.
				// if your application has other URLs with data that will never change,
				// set this variable to true for them and they will only be fetched once.
				const cachedAsset = isStaticAsset && (await caches.match(event.request));

				return cachedAsset || fetchAndCache(event.request);
			})()
		);
	}
});

// // Firebase Messaging background message handler
// onBackgroundMessage(messaging, (payload) => {
//   console.log('Received background message:', payload);

//   const { title, body, icon } = payload.data;
//   self.registration.showNotification(title, {
//     body: body,
//     icon: icon,
//   });
// });

// self.addEventListener('notificationclick', (event) => {
//   const notification = event.notification;
//   const action = event.action;

//   if (action === 'close') {
//     notification.close();
//   } else {
//     event.waitUntil(
//       clients.openWindow('https://sustainify.vercel.app')
//     );
//     notification.close();
//   }
// });