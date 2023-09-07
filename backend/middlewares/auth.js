const jwt = require('jsonwebtoken');
const TokenInvalidError = require('../errors/tokenInvalidError');

module.exports = (req, res, next) => {
  const { authorization: bearerToken } = req.headers;

  if (!bearerToken) {
    return res.status(401).send({ message: 'Необходима авторизация1' });
  }

  const token = bearerToken.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'your-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация1' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
