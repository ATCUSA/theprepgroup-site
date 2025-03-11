import { mdsvex } from 'mdsvex';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapterNode({
			// Use default options for Node adapter
			out: 'build'
		})
	},

	extensions: ['.svelte', '.svx']
};

export default config;
