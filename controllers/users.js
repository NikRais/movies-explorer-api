const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const serverResponse = require('../utils/serverResponse');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const salt = 10;
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/devConstants');

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

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Неверные почта или пароль'));
    }
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      /* Создание токена */
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
      return res.send({ token });
    }
    return res.status(serverResponse.OK_REQUEST).send('Авторизация завершена');
  } catch (err) {
    return next(err);
  }
};

module.exports.logout = (req, res) => res.cookie('jwt', { expires: Date.now() }).send({ message: 'Совершён выход' });

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

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.status(serverResponse.OK_REQUEST).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Неверый адрес ссылки'));
    }
    return next(err);
  }
};
