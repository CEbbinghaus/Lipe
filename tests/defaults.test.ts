import {Logger, LoggerPipe} from "../src/index";
import {Colorizer, Console} from "../src/defaults";

test("Constructing Logger without Options works", () => {

	const logger = new Logger();

	expect(logger).toBeInstanceOf(Logger);

});

test("Constructing Logger with Options works", () => {

	const logger = new Logger({
		awaitPromises: true
	});

	expect(logger).toBeInstanceOf(Logger);

});

test("Can Construct a Logger Pipe", () => {
	const pipe = new LoggerPipe();
	expect(pipe).toBeInstanceOf(LoggerPipe);
});

test("Can Log a Message to Console", () => {
	console.log = jest.fn();

	const logger = new Logger();

	logger.pipe.Pipe(Console);

	logger.Log("Test");

	expect(console.log).toHaveBeenCalledWith("Test");	
});
