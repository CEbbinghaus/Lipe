import { IFormatter, LogLevel } from "..";
import { existsSync, appendFileSync, writeFileSync } from "fs";
import { join } from "path";

export const WriteToFile: (
	filename: string,
	options?: { minLevel?: LogLevel }
) => IFormatter = (filename, options) => {
	const filePath = join(process.cwd(), filename);
	if (!existsSync(filePath)) {
		writeFileSync(filePath, "");
	}

	return (message, { logLevel }) => {
		if (options?.minLevel && logLevel < options.minLevel) return;

		appendFileSync(filePath, message + "\n");
	};
};
