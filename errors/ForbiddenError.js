const serverResponse = require('../utils/serverResponse');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverResponse.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
