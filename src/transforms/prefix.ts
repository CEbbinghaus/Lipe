import chalk, { ChalkFunction } from "chalk";
import { IFormatter, LogLevel } from "../index.js";

const LogColors: { [key: number]: ChalkFunction } = {
	[LogLevel.Debug]: chalk.blueBright.bold,
	[LogLevel.Info]: chalk.blueBright.bold,
	[LogLevel.Log]: chalk.blueBright.bold,
	[LogLevel.Warn]: chalk.yellowBright.bold,
	[LogLevel.Error]: chalk.redBright.bold,
	[LogLevel.Critical]: chalk.magentaBright.bold,
};

export const SimplePrefix: IFormatter = (message: string, { meta, logLevel }) => {
	meta.prefix = LogLevel[logLevel] + ":";
};

export const PrefixWithColor: IFormatter = (
	message: string,
	{ meta, logLevel }
) => {
	const color = LogColors[logLevel];

	if (!color) throw new Error("Invalid Log Level");

	meta.prefix = color(LogLevel[logLevel]) + ":";
};
