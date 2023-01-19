import Logger, { IFormatter, LoggerPipe, LogLevel } from "../src/index";

// Helper Functions

const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

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

// Tests

describe("Constructing Logger", () => {
	test("Constructing Logger without Options", () => {
		const logger = new Logger();
		expect(logger).toBeInstanceOf(Logger);
	});
	test("Constructing Logger with Options", () => {
		const logger = new Logger({
			awaitPromises: true,
		});
		expect(logger).toBeInstanceOf(Logger);
	});
});

describe("Transform Messages", () => {
	test("Constructing Empty pipe throws error", () => {

		let run = () => logger.pipe.Pipe();
		expect(run).toThrow(Error);
	});

	// This Error is difficult to test since it gets caught and logged. Might require propagating the error back up
	// test("Returning a non string from a pipe throws a TypeError", () => {
	// 	// We have to trick the compiler to produce the error
	// 	logger.pipe.Pipe((msg) => 23 as any as string);
	// 	let run = () => logger.Log("Foo");
	// 	expect(run).toThrow(TypeError);
	// });

	test("Can Transform the Message body", () => {
		// Add Hello Transform to Pipe
		logger.pipe.Pipe((msg) => "Hello " + msg + "!").Pipe(output);

		logger.Log("World");

		expect(output).toBeCalledWith(
			"Hello World!",
			expect.objectContaining({ logLevel: LogLevel.Log })
		);
	});

	test("Can Transform the Message body Based on Argument", () => {
		// Add Hello Transform to Pipe
		logger.pipe
			.Pipe((msg, { args }) => `${msg}: ${args?.type}`)
			.Pipe(output);

		logger.Error(message, { type: "Exception" });

		expect(output).toBeCalledWith(
			`${message}: Exception`,
			expect.objectContaining({ logLevel: LogLevel.Error })
		);
	});

	test("Can Transform message Asynchronously", (done) => {
		logger = new Logger({ awaitPromises: true });

		logger.pipe
			.Pipe(async (msg) => {
				await sleep(200);
				return msg + "200";
			})
			.Pipe(output)
			.Pipe(() => {
				// We wait until after the output has been called to Run the Expect. Solves for the Message being Async
				expect(output).toBeCalledWith(
					`${message}200`,
					expect.objectContaining({ logLevel: LogLevel.Critical })
				);
			})
			.Pipe(() => done());

		logger.Critical(message);
	});

	test("Message gets automatically Splat", () => {

		logger.AddPipe(defaultPipe);

		logger.Log("{message}", { message });

		expect(output).toBeCalledWith(message, expect.objectContaining({logLevel: LogLevel.Log}));
	});

	test("Can add Meta values to a Log message", () => {
		logger = new Logger();

		logger.pipe
			.Pipe((msg, {meta}) => {
				meta["test"] = true;
			})
			.Pipe((msg, obj) => {
				expect(obj.meta).toStrictEqual(
					expect.objectContaining({ test: true })
				);
			});

		logger.Critical(message);
	});

	test("Can Route message to separate pipe", () => {
		logger.pipe
			.Pipe(() => {
				return defaultPipe;
			});

		logger.Log(message);

		expect(output).toBeCalledWith(message, expect.objectContaining({logLevel: LogLevel.Log}));
	});

	test("Seperate Pipe can Transform message", () => {
		logger.pipe
			.Pipe(() => new LoggerPipe([(msg) => "Piped:" + msg]))
			.Pipe(output);

		logger.Log(message);

		expect(output).toBeCalledWith(
			"Piped:" + message,
			expect.objectContaining({ logLevel: LogLevel.Log })
		);
	});


});

describe("Output Messages", () => {
	test("Can Log a Message to Anonymous Function", () => {
		logger.AddPipe(defaultPipe);

		logger.Log(message);

		expect(output).toHaveBeenCalledWith(
			message,
			expect.objectContaining({ logLevel: LogLevel.Log })
		);
	});

	test("Message gets Passed into Pipe function", () => {
		logger.pipe.Pipe((msg) => {
			expect(msg).toBe(message);
		});

		logger.Log(message);
	});
});

describe("Filter Messages", () => {
	test("Can Filter a Message by its Log Level", () => {
		const Filter = (msg, { logLevel }) => {
			if (logLevel == LogLevel.Warn) return false;
		};

		logger.pipe.Pipe(Filter).Pipe(output);

		logger.Warn(message);

		expect(output).toHaveBeenCalledTimes(0);
	});

	test("Can Filter a Message by its Argument", () => {
		const Filter: IFormatter = (msg, { args }) => {
			if (args?.noPrint) return false;
		};

		logger.pipe.Pipe(Filter).Pipe(output);

		logger.Log(message, { noPrint: true });

		expect(output).toHaveBeenCalledTimes(0);
	});
});

describe("Create Child Logger and use it", () => {
	let child = logger.Child();
	let key = Math.random().toString().slice(2, 8);

	beforeEach(() => {
		key = Math.random().toString().slice(2, 8);
		child = logger.Child({ key: key });
	});

	test("Can Create a Child Logger", () => {
		const child = logger.Child({ key: "test" });

		expect(child).toHaveProperty("params");
	});

	test("Can Create a Child Logger from a ChildLogger", () => {
		const child = logger.Child({ key: "test" }).Child({key: "test2"});

		expect(child).toHaveProperty("params");
	});

	test("Can Log a message to Child Logger", () => {
		logger.AddPipe(defaultPipe);


		child.Log(message);

		expect(output).toBeCalledWith(
			message,
			expect.objectContaining({
				logLevel: LogLevel.Log,
				args: expect.objectContaining({ key }),
			})
		);
	});

	test("Can Log a message to GrandChild Logger", () => {
		logger.AddPipe(defaultPipe);

		const grandChild = child.Child();

		grandChild.Log(message);

		expect(output).toBeCalledWith(
			message,
			expect.objectContaining({
				logLevel: LogLevel.Log,
				args: expect.objectContaining({ key }),
			})
		);
	});

	test("Can Pass a Argument through Child Logger", () => {
		logger.AddPipe(defaultPipe);

		child.Log(message, { test: true });

		expect(output).toBeCalledWith(
			message,
			expect.objectContaining({
				logLevel: LogLevel.Log,
				args: expect.objectContaining({ test: true, key }),
			})
		);
	});

	test("Can Pass a Argument through GrandChild Logger", () => {
		logger.AddPipe(defaultPipe);

		const newKey = key + "foo";

		const grandChild = child.Child({ key: newKey });

		grandChild.Log(message, { test: key });

		expect(output).toBeCalledWith(
			message,
			expect.objectContaining({
				logLevel: LogLevel.Log,
				args: expect.objectContaining({ test: key, key: newKey }),
			})
		);
	});
});


describe("Pipes and their usage", () => {
	test("Pipe remains Immutable", () => {
		const pipe = new LoggerPipe();

		pipe.Pipe(output);

		logger.AddPipe(pipe);

		logger.Log("Foo");

		expect(output).toHaveBeenCalledTimes(0);
	})

	test("Pipes can have elements added to them", () => {
		let pipe = new LoggerPipe();

		pipe = pipe.Pipe(output);

		logger.AddPipe(pipe);

		logger.Log(message);

		expect(output).toHaveBeenCalledWith(message, expect.objectContaining({logLevel: LogLevel.Log}));
	});
})
