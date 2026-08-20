// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://kcrz.dev',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			// Accent only: project names and highlighted words.
			provider: fontProviders.google(),
			name: 'Tektur',
			cssVariable: '--font-tektur',
			weights: ['400 800'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext', 'cyrillic'],
			fallbacks: ['Arial Narrow', 'Helvetica Neue', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Ubuntu Sans',
			cssVariable: '--font-ubuntu-sans',
			weights: ['400 800'],
			styles: ['normal', 'italic'],
			subsets: ['latin', 'latin-ext', 'cyrillic'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
	],
});
