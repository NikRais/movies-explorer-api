const corseAllowedOrigins = [
  'http://diplom.nikrais.nomoredomainsmonster.ru',
  'https://diplom.nikrais.nomoredomainsmonster.ru',
  'http://localhost:3000',
  'https://localhost:3000',
];
/*
const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
*/
module.exports = corseAllowedOrigins;
