

export function getErrorObject() {
  const err = new Error();

  if (!err.stack)
    // Some engines require the error to be thrown for it to generate a stack
    try {
      throw Error("");
    } catch (err) {
      return err;
    }
  return err;
}