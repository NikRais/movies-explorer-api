const authRouter = require('express').Router();

const { createUser, login } = require('../controllers/users');
const { signUp, signIn } = require('../middlewares/validations');

authRouter.post('/signin', signIn, login);
authRouter.post('/signup', signUp, createUser);

module.exports = authRouter;
