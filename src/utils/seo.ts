export interface AlternateLink {
	hreflang: string;
	href: string;
}

export const SUPPORTED_LANGUAGES = ['en', 'ru', 'es', 'de', 'fr', 'zh'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const OG_LOCALES: Record<string, string> = {
	en: 'en_US',
	ru: 'ru_RU',
	es: 'es_ES',
	de: 'de_DE',
	fr: 'fr_FR',
	zh: 'zh_CN',
};

/**
 * Returns the Open Graph locale string (e.g. en_US, ru_RU) for a given language code.
 */
export function getLanguageLocale(lang: string): string {
	return OG_LOCALES[lang] || 'en_US';
}

/**
 * Extracts the base slug and language code from a post ID or slug.
 * E.g. "simple-flow-macos-dictation-ru" -> { baseSlug: "simple-flow-macos-dictation", lang: "ru" }
 * E.g. "simple-flow-macos-dictation" -> { baseSlug: "simple-flow-macos-dictation", lang: "en" }
 */
export function parsePostSlug(id: string): { baseSlug: string; lang: string } {
	const match = id.match(/^(.*?)(?:-(ru|es|de|fr|zh))?$/);
	if (!match) {
		return { baseSlug: id, lang: 'en' };
	}
	const baseSlug = match[1] || id;
	const lang = match[2] || 'en';
	return { baseSlug, lang };
}

/**
 * Generates an array of hreflang alternate links for a blog post based on all available posts.
 * Includes alternates for each available translation and an "x-default" pointing to the English version.
 */
export function getHreflangAlternates(
	currentPostId: string,
	allPostIds: string[],
	siteUrl: string | URL = 'https://kcrz.dev',
): AlternateLink[] {
	const { baseSlug } = parsePostSlug(currentPostId);
	const origin = typeof siteUrl === 'string' ? siteUrl.replace(/\/$/, '') : siteUrl.origin;

	// Find all posts that share this base slug
	const matchingPosts = allPostIds
		.map((id) => ({ id, ...parsePostSlug(id) }))
		.filter((p) => p.baseSlug === baseSlug);

	if (matchingPosts.length <= 1) {
		return [];
	}

	const alternates: AlternateLink[] = matchingPosts.map((p) => ({
		hreflang: p.lang,
		href: `${origin}/blog/${p.id}/`,
	}));

	// Find default (English or first available) for x-default
	const defaultPost = matchingPosts.find((p) => p.lang === 'en') || matchingPosts[0];
	alternates.push({
		hreflang: 'x-default',
		href: `${origin}/blog/${defaultPost.id}/`,
	});

	return alternates;
}
