const serverResponse = require('../utils/serverResponse');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverResponse.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
