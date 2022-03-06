/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	// rootDir: "tests",
	testMatch: ["**/*.test.ts"],

	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.ts"],

	// // coverageProvider: ["v8"],
	// coverageReporters: ["clover", "json", "lcov", "text"],

	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},

	coverageDirectory: "coverage",
	coverageProvider: "v8",
};
