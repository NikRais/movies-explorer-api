const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  standardHeaders: true,
  legacyHeaders: false,
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = { limiter };
