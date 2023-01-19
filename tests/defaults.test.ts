let mockFiles = {};

jest.mock("fs", () =>
	Object.assign(
		{},
		{
			existsSync: (path) => false,
			appendFileSync: (path, content) => (mockFiles[path] += content),
			writeFileSync: (path, content) => (mockFiles[path] = content),
		}
	)
);

import MockDate from "mockdate";
import Logger, { IFormatter, LoggerPipe, LogLevel } from "../src/index";
import { Colorize, Console, PrefixWithColor, SimplePrefix, Splat, Timestamped, WriteToFile } from "../src/defaults";
import * as fs from "fs";
import { join } from "path";
import chalk from "chalk";

// Variable Definitions
let message: string = null;
let output = jest.fn();
let logger = new Logger();
let defaultPipe = new LoggerPipe([output]);

// Reassign all Values with fresh copies to Isolate each test
beforeEach(() => {
	// Generate a new Random message for each test. This is to ensure that if text gets transformed in a certain way it must stay consistent no matter the content
	message = Math.random().toString().slice(2, 10);
	logger = new Logger();
	output = jest.fn();
	defaultPipe = new LoggerPipe([output]);

	MockDate.set("1997-01-01 12:00");
});

afterEach(() => {
	MockDate.reset();
});

describe("Default Transforms", () => {
	test("Can Splat Message with Pipe", () => {
		logger.pipe
			.Pipe((msg, obj) => {
				obj.meta["test"] = true;
			})
			.Pipe(Splat("[{test}]: {Message}"))
			.Pipe(output);

		logger.Log(message);

		expect(output).toBeCalledWith(
			"[true]: " + message,
			expect.objectContaining({ logLevel: LogLevel.Log })
		);
	});
});

describe("Default Outputs", () => {
	test("Console Output works", () => {
		const consoleSpy = jest.spyOn(console, "log");

		logger.pipe.Pipe(Console());

		logger.Log(message);

		expect(consoleSpy).toHaveBeenCalledWith(message);
	});

	test("Console Output works for Errors", () => {
		const consoleSpy = jest.spyOn(console, "error");

		logger.pipe.Pipe(Console());

		logger.Error(message);

		expect(consoleSpy).toHaveBeenCalledWith(message);
	});
	test("Console Output works", () => {
		const consoleSpy = jest.spyOn(console, "log");

		logger.pipe.Pipe(Console());

		logger.Log(message);

		expect(consoleSpy).toHaveBeenCalledWith(message);
	});

	test("File output writes to file", () => {
		let fileName = "./test.log";
		let absoluteFileName = join(process.cwd(), fileName);
		logger.pipe.Pipe(WriteToFile(fileName));

		expect(mockFiles[absoluteFileName]).toEqual("");
		// For some reason this test is failing. Will have to investigate further
		// expect(mockFiles).toHaveProperty(absoluteFileName, "");

		logger.Log(message);

		expect(mockFiles[absoluteFileName]).toEqual(message + "\n");
	});

	test("File output writes to file with minimum Level", () => {
		let fileName = "./test.log";
		let absoluteFileName = join(process.cwd(), fileName);
		logger.pipe.Pipe(WriteToFile(fileName, {minLevel: LogLevel.Warn}));

		expect(mockFiles[absoluteFileName]).toEqual("");
		// For some reason this test is failing. Will have to investigate further
		// expect(mockFiles).toHaveProperty(absoluteFileName, "");

		logger.Log(message); // This one shouldn't go through because we have a minimum level set up
		logger.Warn(message); // This one should go through

		expect(mockFiles[absoluteFileName]).toEqual(message + "\n");
	});
});

describe("Timestamp Transform", () => {
	test("Can add a default Timestamp", () => {
		logger.pipe
			.Pipe(Timestamped())
			.Pipe(output);

		logger.Log(message);

		expect(output).toBeCalledWith(
			message,
			expect.objectContaining({ logLevel: LogLevel.Log, meta: {timestamp: "01/01/1997 12:00:00"} })
		);
	});
	test("Can add a Timestamp with custom format", () => {
		logger.pipe
			.Pipe(Timestamped("HH:mm:ss on DD-MM-YYYY"))
			.Pipe(output);

		logger.Log(message);

		expect(output).toBeCalledWith(
			message,
			expect.objectContaining({
				logLevel: LogLevel.Log,
				meta: { timestamp: "12:00:00 on 01-01-1997" },
			})
		);
	});
});


describe("Prefix transforms", () => {
		test("Can add a simple Prefix", () => {
			logger.pipe
				.Pipe(SimplePrefix)
				.Pipe(output);

			logger.Log(message);

			expect(output).toBeCalledWith(
				message,
				expect.objectContaining({
					logLevel: LogLevel.Log,
					meta: { prefix: "Log:" },
				})
			);
		});

		test("Can add a Color Prefix", () => {
			logger.pipe
				.Pipe(PrefixWithColor)
				.Pipe(output);

			logger.Log(message);

			expect(output).toBeCalledWith(
				message,
				expect.objectContaining({
					logLevel: LogLevel.Log,
					meta: { prefix: chalk.blueBright.bold("Log") + ":" },
				})
			);
		});
})

describe("Color Transforms", () => {
	test("Can Colorize the message", () => {
		const color = "#ffaabb";

		logger.pipe
			.Pipe(Colorize(color))
			.Pipe(output);

		logger.Log(message);

		expect(output).toBeCalledWith(
			chalk.hex(color)(message),
			expect.objectContaining({
				logLevel: LogLevel.Log
			})
		);
	});
});
