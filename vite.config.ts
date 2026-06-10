import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        srcDir: 'src/service-worker',
        filename: 'sw.ts',
        strategies: 'injectManifest',
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        manifest: false, // served from public/manifest.json
        devOptions: { enabled: true, type: 'module' },
        injectManifest: {
          // Piper WASM files are large; raise limit so build succeeds
          // (runtime caching for /piper/* is handled in sw.ts)
          maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Required for SharedArrayBuffer used by onnxruntime-web WASM threads.
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'credentialless',
      },
    },
  };
});
