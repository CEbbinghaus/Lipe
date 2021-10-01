// We don't need to worry about code quality in this testing file
/* eslint-disable */

const { default: Logger, LoggerPipe, LogLevel, Defaults: { WithColor, Console, Simple, Timestamped, WriteToFile, Splat } } = require("../lib/index");

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
	.Pipe(basePipe)
	.Pipe(Timestamped())
	.Pipe(Splat("{timestamp} {Message}"))
	.Pipe(WriteToFile("test.log"));

logger.ClearPipes()
	.AddPipe(FilePipe.Pipe(WriteToFile("Errors.log", {minLevel: LogLevel.Error})))
	.AddPipe(basePipe.Pipe(Wait5Second).Pipe(WithColor).Pipe(Timestamped()).Pipe(Splat("[{timestamp}] {prefix} {Message}")).Pipe(Console));

logger.Log("Nobody should see this", { isSecret: true });
logger.Log("Everyone should see this");


logger.Log("Value of message is: {Message}", {Message: "Hello World!"});


logger.Warn("Here is a Warning");
logger.Error("Here is an Error");
logger.Critical("Here is a Critical Application Problem");

let childLogger = logger.Child();

childLogger.Info("A log from a Child Logger");
