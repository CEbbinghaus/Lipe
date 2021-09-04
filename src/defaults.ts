import chalk, { ChalkFunction } from "chalk";
import { IFormatter, IOutput, LogLevel, ProcessingLogLevel } from ".";

export const Colorizer: IFormatter = {
	Format: (
		logLevel: ProcessingLogLevel,
		message: string,
		args?: Record<string, unknown>
	) => {
		if (logLevel == "Timer") return message;

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
	},
};
export const Simple: IFormatter = {
	Format: (
		logLevel: ProcessingLogLevel,
		message: string,
		args?: Record<string, unknown>
	) => {
		if (logLevel == "Timer") return message;
		return `${LogLevel[logLevel]}: ${message}`;
	},
};

export const Console: IOutput = {
	Output: (message: string) => {
		console.log(message);
	},
};
