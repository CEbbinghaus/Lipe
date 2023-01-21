import { Format } from "./Formatter";

/*#__PURE__*/
export function InternalSplat(format: string, values: Record<string, unknown>): string{
	return Format(format, values);
}

interface CallerInfo {
	function: string;
	file: string;
	line: number;
}

// Copied and Adapted from: https://github.com/trentm/node-bunyan/blob/0ff1ae29cc9e028c6c11cd6b60e3b90217b66a10/lib/bunyan.js#L178
/*#__PURE__*/
export function getCallerInfo(): CallerInfo | null {
	if (this === undefined) {
		// Cannot access caller info in 'strict' mode.
		return null;
	}
	let obj: CallerInfo = null;
	const saveLimit = Error.stackTraceLimit;
	const savePrepare = Error.prepareStackTrace;
	Error.stackTraceLimit = 3;

	Error.prepareStackTrace = function (_, stack) {
		const caller = stack[2];

		obj = {
			file: caller.getFileName(),
			line: caller.getLineNumber(),
			function: caller.getFunctionName()
		};
	};
	
	Error.captureStackTrace(this, getCallerInfo);
	this.stack;

	Error.stackTraceLimit = saveLimit;
	Error.prepareStackTrace = savePrepare;
	return obj;
}
