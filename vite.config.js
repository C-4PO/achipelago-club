import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin"
import { defineConfig } from 'vite';
import inject from "@rollup/plugin-inject";

export default defineConfig({
	plugins: [sveltekit(),nodeLoaderPlugin()],
  build: {
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
  },
});
