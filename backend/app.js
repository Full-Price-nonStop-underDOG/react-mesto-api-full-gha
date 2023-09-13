const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./logger');

const app = express();

const router = require('./routes/users');
const routerCards = require('./routes/cards');
const authMiddleware = require('./middlewares/auth');
const NoDataError = require('./errors/noDataError');

const { login, createUser } = require('./controllers/users');

app.use(cookieParser());

const urlRegex = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;

// app.use(
//   cors({
//     origin: ['http://localhost:3000', 'http://korvin.boy.nomoredomainsicu.ru'],
//     credentials: true,
//     allowedHeaders: [
//       'Access-Control-Allow-Origin',
//       'Access-Control-Allow-Headers',
//       'Content-Type',
//     ],
//     methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
//   })
// );

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  }),
);
// app.use((req, res, next) => {
//   res.header(
//     'Access-Control-Allow-Origin',
//     'http://korvin.boy.nomoredomainsicu.ru/sign-up'
//   );
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(3000, () => {});
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64c1194f6128cbaa7041d519', //
//   };

//   next();
// });
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use((req, res, next) => {
  if (
    req.url === '/signup'
    || req.url === '/signin'
    || req.url === '/crash-test'
  ) {
    next(); // Skip auth for signup and signin
  } else {
    authMiddleware(req, res, next); // Apply authMiddleware for other routes
  }
});
app.use(requestLogger);
app.use(router);
app.use(routerCards);

router.use((req, res, next) => next(new NoDataError('Страницы по запрошенному URL не существует')));
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(urlRegex),
    }),
  }),
  createUser,
);
app.use(errorLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  // мне преподаватель Борис Зашляпин сказал, что тут оставить
  // next обязательно поэтому эта ошибка в линтере должна остаться!
  // ошибка с востановлением сервера была у меня в nginx на виртуальной машине,
  // поэтому коммитить в проекте ничего не пришлось
  // Отправляем ошибку клиенту
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? `На сервере произошла ошибка: ${err.message}`
    : err.message;

  res.status(statusCode).json({ message });
});
