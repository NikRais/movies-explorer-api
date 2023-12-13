const statusCodes = require('../utils/serverResponse');

class MongoDoubleConflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.CONFLICT;
  }
}

module.exports = MongoDoubleConflict;
