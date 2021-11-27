/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	rootDir: "tests",
	testMatch: ["**/*.test.ts"],

	coverageDirectory: "coverage",
	coverageProvider: "v8",
	collectCoverageFrom: ["src/**.ts"],
};