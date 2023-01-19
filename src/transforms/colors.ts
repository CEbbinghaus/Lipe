import chalk from "chalk";
import { IFormatter } from "..";

export const Colorize: (hex: string) => IFormatter = /*#__PURE__*/ (hex) => {
	return (message: string) => {
		return chalk.hex(hex)(message);
	};
};
