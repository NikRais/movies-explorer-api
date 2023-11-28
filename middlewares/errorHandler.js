const serverResponse = require('../utils/serverResponse');

module.exports = (err, req, res, next) => {
  res.status(err.statusCode).send({
    message: err.statusCode === serverResponse.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message,
  });
  return next();
};
