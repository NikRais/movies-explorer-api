require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const limiter = require('./utils/rateLimiter');
const cors = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const {
  PORT, NODE_ENV, DB_URL, MONGO_URL_DEV,
} = require('./utils/devConstants');

const app = express();
app.use(cors);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function init() {
  await mongoose.connect(NODE_ENV === 'production' ? DB_URL : MONGO_URL_DEV);
  await app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
  });
}

init();
