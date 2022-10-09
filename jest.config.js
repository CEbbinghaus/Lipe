/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	resolver: "jest-ts-webcompat-resolver",
	preset: "ts-jest",
	testEnvironment: "node",

	testMatch: ["**/*.test.ts"],

	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.ts"],

	coverageThreshold: {
		global: {
			branches: 70,
			functions: 60,
			lines: 80,
			statements: 80,
		},
	},

	coverageDirectory: "coverage",
	coverageProvider: "v8"
};
