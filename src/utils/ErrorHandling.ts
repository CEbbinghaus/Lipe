/*#__PURE__*/
export function getErrorObject(error: Error = null): Error {
	const err = error || new Error();

	if (!err.stack)
		// Some engines require the error to be thrown for it to generate a stack
		try {
			throw Error("");
		} catch (err) {
			return err;
		}
	return err;
}
