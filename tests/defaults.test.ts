import Logger, { IFormatter, LoggerPipe, LogLevel } from "../src/index";
import { Console, Splat } from "../src/defaults";

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
});


describe("Default Transforms", () => {
	test("Can Splat Message with Pipe", () => {
		logger = new Logger();

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
});

