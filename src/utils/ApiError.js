class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong") {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
export default ApiError;