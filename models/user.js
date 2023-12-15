const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Имя пользователя должно содержать минимум 2 символа'],
    maxlength: [30, 'Имя пользователя может содержать максимум 30 символов'],
  },
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильно указан формат почты',
    },
    required: [true, 'Поле должно быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findOneFunc(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
    /* Если пользователя не удалось найти, то отклоняем промис */
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      /* Если пользователя удалось найти, то сравниваем хеши */
      return bcrypt.compare(password, user.password)
        .then((matched) => {
        /* Отклоняем промис */
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
