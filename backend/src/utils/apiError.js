class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = []
  ) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.data = null;
    this.success = false;
    this.errors = errors;
  }
}

export default ApiError;
