export const SITE = {
	title: "The Logger that Pipes",
	description: "Your website description.",
	defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
	image: {
		src: "https://github.com/snowpackjs/astro/blob/main/assets/social/banner.jpg?raw=true",
		alt:
			"astro logo on a starry expanse of space," +
			" with a purple saturn-like planet floating in the right foreground",
	},
	// twitter: "astrodotbuild",
};

export const KNOWN_LANGUAGES = {
	English: "en",
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/CEbbinghaus/Logger/blob/docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
// export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
// export const ALGOLIA = {
//   indexName: 'XXXXXXXXXX',
//   apiKey: 'XXXXXXXXXX',
// }

export const SIDEBAR: {[key: string]: {text: string, link?: string, header?: boolean, }[]} = {};

SIDEBAR.en = [
	{ text: "Getting Started", header: true },
	{ text: "Quick Start", link: "quickstart" },
	{ text: "Introduction", link: "introduction" },

	{ text: "Documentation", header: true },

	{ text: "Pipes", link: "pipes" },
	{ text: "Splat", link: "splat" },
	{ text: "Transforming", link: "transforming" },
];
