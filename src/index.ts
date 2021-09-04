import { getErrorObject } from "./utils/ErrorHandling";

export type ProcessingLogLevel = LogLevel | "Timer";

export enum LogLevel {
	Debug = 0,
	Info = 1,
	Log = 1 << 1,
	Warn = 1 << 2,
	Error = 1 << 3,
	Critical = 1 << 4,
}

export interface IFormatter {
	// TODO: Figure out what the return type should be
	Format(	LogLevel: ProcessingLogLevel, message: string, args?: Record<string, unknown>): string;
}

export interface IOutput {
	Output(message: string);
}

export class Logger {
	formatter: IFormatter;

	pipe: IOutput;

	constructor(formatter: IFormatter, output: IOutput){
		this.formatter = formatter;
		this.pipe = output;
	}

	private getCallerLine(err: Error) {
		var caller_line = err.stack.split("\n")[4];
		var index = caller_line.indexOf("at ");
		return caller_line.slice(index + 2, caller_line.length);
	}

	private LogInternal(type: ProcessingLogLevel, message: string, args?: Record<string, unknown>) {
		const formatted = this.formatter.Format(type, message, args);
		this.pipe.Output(formatted);
	}

	Debug(message: string, args?: Record<string, unknown>) {
		this.LogInternal(LogLevel.Debug, message, args);
	}
	Info(message: string, args?: Record<string, unknown>) {
		this.LogInternal(LogLevel.Info, message, args);

	}
	Log(message: string, args?: Record<string, unknown>) {
		this.LogInternal(LogLevel.Log, message, args);

	}
	Warn(message: string, args?: Record<string, unknown>) {
		this.LogInternal(LogLevel.Warn, message, args);

	}
	Error(message: string | Error, args?: Record<string, unknown>) {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Error, errorMessage, args);
		
	}
	Critical(message: string | Error, args?: Record<string, unknown>) {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Critical, errorMessage, args);

	}
}
