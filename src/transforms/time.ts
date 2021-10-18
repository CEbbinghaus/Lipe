import { IFormatter } from "..";
import moment from "moment";

export function Timestamped(format: string): IFormatter;
export function Timestamped(): IFormatter;
export function Timestamped(format = "MM/DD/YYYY HH:mm:ss"): IFormatter {
	return (message, args) => {
		const currentTime = moment().format(format);

		args.meta.timestamp = currentTime;
	};
}
