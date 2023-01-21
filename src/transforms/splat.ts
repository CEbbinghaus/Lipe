import { IFormatter } from "..";
import { InternalSplat } from "../utils/util.js";

/*#__PURE__*/
export const Splat: (format: string) => IFormatter = (
	format: string = "{Message}"
) => {
	return function (message, { meta }) {
		return InternalSplat(format.replace("{Message}", message), meta);
	};
};
