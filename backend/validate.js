const Joi = require('joi');

const urlRegex = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;
// Схема валидации для создания пользователя
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).default('Урсула Ле Гуин'),
  about: Joi.string().min(2).max(30).default('Писатель'),
  avatar: Joi.string()
    .pattern(urlRegex)
    .default(
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstoryport.online%2Fpoznakomitsya-s-avtorom%2Fvelikaya-skazochnitsa-za-chto-my-lyubim-ursulu-le-guin%2F&psig=AOvVaw25eYgaS3D6yhZgKP6GG1Gq&ust=1690917082219000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOD2hpLTuYADFQAAAAAdAAAAABAE',
    ),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Схема валидации для обновления профиля пользователя
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(30).required(),
});

// Схема валидации для обновления аватара пользователя
const updateAvatarSchema = Joi.object({
  avatar: Joi.string().pattern(urlRegex).required(),
});

// Схема валидации для создания карточки
const createCardSchema = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().pattern(urlRegex).required(),
});

module.exports = {
  createUserSchema,
  updateProfileSchema,
  updateAvatarSchema,
  createCardSchema,
};
