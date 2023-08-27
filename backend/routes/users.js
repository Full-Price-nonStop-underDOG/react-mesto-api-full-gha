const express = require('express');
const { celebrate, Joi } = require('celebrate');

const urlRegex = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;
// const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const {
  getUsers,
  getById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
// GET /users - возвращает всех пользователей
router.get('/users', getUsers);

// GET /users/:userId - возвращает пользователя по _id
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getById,
);

// POST /users - создаёт пользователя

// PATCH /users/me — обновляет профиль

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

// PATCH /users/me/avatar — обновляет аватар

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(urlRegex),
    }),
  }),
  updateAvatar,
);

module.exports = router;
