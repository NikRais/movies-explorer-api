require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes');
const rateLimit = require('./utils/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corseAllowedOrigins = require('./middlewares/corsHandler');

const { NODE_ENV, PORT = 3001, DB_URL } = process.env;
const { MONGO_URL_DEV } = require('./utils/devConstants');

const app = express();
app.use(cors({
  origin: corseAllowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(rateLimit);
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
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
  });
}

init();
