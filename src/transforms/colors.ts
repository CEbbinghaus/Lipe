import chalk from "chalk";
import { IFormatter } from "..";

/*#__PURE__*/
export const Colorize: (hex: string) => IFormatter = (hex) => {
	return (message: string) => {
		return chalk.hex(hex)(message);
	};
};
