const serverResponse = require('../utils/serverResponse');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverResponse.NOT_FOUND;
  }
}

module.exports = NotFoundError;
