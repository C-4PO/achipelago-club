import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';
import { createRequire } from 'module'; // Bring in the ability to create the 'require' function

const require = createRequire(import.meta.url); // construct the require function

export default defineConfig({
    plugins: [
        sveltekit(),
        nodeLoaderPlugin(),
        inject({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        alias: {
            buffer: require.resolve('buffer/'),
        },
    },
    // other config options
});