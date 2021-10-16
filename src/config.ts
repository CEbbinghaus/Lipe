export const SITE = {
	title: "Your Documentation Website",
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
	twitter: "astrodotbuild",
};

export const KNOWN_LANGUAGES = {
	English: "",
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/CEbbinghaus/Logger/docs/docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
// export const ALGOLIA = {
//   indexName: 'XXXXXXXXXX',
//   apiKey: 'XXXXXXXXXX',
// }

export const SIDEBAR: {[key: string]: {text: string, link?: string, header?: boolean, }[]} = {
};

SIDEBAR.en = [
	{ text: "Section Header", header: true },
	{ text: "Introduction", link: "introduction" },
	{ text: "Pipes", link: "pipes" },
	{ text: "Transforming", link: "transforming" },

	// { text: "Another Section", header: true },
	// { text: "Page 4", link: "page-4" },
];
