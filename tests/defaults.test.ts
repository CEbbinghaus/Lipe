import {Logger} from "../src/index"
import {Colorizer, Console} from "../src/defaults"

test("Constructing Logger with Parameters works", () => {

	const logger = new Logger(Colorizer, Console);

	expect(logger).toBeInstanceOf(Logger);

})

test("Can Log a Message to Console", () => {
	console.log = jest.fn();

	const logger = new Logger(Colorizer, Console);

	logger.Log("Test");

	expect(console.log).toHaveBeenCalledWith("Test");	
})
