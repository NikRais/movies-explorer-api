const serverResponse = require('../utils/serverResponse');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverResponse.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
