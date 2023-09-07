const jwt = require('jsonwebtoken');
const TokenInvalidError = require('../errors/tokenInvalidError');

module.exports = (req, res, next) => {
  const { authorization: bearerToken } = req.headers;

  if (!bearerToken) {
    return next(new TokenInvalidError('Необходима авторизация1'));
  }

  const token = bearerToken.replace('Bearer ', '');
  let payload;

  try {
    const jwtSecret = process.env.JWT_SECRET; // Получаем секретный ключ из переменных окружения
    payload = jwt.verify(token, jwtSecret); // Используем секретный ключ из переменных окружения
  } catch (err) {
    return next(new TokenInvalidError('Необходима авторизация2'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
