import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin"
import { defineConfig } from 'vite';
import nodePolyfills from "rollup-plugin-node-polyfills";
import inject from '@rollup/plugin-inject';

export default defineConfig({
	plugins: [sveltekit(),nodeLoaderPlugin(),nodePolyfills(),inject({ Buffer: ['Buffer', 'Buffer'] })],
	  // other config options
	build: {
		rollupOptions: {
			external: ['Buffer'],
		},
	},
});
