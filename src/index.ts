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
	Through(pipe: IPipe): IPipe;
}

interface IPipeData {
	meta: Record<string, unknown>;
	[MessageSymbol]: string;
	[LogLevelSymbol]: LogLevel;
	isTimer: boolean;
	options: ILoggerOptions;
}

type FormatterOptions = {
	logLevel: LogLevel;
	args: Record<string, unknown>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type IFormatter = (
	message: string,
	options: FormatterOptions
	) => any;
/* eslint-enable */

export class LoggerPipe implements IPipe {

	pipe: IFormatter[] = [];

	constructor(pipe: (IFormatter[]) = null){
		this.pipe = pipe || this.pipe;
	}

	Pipe(formatter: IFormatter): IPipe {
		if (!formatter) throw new Error("formatter provided is undefined");
		return new LoggerPipe([...this.pipe, formatter]);
	}

	Through(pipe: IPipe): IPipe {
		return new LoggerPipe([...this.pipe,...(pipe as LoggerPipe).pipe]);
	}

	/* eslint-disable no-await-in-loop*/
	private async Execute({[MessageSymbol]: message, [LogLevelSymbol]: logLevel, meta, options }: IPipeData) {
		for (let i = 0; i < this.pipe.length; ++i) {
			const func = this.pipe[i];

			let result = func(message, {
				args: meta,
				logLevel: logLevel,
			});
			
			// make sure to await Promises if the option is set
			if(options.awaitPromises)
				result = await Promise.resolve(result);
			else{
				// We need to Skip past it if it is a Promise
				if(typeof(result?.then) === "function")
					continue;
			}

			// Output function that does not modify the Message,
			if(result === undefined)
				continue;

			// Explicitly returning Negative value. Stop execution of the Pipe
			if(result === false || result === null)
				return;

			if(typeof(result) !== "string")
				throw new TypeError(`Value returned was of type ${typeof(result)}. Must be of type String`);

			message = result;
		}
	}
	/* eslint-enable */
}

interface ILoggerOptions {
	awaitPromises: boolean;
}

const defaultOptions: ILoggerOptions = {
	awaitPromises: false
};
export class Logger {
	private pipes: IPipe[] = [new LoggerPipe()]; 
	
	get pipe(): IPipe{
		return this.pipes[0];
	}

	set pipe(value: IPipe){
		this.pipes[0] = value;
	}

	options: ILoggerOptions;

	constructor(options: ILoggerOptions = null) {
		this.options = options || defaultOptions;
	}
	
	AddPipe(pipe: IPipe): Logger{
		this.pipes.push(pipe);
		return this;
	}

	RemovePipe(pipe: IPipe): Logger{
		const index = this.pipes.indexOf(pipe);

		if(index === -1) return;

		this.pipes.splice(index, 1);
		return this;
	}

	ClearPipes(): Logger{
		this.pipes = [new LoggerPipe()];
		return this;
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
		// Old for loop for its (minimal) speed gain
		for(let i = 0; i < this.pipes.length; ++i){

			// We do this to get around exposing the Execute method to the user
			(this.pipes[i] as unknown as IPipeExecution).Execute({
				[MessageSymbol]: message,
				[LogLevelSymbol]: type,
				isTimer: false,
				meta: args,
				options: this.options,
			});
		}

	}

	/**
	 * Writes a Debug Log
	 * 
	 * @param {string} message 
	 * @param {Record<string, unknown>} [args] 
	 * 
	 * @memberOf Logger
	 */
	Debug(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Debug, message, args);
	}
	/**
	 * Writes a Info Log
	 * 
	 * @param {string} message 
	 * @param {Record<string, unknown>} [args] 
	 * 
	 * @memberOf Logger
	 */
	Info(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Info, message, args);
	}
	/**
	 * Writes a Log
	 * 
	 * @param {string} message 
	 * @param {Record<string, unknown>} [args] 
	 * 
	 * @memberOf Logger
	 */
	Log(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Log, message, args);
	}
	/**
	 * Writes a Warn Log
	 * 
	 * @param {string} message 
	 * @param {Record<string, unknown>} [args] 
	 * 
	 * @memberOf Logger
	 */
	Warn(message: string, args?: Record<string, unknown>): void {
		this.LogInternal(LogLevel.Warn, message, args);
	}
	/**
	 * Writes a Error Log
	 * 
	 * @param {(string | Error)} message 
	 * @param {Record<string, unknown>} [args] 
	 * 
	 * @memberOf Logger
	 */
	Error(message: string | Error, args?: Record<string, unknown>): void {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Error, errorMessage, args);
	}
	/**
	 * Writes a Critical Log
	 * 
	 * @param {(string | Error)} message 
	 * @param {Record<string, unknown>} [args] 
	 * 
	 * @memberOf Logger
	 */
	Critical(message: string | Error, args?: Record<string, unknown>): void {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Critical, errorMessage, args);
	}
}
