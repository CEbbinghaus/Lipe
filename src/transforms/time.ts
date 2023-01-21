import dayjs from "dayjs";
import { IFormatter } from "../index.js";


export function Timestamped(format: string): IFormatter;
export function Timestamped(): IFormatter;
/*#__PURE__*/
export function Timestamped(format = "MM/DD/YYYY HH:mm:ss"): IFormatter {
	return (message, args) => {
		const currentTime = dayjs().format(format);

		args.meta.timestamp = currentTime;
	};
}
