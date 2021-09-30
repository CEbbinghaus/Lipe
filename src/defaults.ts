import chalk, { ChalkFunction } from "chalk";
import moment from "moment";
import { IFormatter, LogLevel } from ".";
import { existsSync, appendFileSync, writeFileSync } from "fs";
import { join } from "path";
import { InternalSplat } from "./utils/util";

export const WithColor: IFormatter = (message: string, { meta, logLevel }) => {
	let color: ChalkFunction;

	switch (logLevel) {
		case LogLevel.Debug:
			color = chalk.blueBright.bold;
			break;
		case LogLevel.Info:
			color = chalk.blueBright.bold;
			break;
		case LogLevel.Log:
			color = chalk.blueBright.bold;
			break;
		case LogLevel.Warn:
			color = chalk.yellowBright.bold;
			break;
		case LogLevel.Error:
			color = chalk.redBright.bold;
			break;
		case LogLevel.Critical:
			color = chalk.magentaBright.bold;
			break;
	}

	meta.prefix = color(LogLevel[logLevel]) + ":";
};

export const Simple: IFormatter = (message: string, { meta, logLevel }) => {
	meta.prefix = LogLevel[logLevel] + ":";
};

export function Timestamped(format: string): IFormatter;
export function Timestamped(): IFormatter;
export function Timestamped(
	format = "MM/DD/YYYY HH:mm:ss"
): IFormatter {
	return (message, args) => {
		
		const currentTime = moment().format(format);

		args.meta.timestamp = currentTime;
	};
}

export const Console: IFormatter = (message) => {
	console.log(message);
};

export const WriteToFile: ((filename: string, options?: {minLevel?: LogLevel}) => IFormatter) = (filename, options) => {
	
	const filePath = join(process.cwd(), filename);
	if (!existsSync(filePath)) {
		writeFileSync(filePath, "");
	}

	return (message, {logLevel}) => {
		if(options?.minLevel && logLevel < options.minLevel)
			return;

		appendFileSync(filePath, message + "\n");
	};
};


export const Splat: (format: string) => IFormatter = (
	format: string = "{Message}",) => {
	return function (message, { meta }) {	
		return InternalSplat(format.replace("{Message}", message), meta);
	};
};
