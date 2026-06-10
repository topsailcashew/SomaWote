/**
 * Service Worker — Workbox-based caching strategy.
 *
 * Network-first:  POST /api/assessments  (queued via Background Sync when offline)
 * Cache-first:    Static assets, curriculum content, Piper model (~60MB)
 */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

// Network-first for curriculum API (fresh data when possible)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/curriculum'),
  new NetworkFirst({
    cacheName: 'curriculum-api',
    plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
);

// Background sync for assessment submissions
const assessmentSync = new BackgroundSyncPlugin('flush-assessments', { maxRetentionTime: 48 * 60 });
registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/assessments') && request.method === 'POST',
  new NetworkFirst({ plugins: [assessmentSync] }),
  'POST'
);

// Cache-first for static assets
registerRoute(
  ({ request }) => ['style', 'script', 'image', 'font'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
);

// Cache-first for Piper WASM runtime files served from /piper/
// These are large (~40MB total) and never change for a given version.
registerRoute(
  ({ url }) => url.pathname.startsWith('/piper/'),
  new CacheFirst({
    cacheName: 'piper-wasm-runtime',
    plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 90 * 24 * 60 * 60 })],
  })
);
