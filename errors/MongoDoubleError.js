const serverResponse = require('../utils/serverResponse');

class MongoDoubleConflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverResponse.CONFLICT;
  }
}

module.exports = MongoDoubleConflict;
