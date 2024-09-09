/**
 * asyncHandler is a middleware that wraps an async function in a try catch
 * block and returns a JSON response with a status code and a message
 * in case of an error.
 *
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} - The wrapped async function.
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.statusCode ?? 400).json({
      success: false,
      message: err.message,
    });
  }
};

export default asyncHandler;
