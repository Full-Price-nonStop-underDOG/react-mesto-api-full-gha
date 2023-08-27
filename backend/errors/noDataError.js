module.exports = class NoDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = message;
  }
};
