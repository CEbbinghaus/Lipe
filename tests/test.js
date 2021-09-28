// We don't need to worry about code quality in this testing file
/* eslint-disable */

const { Logger, LoggerPipe, LogLevel } = require("../lib/index");
const { Colorizer, Console, Simple, Timestamped, WriteToFile } = require("../lib/defaults");

const noSecret = (message, {args}) => {
	if (args?.isSecret)
		return false;

	return message;
}

const Wait5Second = () => {
	return new Promise((res, rej) => {
		setTimeout(res, Math.random() * 5000);
	})
}

const logger = new Logger({ title: "Test", encoding: "UTF8" });

const basePipe = new LoggerPipe()
	.Pipe(noSecret);

const FilePipe = new LoggerPipe()
	.Through(basePipe)
	.Pipe(Timestamped())
	.Pipe(WriteToFile("test.log"));

logger.ClearPipes()
	.AddPipe(FilePipe.Pipe(WriteToFile("Errors.log", {minLevel: LogLevel.Error})))
	.AddPipe(basePipe.Pipe(Wait5Second).Pipe(Colorizer).Pipe(Timestamped()).Pipe(Console));

logger.Log("Nobody should see this", { isSecret: true });
logger.Log("Everyone should see this");


logger.Warn("Here is a Warning");
logger.Error("Here is an Error");
logger.Critical("Here is a Critical Application Problem");
