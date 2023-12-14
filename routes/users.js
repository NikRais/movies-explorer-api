const userRouter = require('express').Router();

const { getCurrentUser, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validations');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', updateUserValidation, updateUser);

module.exports = userRouter;
