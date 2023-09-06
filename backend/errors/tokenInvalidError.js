module.exports = class TokenInvalidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = message;
  }
};
