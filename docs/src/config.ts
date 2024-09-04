export const SITE = {
	title: "Lipe",
	description: "A modern JS Logging framework built around pipes",
	defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
	image: {
		src: "",
		alt: ""
	},
	twitter: "",
};

export const KNOWN_LANGUAGES = {
	English: "en",
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/CEbbinghaus/Logger/blob/master/docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
export const COMMUNITY_INVITE_URL = ``;

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
