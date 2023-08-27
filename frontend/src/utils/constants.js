export const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
  },
];

export const elementsApi = {
  headers: {
    authorization: '8de39d2e-51cd-4fb0-8531-ab4805fcaf6d',
    'Content-Type': 'application/json',
  },
  URL: 'https://mesto.nomoreparties.co/v1/cohort-61',
};

export const authenticationElemenetsApi = {
  headers: {
    'Content-Type': 'application/json',
  },
  URL: 'https://api.korvin.boy.nomoredomainsicu.ru',
};

export const config = {
  formSelector: '.form',
  formFields: '.form__field',
  submitButtonSelector: '.form__button',
  inactiveButtonClass: 'form__button_disabled',
  errorField: '.form__field_type_error',
  errorOpacity: 'form__field-error_visible',
};
