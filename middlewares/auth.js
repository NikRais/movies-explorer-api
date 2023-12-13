const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/devConstants');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { cookies } = req;
    if ((cookies && cookies.jwt)) {
      const token = cookies.jwt;
      /* Попытаемся верифицировать токен */
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
      req.user = payload; /* Записываем пейлоуд в объект запроса */
      next();
    } else {
      next(new UnauthorizedError('Необходима авторизация'));
    }
  } catch (err) {
    /* Отправим ошибку, если не получилось */
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
