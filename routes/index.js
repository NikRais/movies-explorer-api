const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signUp, signIn } = require('../middlewares/validations');

const NotFoundError = require('../errors/NotFoundError');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', signUp, createUser);
router.post('/signin', signIn, login);
router.post('/signout', logout);

router.use('/movies', auth, movieRouter);
router.use('/users', auth, userRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый адрес не найден'));
});

module.exports = router;
