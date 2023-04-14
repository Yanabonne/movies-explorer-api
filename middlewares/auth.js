const jwt = require('jsonwebtoken');
const IncorrectDataError = require('../errors/incorrect-data-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (next) => {
  next(new IncorrectDataError('Необходима авторизация'));
};

module.exports = (req, res, next) => {
  const authorizationToken = req.headers.authorization;
  if (authorizationToken === undefined) {
    return handleAuthError(next);
  }
  const token = authorizationToken.split('Bearer ')[1];
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;

  return next();
};
