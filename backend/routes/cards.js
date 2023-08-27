const express = require('express');
const { celebrate, Joi } = require('celebrate');

const urlRegex = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;

const router = express.Router();

const {
  getAllCards,
  createCard,
  deleteCard,

  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET /cards — возвращает все карточки
router.get('/cards', getAllCards);

// POST /cards — создаёт карточку
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlRegex),
    }),
  }),
  createCard,
);

// DELETE /cards/:cardId — удаляет карточку по идентификатору

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
); // - Поставить лайк карточке

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
); // -
module.exports = router;
