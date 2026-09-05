import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { parsePostSlug } from '../utils/seo';

export async function GET(context) {
	const posts = await getCollection('blog');
	const ruPosts = posts
		.filter((post) => parsePostSlug(post.id).lang === 'ru')
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: 'Kcrz.dev — Блог (RU)',
		description: 'Инженерные заметки, распределенные системы и разработка инструментов.',
		site: context.site,
		customData: '<language>ru-ru</language>',
		items: ruPosts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
