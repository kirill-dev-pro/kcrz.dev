import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

function loadFont(filename: string): Buffer {
	const cwdPath = path.resolve(process.cwd(), 'src/assets/og-fonts', filename);
	if (fs.existsSync(cwdPath)) {
		return fs.readFileSync(cwdPath);
	}
	const fallbackPath = new URL(`../assets/og-fonts/${filename}`, import.meta.url);
	return fs.readFileSync(fallbackPath);
}

// Load fonts once from bundled assets
const tekturBold = loadFont('Tektur-Bold.ttf');
const ubuntuBold = loadFont('Ubuntu-Bold.ttf');
const ubuntuRegular = loadFont('Ubuntu-Regular.ttf');

const fonts = [
	{
		name: 'Tektur',
		data: tekturBold,
		weight: 700 as const,
		style: 'normal' as const,
	},
	{
		name: 'Ubuntu',
		data: ubuntuBold,
		weight: 700 as const,
		style: 'normal' as const,
	},
	{
		name: 'Ubuntu',
		data: ubuntuRegular,
		weight: 400 as const,
		style: 'normal' as const,
	},
];

export interface ArticleOgOptions {
	title: string;
	description?: string;
	date?: Date | string;
	category?: string;
	badge?: string;
}

function formatDate(d?: Date | string): string {
	if (!d) return '';
	const dateObj = typeof d === 'string' ? new Date(d) : d;
	if (isNaN(dateObj.getTime())) return '';
	return dateObj.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

/**
 * Generates a PNG Buffer (1200x630) for a blog article.
 */
export async function generateArticleOgImage(options: ArticleOgOptions): Promise<Buffer> {
	const {
		title,
		description = '',
		date,
		category = 'ENGINEERING LOG',
	} = options;

	const formattedDate = formatDate(date);

	// Truncate long descriptions if needed for clean layout
	const safeDescription =
		description.length > 150 ? description.slice(0, 147).trim() + '...' : description;

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					height: '100%',
					backgroundColor: '#07080b',
					backgroundImage:
						'radial-gradient(circle at 82% 12%, rgba(155, 123, 255, 0.18), transparent 420px), radial-gradient(circle at 15% 85%, rgba(85, 230, 255, 0.09), transparent 380px)',
					color: '#f2f5f3',
					padding: '64px 76px',
					justifyContent: 'space-between',
					fontFamily: 'Ubuntu',
					position: 'relative',
					overflow: 'hidden',
				},
				children: [
					// Outer ambient geometric border
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								inset: '20px',
								border: '1px solid rgba(242, 245, 243, 0.08)',
								borderRadius: '16px',
								pointerEvents: 'none',
							},
						},
					},
					// Top bar: Branding & Category Badge
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '14px',
										},
										children: [
											{
												type: 'div',
												props: {
													style: {
														width: '14px',
														height: '14px',
														backgroundColor: '#9b7bff',
														transform: 'rotate(45deg)',
														boxShadow: '0 0 16px rgba(155, 123, 255, 0.8)',
													},
												},
											},
											{
												type: 'div',
												props: {
													style: {
														fontFamily: 'Tektur',
														fontSize: '28px',
														fontWeight: 700,
														color: '#f2f5f3',
														letterSpacing: '0.08em',
														textTransform: 'uppercase',
													},
													children: 'KCRZ.DEV',
												},
											},
										],
									},
								},
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											padding: '8px 18px',
											backgroundColor: 'rgba(242, 245, 243, 0.06)',
											border: '1px solid rgba(242, 245, 243, 0.12)',
											borderRadius: '9999px',
											color: '#9b7bff',
											fontFamily: 'Tektur',
											fontSize: '15px',
											fontWeight: 700,
											letterSpacing: '0.12em',
											textTransform: 'uppercase',
										},
										children: category,
									},
								},
							],
						},
					},
					// Middle: Title & Description
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '18px',
								
								maxWidth: '1000px',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: title.length > 60 ? '48px' : '56px',
											fontWeight: 700,
											lineHeight: 1.14,
											letterSpacing: '-0.025em',
											color: '#ffffff',
										},
										children: title,
									},
								},
								safeDescription
									? {
											type: 'div',
											props: {
												style: {
													fontSize: '23px',
													fontWeight: 400,
													color: '#8b949e',
													lineHeight: 1.42,
												},
												children: safeDescription,
											},
										}
									: null,
							].filter(Boolean),
						},
					},
					// Bottom: Author & Date
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								borderTop: '1px solid rgba(242, 245, 243, 0.1)',
								paddingTop: '26px',
								
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '16px',
										},
										children: [
											{
												type: 'div',
												props: {
													style: {
														fontFamily: 'Tektur',
														fontSize: '22px',
														fontWeight: 700,
														color: '#f2f5f3',
													},
													children: 'kcrz',
												},
											},
											{
												type: 'div',
												props: {
													style: {
														fontSize: '18px',
														color: '#7e838f',
													},
													children: '— backend systems & tools',
												},
											},
										],
									},
								},
								formattedDate
									? {
											type: 'div',
											props: {
												style: {
													display: 'flex',
													alignItems: 'center',
													padding: '8px 18px',
													backgroundColor: 'rgba(155, 123, 255, 0.16)',
													border: '1px solid rgba(155, 123, 255, 0.35)',
													borderRadius: '9999px',
													color: '#d4c7ff',
													fontSize: '16px',
													fontWeight: 700,
												},
												children: formattedDate,
											},
										}
									: null,
							].filter(Boolean),
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts,
		},
	);

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: 1200 },
	});
	return resvg.render().asPng();
}

