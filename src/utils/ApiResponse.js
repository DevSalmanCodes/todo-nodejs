class ApiResponse {
  constructor(statusCode, message, error = {}, data = {}) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = data;
  }
}

export default ApiResponse;
