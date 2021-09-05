// We don't need to worry about code quality in this testing file
/* eslint-disable */

const { Logger, LoggerPipe } = require("../lib/index");
const { Colorizer, Console, Simple, Timestamped, WriteToFile } = require("../lib/defaults");

const noSecret = (level, message, args) => {
	if (args?.isSecret)
		return false;

	return message;
}

const logger = new Logger({ title: "Test", encoding: "UTF8" });

const newPipe = new LoggerPipe()
.Pipe(noSecret)
.Pipe(Timestamped)
.Write(WriteToFile("test.log"))
.Pipe(Colorizer)
.Write(Console);

logger.pipe = newPipe;

logger.Log("Nobody should see this", { isSecret: true });
logger.Log("Everyone should see this");


logger.Warn("Here is a Warning");
logger.Error("Here is a Error");
logger.Critical("Here is a Critical Application Problem");
