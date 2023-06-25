import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin"
import { defineConfig } from 'vite';
const inject = require('@rollup/plugin-inject')
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
	plugins: [sveltekit(),nodeLoaderPlugin(),nodePolyfills()],
	  // other config options
	build: {
		rollupOptions: {
			plugins: [
				inject({
					Buffer: ['buffer', 'Buffer'],
				}),
			],
		},
	},
});
