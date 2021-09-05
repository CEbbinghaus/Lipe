import chalk, { ChalkFunction } from "chalk";
import moment from "moment";
import { IFormatter, IOutput, LogLevel } from ".";
import { existsSync, appendFileSync, writeFileSync } from "fs";
import { join } from "path";


export const Colorizer: IFormatter = (
	logLevel: LogLevel,
	message: string
) => {
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

	const prefix = color(LogLevel[logLevel]);

	return `${prefix}: ${message}`;
};

export const Simple: IFormatter = (logLevel: LogLevel, message: string) => {
	return `${LogLevel[logLevel]}: ${message}`;
};

export function Timestamped(format: string): IFormatter;
export function Timestamped(
	levelOrFormat: string | LogLevel,
	message?: string
): IFormatter | string {
	if (typeof levelOrFormat == "string")
		return (logLevel, message) => {
			const currentTime = moment().format(levelOrFormat);
			return `[${currentTime}] ${message}`;
		};

	const currentTime = moment().format("MM/DD/YYYY HH:mm:ss");
	return `[${currentTime}] ${message}`;
}

export const Console: IOutput = (message: string) => {
	console.log(message);
};

export const WriteToFile: ((filename: string) => IOutput) = (filename) => {
	const filePath = join(process.cwd(), filename);
	if (!existsSync(filePath)){
		writeFileSync(filePath, "");
	}

	return (message) => {
		appendFileSync(filePath, message + "\n");
	};
};
