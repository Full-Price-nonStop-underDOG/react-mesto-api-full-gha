const jwt = require('jsonwebtoken');
const TokenInvalidError = require('../errors/tokenInvalidError');

const jwtSecret = process.env.JWT_SECRET || 'my_darling_is_over_the_ocean';

module.exports = (req, res, next) => {
  const { authorization: bearerToken } = req.headers;

  if (!bearerToken) {
    return next(new TokenInvalidError('Необходима авторизация1'));
  }

  const token = bearerToken.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    return next(new TokenInvalidError('Необходима авторизация2'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
