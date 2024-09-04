import { KNOWN_LANGUAGES as CONFIG_KNOWN_LANGUAGES } from './config.js';

export const KNOWN_LANGUAGES = CONFIG_KNOWN_LANGUAGES;

export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const langPathRegex = /\/([a-z]{2}-?[A-Z]{0,2})\//;

export function getLanguageFromURL(pathname: string): string {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[A-Z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}
