const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const InvalidRequst = require('../errors/invalidRequest');
const NoDataError = require('../errors/noDataError');
const ServerConflictError = require('../errors/serverConflictError');
const TokenInvalidError = require('../errors/tokenInvalidError');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'my_darling_is_over_the_ocean';

module.exports.getToken = (req) => {
  const { authorization: bearerToken } = req.headers;
  const token = bearerToken.replace('Bearer ', '');
  return token;
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new TokenInvalidError('Invalid email or password'));
    }

    const payload = { _id: user._id };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    return res.json({ _id: user._id, token });
  } catch (error) {
    // Handle any other errors that might occur
    return next(error);
  }
};

// GET /users - возвращает всех пользователей
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return next(error);
  }
  return res.status(200).json();
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getById = async (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)

    .then((user) => {
      if (user) return res.send(user);

      throw new NoDataError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequst('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const payload = jwt.decode(this.getToken(req));

    // Fetch the current user information from req.user (provided by the auth middleware)
    const currentUser = await User.findById(payload._id);

    if (!currentUser) {
      return next(new NoDataError('User not found'));
    }

    // Return the user information in the response
    return res.status(200).json(currentUser);
  } catch (error) {
    return next(error);
  }
};

// POST /users - создаёт пользователя
// module.exports.createUser = async (req, res, next) => {
//   try {
//     const { name, about, avatar, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       name,
//       about,
//       avatar,
//       email,
//       password: hashedPassword,
//     });

//     return res.status(201).json({ newUser });
//   } catch (error) {
//     if (error.name === 'ValidationError' || error.name === 'CastError') {
//       return next(new InvalidRequst(error.message));
//     }
//     if (error.code === 11000) {
//       return next(
//         new ServerConflictError('Пользователь с таким email уже существует')
//       );
//     }
//     return next(error);
//   }
// };

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ServerConflictError(
            'Пользователь с таким электронным адресом уже существует'
          )
        );
      } else if (err.name === 'ValidationError') {
        // В случае ошибки валидации отправляем ошибку 400
        next(new InvalidRequst('Переданы некорректные данные при регистрации'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  const payload = jwt.decode(this.getToken(req));

  User.findByIdAndUpdate(
    payload._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NoDataError('User not found');
      }
      return res.status(200).json(updatedUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(
          new InvalidRequst(
            'Переданы некорректные данные при обновлении профиля'
          )
        );
      }
      return next(error);
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const payload = jwt.decode(this.getToken(req));

  return User.findByIdAndUpdate(
    payload,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        return res.json(updatedUser);
      }
      return next(new NoDataError('User not found'));
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(
          new InvalidRequst(
            'Переданы некорректные данные при обновлении профиля'
          )
        );
      }
      return next(error);
    });
};