/**
 * Generates a PNG Buffer (1200x630) for the main site root (https://kcrz.dev).
 */
export async function generateSiteOgImage(): Promise<Buffer> {
	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					height: '100%',
					backgroundColor: '#07080b',
					backgroundImage:
						'radial-gradient(circle at 82% 14%, rgba(155, 123, 255, 0.22), transparent 480px), radial-gradient(circle at 18% 82%, rgba(85, 230, 255, 0.12), transparent 420px)',
					color: '#f2f5f3',
					padding: '64px 76px',
					justifyContent: 'space-between',
					fontFamily: 'Ubuntu',
					position: 'relative',
					overflow: 'hidden',
				},
				children: [
					// Outer ambient geometric border
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								inset: '20px',
								border: '1px solid rgba(242, 245, 243, 0.08)',
								borderRadius: '16px',
								pointerEvents: 'none',
							},
						},
					},
					// Top bar
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '14px',
										},
										children: [
											{
												type: 'div',
												props: {
													style: {
														width: '16px',
														height: '16px',
														backgroundColor: '#9b7bff',
														transform: 'rotate(45deg)',
														boxShadow: '0 0 20px rgba(155, 123, 255, 0.85)',
													},
												},
											},
											{
												type: 'div',
												props: {
													style: {
														fontFamily: 'Tektur',
														fontSize: '32px',
														fontWeight: 700,
														color: '#f2f5f3',
														letterSpacing: '0.08em',
														textTransform: 'uppercase',
													},
													children: 'KCRZ.DEV',
												},
											},
										],
									},
								},
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											padding: '8px 20px',
											backgroundColor: 'rgba(155, 123, 255, 0.16)',
											border: '1px solid rgba(155, 123, 255, 0.4)',
											borderRadius: '9999px',
											color: '#9b7bff',
											fontFamily: 'Tektur',
											fontSize: '16px',
											fontWeight: 700,
											letterSpacing: '0.12em',
											textTransform: 'uppercase',
										},
										children: 'BUILDER & ARCHITECT',
									},
								},
							],
						},
					},
					// Middle hero
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '20px',
								
								maxWidth: '1020px',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontFamily: 'Tektur',
											fontSize: '56px',
											fontWeight: 700,
											lineHeight: 1.08,
											letterSpacing: '-0.03em',
											color: '#ffffff',
										},
										children: 'kcrz.dev',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '30px',
											fontWeight: 400,
											lineHeight: 1.35,
											color: '#d4c7ff',
										},
										children:
											'Building developer infrastructure and focused products that reduce complexity.',
									},
								},
								// Tags row
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
											marginTop: '10px',
										},
										children: [
											'Bunderstack',
											'Bunderhost',
											'Distributed Backends',
											'AI Workflows',
										].map((tag) => ({
											type: 'div',
											props: {
												style: {
													padding: '6px 16px',
													backgroundColor: 'rgba(242, 245, 243, 0.05)',
													border: '1px solid rgba(242, 245, 243, 0.12)',
													borderRadius: '8px',
													color: '#8b949e',
													fontFamily: 'Tektur',
													fontSize: '15px',
													fontWeight: 700,
													letterSpacing: '0.04em',
												},
												children: tag,
											},
										})),
									},
								},
							],
						},
					},
					// Bottom bar
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								borderTop: '1px solid rgba(242, 245, 243, 0.1)',
								paddingTop: '24px',
								
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: '19px',
											color: '#7e838f',
										},
										children: 'kcrz.dev • github.com/kirill-dev-pro',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '19px',
											color: '#9b7bff',
											fontFamily: 'Tektur',
											fontWeight: 700,
										},
										children: '@kcrz_dev',
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts,
		},
	);

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: 1200 },
	});
	return resvg.render().asPng();
}
