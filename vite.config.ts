import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
    plugins: [
        react(),
        eslint(),
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: '__tla',
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: (i) => `__tla_${i}`
        })
    ],
    server: {
        host: '0.0.0.0'
    },
    resolve: {
        alias: {
            crypto: 'empty-module'
        }
    },
    define: {
        global: 'globalThis'
    }
});
