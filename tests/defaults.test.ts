import {Logger} from "../src/index";
import {Console} from "../src/defaults";

test("Constructing Logger without Options", () => {

	const logger = new Logger();
	expect(logger).toBeInstanceOf(Logger);

});
test("Constructing Logger with Options", () => {

	const logger = new Logger({
		awaitPromises: true
	});
	expect(logger).toBeInstanceOf(Logger);

});

test("Constructing Logger with Options works", () => {

	const logger = new Logger({
		awaitPromises: true
	});

	expect(logger).toBeInstanceOf(Logger);

});

test("Can Log a Message to Console", () => {

	const output = jest.fn();

	const logger = new Logger();

	logger.pipe.Pipe(output);

	logger.Log("Test");

	expect(output).toHaveBeenCalledWith("Test");	
});
