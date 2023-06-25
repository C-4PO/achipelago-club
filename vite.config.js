import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin"
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(),nodeLoaderPlugin()],
	resolve: {
    alias: {
      buffer: "__vite-browser-external/buffer",
      process: "__vite-browser-external/process",
    },
  },
});
