const userRouter = require('express').Router();

const { getCurrentUser, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validations');

userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', updateUserValidation, updateUser);

module.exports = userRouter;
