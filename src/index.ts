const MessageSymbol: unique symbol = Symbol("Message");
const LogLevelSymbol: unique symbol = Symbol("LogLevel");

export const Symbols = {
	Message: MessageSymbol,
	LogLevel: LogLevelSymbol,
};

export enum LogLevel {
	None = 0,
	Debug = 1,
	Info = 1 << 1,
	Log = 1 << 2,
	Warn = 1 << 3,
	Error = 1 << 4,
	Critical = 1 << 5,
}

interface IPipeExecution {
	Execute(data: IPipeData);
}

interface IPipe {
	Pipe(formatter: IFormatter): IPipe;
	Write(output: IOutput): IPipe;
}

interface IPipeData {
	meta: Record<string, unknown>;
	[MessageSymbol]: string;
	[LogLevelSymbol]: LogLevel;
	isTimer: boolean;
}

export type IFormatter = (
	LogLevel: LogLevel,
	message: string,
	args?: Record<string, unknown>
) => string;
export type IOutput = (message: string) => void;

// TODO: Remove and add nessecary options
// eslint-disable-next-line
interface ILoggerOptions {}

export class LoggerPipe implements IPipe {
	pipe: (
		| { type: "formatter"; func: IFormatter }
		| { type: "output"; func: IOutput }
	)[] = [];

	Pipe(formatter: IFormatter): IPipe {
		if (!formatter) throw new Error("formatter provided is undefined");
		this.pipe.push({ type: "formatter", func: formatter });
		return this;
	}

	Write(output: IOutput): IPipe {
		if (!output) throw new Error("output provided is undefined");
		this.pipe.push({ type: "output", func: output });
		return this;
	}

	private Execute(data: IPipeData) {
		for (let i = 0; i < this.pipe.length; ++i) {
			const { type, func } = this.pipe[i];
			switch (type) {
				case "formatter": {
					const newMessage = (func as IFormatter)(
						data[LogLevelSymbol],
						data[MessageSymbol],
						data.meta
					);
					if (!newMessage) return;
					data[MessageSymbol] = newMessage;
					break;
				}
				case "output":
					(func as IOutput)(data[MessageSymbol]);
					break;
			}
		}
	}
}
export class Logger {
	pipe: IPipe = new LoggerPipe();
	options: ILoggerOptions;

	constructor(options: ILoggerOptions) {
		this.options = options;
	}

	private getCallerLine(err: Error) {
		const caller_line = err.stack.split("\n")[4];
		const index = caller_line.indexOf("at ");
		return caller_line.slice(index + 2, caller_line.length);
	}

	private LogInternal(
		type: LogLevel,
		message: string,
		args?: Record<string, unknown>
	) {
		// We do this to get around exposing the Execute method to the user
		(this.pipe as unknown as IPipeExecution).Execute({
			[MessageSymbol]: message,
			[LogLevelSymbol]: type,
			isTimer: false,
			meta: args,
		});
	}

	Debug(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Debug, message, args);
	}
	Info(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Info, message, args);
	}
	Log(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Log, message, args);
	}
	Warn(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Warn, message, args);
	}
	Error(message: string | Error, args?: Record<string, unknown>): void {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Error, errorMessage, args);
	}
	Critical(message: string | Error, args?: Record<string, unknown>): void {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Critical, errorMessage, args);
	}
}
