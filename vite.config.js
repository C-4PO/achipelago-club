import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import { defineConfig } from 'vite';
import polyfillNode from 'rollup-plugin-polyfill-node';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
    plugins: [
        sveltekit(),
				commonjs(),
        nodeLoaderPlugin(),
        polyfillNode() // Add this line
    ],
}); 