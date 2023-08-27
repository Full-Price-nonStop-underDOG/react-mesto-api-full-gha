module.exports = class InvalidRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = message;
  }
};
