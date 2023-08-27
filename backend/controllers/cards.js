const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const User = require('../models/user');

const InvalidRequst = require('../errors/invalidRequest');
const NoDataError = require('../errors/noDataError');

// GET /cards — возвращает все карточки
module.exports.getAllCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => next(error));
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(
          new InvalidRequst(
            'Переданы некорректные данные при создании карточки'
          )
        );
      }
      return next(error);
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  const { token } = req.cookies;
  const payload = jwt.decode(token);
  const currentUser = await User.findById(payload); // Get the ID of the current user

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NoDataError('Card not found'));
    }

    if (String(card.owner) !== String(currentUser._id)) {
      // Check if the requesting user is the owner of the card
      return res
        .status(403)
        .json('You do not have permission to delete this card');
    }

    await Card.findByIdAndDelete(cardId);

    return res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new InvalidRequst('Wrong card id'));
    }
    return next(error);
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
// module.exports.likeCard = async (req, res, next) => {
//   const { cardId } = req.params;

//   const { token } = req.cookies;
//   const payload = jwt.decode(token);
//   // Fetch the current user information from req.user (provided by the auth middleware)
//   const currentUser = await User.findById(payload);

//   try {
//     const card = await Card.findByIdAndUpdate(
//       cardId,
//       { $addToSet: { likes: currentUser } },
//       { new: true }
//     );

//     if (!card) {
//       return next(new NoDataError('Wrong like id'));
//     }

//     return res.status(200).json(card);
//   } catch (error) {
//     if (error.name === 'ValidationError' || error.name === 'CastError') {
//       return next(
//         new InvalidRequst(
//           'Переданы некорректные данные при добавлении лайка карточке'
//         )
//       );
//     }
//     return next(error);
//   }
// };

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    }
  )
    .then((card) => {
      if (card) return res.send(card);

      throw new NoDataError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidRequst(
            'Переданы некорректные данные при добавлении лайка карточке'
          )
        );
      } else {
        next(err);
      }
    });
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;

  const { userId } = req.user;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!card) {
      return next(new NoDataError('Wrong like id'));
    }

    return res.status(200).json(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(
        new InvalidRequst(
          'Переданы некорректные данные при добавлении лайка карточке'
        )
      );
    }
    return next(error);
  }
};
