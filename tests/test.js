import Logger, { LoggerPipe } from "logger";
import {
	PrefixWithColor,
	Console,
	Timestamped,
	WriteToFile,
	Splat,
} from "logger/defaults";

const noSecret = (message, {args}) => {
	if (args?.isSecret)
		return false;

	return message;
}

const logger = new Logger({ title: "Test", encoding: "UTF8" });

const basePipe = new LoggerPipe()
	.Pipe(noSecret);

const FilePipe = new LoggerPipe()
	.Pipe(basePipe)
	.Pipe(Timestamped())
	.Pipe(Splat("{timestamp} {Message}"))
	.Pipe(WriteToFile("test.log"));

logger
	.ClearPipes()
	.AddPipe(
		FilePipe.Pipe(WriteToFile("Errors.log", { minLevel: LogLevel.Error }))
	)
	.AddPipe(
		basePipe
			.Pipe(PrefixWithColor)
			.Pipe(Timestamped())
			.Pipe(Splat("[{timestamp}] {prefix} {Message}"))
			.Pipe(Console())
	);

logger.Log("Nobody should see this", { isSecret: true });
logger.Log("Everyone should see this");


logger.Log("Value of message is: {Message}", {Message: "Hello World!"});


logger.Warn("Here is a Warning");
logger.Error("Here is an Error");
logger.Critical("Here is a Critical Application Problem");

let childLogger = logger.Child();

childLogger.Info("A log from a Child Logger");
