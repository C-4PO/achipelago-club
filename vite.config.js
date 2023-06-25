import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin"
import { defineConfig } from 'vite';
import inject from "@rollup/plugin-inject";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
	plugins: [sveltekit(),nodeLoaderPlugin(),nodePolyfills()],
});
