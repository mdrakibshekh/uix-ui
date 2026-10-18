import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served at uixdesign.pagestro.com/ui (copy dist/ into the site's public/ui when it launches).
// fs.allow: routes.tsx reads ../registry/registry.json, which sits outside this folder.
// build.manifest: prerender.mjs reads it to add <link rel="modulepreload"> for each page's chunk, then deletes it.
export default defineConfig({ base: '/ui/', plugins: [react(), tailwindcss()], server: { fs: { allow: ['..'] } }, build: { manifest: true } });
