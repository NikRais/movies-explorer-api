const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/devConstants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;

  try {
    /* Попытаемся верифицировать токен */
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    /* Отправим ошибку, если не получилось */
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; /* Записываем пейлоуд в объект запроса */

  next(); /* Пропускаем запрос дальше */
};
