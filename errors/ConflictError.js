const serverResponse = require('../utils/serverResponse');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverResponse.CONFLICT;
  }
}

module.exports = ConflictError;
