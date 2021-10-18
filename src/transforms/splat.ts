import { IFormatter } from "..";
import { InternalSplat } from "../utils/util";

export const Splat: (format: string) => IFormatter = (
	format: string = "{Message}"
) => {
	return function (message, { meta }) {
		return InternalSplat(format.replace("{Message}", message), meta);
	};
};
