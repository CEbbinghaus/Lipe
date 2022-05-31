import { IFormatter, LogLevel } from "../index.js";

export const Console: () => IFormatter = () => (message, { logLevel }) => {
	// Bitwise checks to filter for Critical and Error messages
	if (logLevel & (LogLevel.Critical | LogLevel.Error)) console.error(message);
	else console.log(message);
};
