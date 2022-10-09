import { Format } from "./Formatter";

export function InternalSplat(format: string, values: Record<string, unknown>): string{
	// let result = format;

	// for(const key in values){
	// 	result = result.replace(`{${key}}`, values[key] as string);
	// }

	// return result;

	return Format(format, values);
}

// Copied and Adapted from: https://github.com/trentm/node-bunyan/blob/0ff1ae29cc9e028c6c11cd6b60e3b90217b66a10/lib/bunyan.js#L178
export function getCallerInfo(): Record<string, unknown> {
	if (this === undefined) {
		// Cannot access caller info in 'strict' mode.
		return;
	}
	const obj: Record<string, unknown> = {};
	const saveLimit = Error.stackTraceLimit;
	const savePrepare = Error.prepareStackTrace;
	Error.stackTraceLimit = 3;

	Error.prepareStackTrace = function (_, stack) {
		const caller = stack[2];
		obj.file = caller.getFileName();
		obj.line = caller.getLineNumber();
		const func = caller.getFunctionName();
		if (func) obj.func = func;
	};
	Error.captureStackTrace(this, getCallerInfo);
	this.stack;

	Error.stackTraceLimit = saveLimit;
	Error.prepareStackTrace = savePrepare;
	return obj;
}
