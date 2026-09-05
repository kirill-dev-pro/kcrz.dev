import type { APIRoute } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';
import { generateArticleOgImage } from '../../utils/og-image';

export const prerender = true;

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}

type Props = CollectionEntry<'blog'>;

export const GET: APIRoute = async ({ props }) => {
	const post = props as Props;
	const png = await generateArticleOgImage({
		title: post.data.title,
		description: post.data.description,
		date: post.data.pubDate,
		category: 'ENGINEERING LOG',
	});

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
