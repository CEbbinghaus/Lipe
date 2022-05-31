/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	resolver: "jest-ts-webcompat-resolver",
	preset: "ts-jest",
	testEnvironment: "node",
	// rootDir: "tests",
	// extensionsToTreatAsEsm: [".ts"],
	// globals: {
	// 	"ts-jest": {
	// 		useESM: true,
	// 	},
	// },
	// moduleNameMapper: {
	// 	"^(\\.{1,2}/.*)\\.js$": "$1",
	// },

	testMatch: ["**/*.test.ts"],

	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.ts"],

	// // coverageProvider: ["v8"],
	// coverageReporters: ["clover", "json", "lcov", "text"],

	coverageThreshold: {
		global: {
			branches: 70,
			functions: 50,
			lines: 80,
			statements: 80,
		},
	},

	coverageDirectory: "coverage",
	coverageProvider: "babel",
};
