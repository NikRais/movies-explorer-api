const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const generateTokenJwt = require('../utils/generateJwt');
const User = require('../models/user');

const serverResponse = require('../utils/serverResponse');
const BadRequestError = require('../errors/BadRequestError');
/*
const ConflictError = require('../errors/ConflictError');
*/
const NotFoundError = require('../errors/NotFoundError');
const MongoDoubleConflict = require('../errors/MongoDoubleError');

const salt = 10;

/*
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/devConstants');
*/

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, salt)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(serverResponse.CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === serverResponse.MONGO_DOUBLE) {
        next(new MongoDoubleConflict('Такой пользователь уже существует'));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError('Неверные данные о пользователе или ссылка'));
      } else {
        next(err);
      }
    });
};

/*
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(new ConflictError('Такой пользователь уже существует'));
    }
    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    return res.status(serverResponse.CREATED).send({
      name: newUser.name,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Неверные данные о пользователе или ссылка'));
    }
    return next(err);
  }
};
*/

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateTokenJwt({ _id: user._id });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: true,
      });
      return res.send({ message: 'Токен сохранён' });
    })
    .catch(next);
};

/*
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Неверные почта или пароль'));
    }
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      /* Создание токена */
/*
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        {
          expiresIn: '7d',
        },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: true,
        secure: true,
      });
      return res.send({ message: 'Токен сохранён' });
    }
    return res.status(serverResponse.OK_REQUEST).send('Авторизация завершена');
  } catch (err) {
    return next(err);
  }
};
*/

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Совершён выход' });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userData = req.user._id;
  User.findById(userData)
    .orFail(new NotFoundError('Пользователь по id не найден'))
    .then((user) => res.status(serverResponse.OK_REQUEST).send(user))
    .catch((err) => {
      next(err);
    });
};

/*
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    if (!currentUser) {
      return next(new NotFoundError('Пользователь по id не найден'));
    }
    return res.status(serverResponse.OK_REQUEST).send({
      name: currentUser.name,
      email: currentUser.email,
    });
  } catch (err) {
    return next(err);
  }
};
*/

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь по id не найден'))
    .then((user) => res.status(serverResponse.OK_REQUEST).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err instanceof CastError) {
        next(new BadRequestError('id указан некорректно'));
      } else {
        next(err);
      }
    });
};
/* return res.status(serverResponse.OK_REQUEST).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Неверый адрес ссылки'));
    }
    return next(err);
  }
}; */
