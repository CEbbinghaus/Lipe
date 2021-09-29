const MessageSymbol: unique symbol = Symbol("Message");
const LogLevelSymbol: unique symbol = Symbol("LogLevel");
const ParentSymbol: unique symbol = Symbol("Parent");
const ChildArgsSymbol: unique symbol = Symbol("Parent");

export const Symbols = {
	Message: MessageSymbol,
	LogLevel: LogLevelSymbol,
	Parent: ParentSymbol,
	ChildArgs: ChildArgsSymbol,
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

type args = Record<string|symbol, unknown>;

interface IPipeData {
	meta: args;
	[MessageSymbol]: string;
	[LogLevelSymbol]: LogLevel;
	[ChildArgsSymbol]: Record<string, unknown>;
	isTimer: boolean;
	options: ILoggerOptions;
}

type FormatterOptions = {
	logLevel: LogLevel;
	args: Record<string, unknown>;
	childArgs: Record<string, unknown>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type IFormatter = (message: string, options: FormatterOptions) => any;
/* eslint-enable */

type PipeOptions = {
	allowSideEffects?: boolean;
};

// We need the any type to do proper Type Guarding
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPipe(pipe: any): pipe is LoggerPipe {
	return pipe && pipe?.Pipe && typeof pipe.Pipe === "function";
}
export class LoggerPipe {
	private pipe: IFormatter[] = [];

	private options: PipeOptions;

	constructor();
	constructor(pipe: IFormatter[]);
	constructor(pipe: IFormatter[], options: PipeOptions);
	constructor(pipe: IFormatter[] = null, options: PipeOptions = {}) {
		this.pipe = pipe || this.pipe;
		this.options = options;
	}

	Pipe(...pipeElements: (IFormatter | LoggerPipe)[]): LoggerPipe {
		if (!pipeElements || pipeElements.length == 0)
			throw new Error("No Arguments Provided. Must supply at least one");

		const newPipe = [...this.pipe];

		for (let i = 0; i < pipeElements.length; ++i) {
			const element = pipeElements[i];

			if (isPipe(element)) newPipe.push.apply(newPipe, [...element.pipe]);
			else newPipe.push.apply(newPipe, [element]);
		}

		if (this.options.allowSideEffects) {
			this.pipe = newPipe;
			return this;
		}

		return new LoggerPipe(newPipe, this.options);
	}
	/* eslint-disable no-await-in-loop*/
	private async Execute({
		[MessageSymbol]: message,
		[LogLevelSymbol]: logLevel,
		[ChildArgsSymbol]: childArgs,
		meta,
		options,
	}: IPipeData) {
		for (let i = 0; i < this.pipe.length; ++i) {
			const func = this.pipe[i];

			let result = func(message, {
				args: meta,
				logLevel: logLevel,
				childArgs: childArgs
			});

			// make sure to await Promises if the option is set
			if (options.awaitPromises) result = await Promise.resolve(result);
			else {
				// We need to Skip past it if it is a Promise
				if (typeof result?.then === "function") continue;
			}

			// Output function that does not modify the Message,
			if (result === undefined) continue;

			// Explicitly returning Negative value. Stop execution of the Pipe
			if (result === false || result === null) return;

			if (typeof result !== "string")
				throw new TypeError(
					`Value returned was of type ${typeof result}. Must be of type String`
				);

			message = result;
		}
	}
	/* eslint-enable */
}

interface ILoggerOptions {
	awaitPromises: boolean;
}

const defaultOptions: ILoggerOptions = {
	awaitPromises: false,
};

class ChildLogger {
	private params: args;
	private parent: Logger;

	constructor(parent: Logger, params: args) {
		this.params = params;
		this.parent = parent;
	}

	/**
	 * Writes a Debug Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Debug(message: string, args?: args): void {
		this.parent.Debug(message, {
			[ChildArgsSymbol]: this.params,
			...(args || {}),
		});
	}
	/**
	 * Writes a Info Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Info(message: string, args?: args): void {
		this.parent.Info(message, {
			[ChildArgsSymbol]: this.params,
			...(args || {}),
		});
	}
	/**
	 * Writes a Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Log(message: string, args?: args): void {
		this.parent.Log(message, {
			[ChildArgsSymbol]: this.params,
			...(args || {}),
		});
	}
	/**
	 * Writes a Warn Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Warn(message: string, args?: args): void {
		this.parent.Warn(message, {
			[ChildArgsSymbol]: this.params,
			...(args || {}),
		});
	}
	/**
	 * Writes a Error Log
	 *
	 * @param {(string | Error)} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Error(message: string | Error, args?: args): void {
		this.parent.Error(message, {
			[ChildArgsSymbol]: this.params,
			...(args || {}),
		});
	}
	/**
	 * Writes a Critical Log
	 *
	 * @param {(string | Error)} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Critical(message: string | Error, args?: args): void {
		this.parent.Critical(message, {
			[ChildArgsSymbol]: this.params,
			...(args || {}),
		});
	}
}

export class Logger {
	private pipes: LoggerPipe[] = [
		new LoggerPipe(undefined, { allowSideEffects: true }),
	];

	get pipe(): LoggerPipe {
		return this.pipes[0];
	}

	set pipe(value: LoggerPipe) {
		this.pipes[0] = value;
	}

	options: ILoggerOptions;

	constructor(options: ILoggerOptions = null) {
		this.options = options || defaultOptions;
	}

	AddPipe(pipe: LoggerPipe): Logger {
		this.pipes.push(pipe);
		return this;
	}

	RemovePipe(pipe: LoggerPipe): Logger {
		const index = this.pipes.indexOf(pipe);

		if (index === -1) return;

		this.pipes.splice(index, 1);
		return this;
	}

	ClearPipes(): Logger {
		this.pipes = [new LoggerPipe(undefined, { allowSideEffects: true })];
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
		args?: Record<string | symbol, unknown>
	) {
		const ChildArgs = args && args[ChildArgsSymbol] as Record<string, unknown>;

		// Old for loop for its (minimal) speed gain
		for (let i = 0; i < this.pipes.length; ++i) {
			// We do this to get around exposing the Execute method to the user
			// @ts-ignore The Method exists but we don't want to expose it to the public.
			this.pipes[i].Execute({
				[MessageSymbol]: message,
				[LogLevelSymbol]: type,
				[ChildArgsSymbol]: ChildArgs,
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
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Debug(message: string, args?: args): void {
		this.LogInternal(LogLevel.Debug, message, args);
	}
	/**
	 * Writes a Info Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Info(message: string, args?: args): void {
		this.LogInternal(LogLevel.Info, message, args);
	}
	/**
	 * Writes a Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Log(message: string, args?: args): void {
		this.LogInternal(LogLevel.Log, message, args);
	}
	/**
	 * Writes a Warn Log
	 *
	 * @param {string} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Warn(message: string, args?: args): void {
		this.LogInternal(LogLevel.Warn, message, args);
	}
	/**
	 * Writes a Error Log
	 *
	 * @param {(string | Error)} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Error(message: string | Error, args?: args): void {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Error, errorMessage, args);
	}
	/**
	 * Writes a Critical Log
	 *
	 * @param {(string | Error)} message
	 * @param {args} [args]
	 *
	 * @memberOf Logger
	 */
	Critical(message: string | Error, args?: args): void {
		const errorMessage = (message as Error)?.message || (message as string);
		this.LogInternal(LogLevel.Critical, errorMessage, args);
	}

	Child(args?: args): ChildLogger {
		return new ChildLogger(this, { ...args });
	}
}
