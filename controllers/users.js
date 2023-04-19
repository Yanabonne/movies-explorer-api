const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const DuplicationError = require('../errors/duplication-err');

const { NODE_ENV, JWT_SECRET } = process.env;

function sendError(err, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные пользователя'));
  } else if (err.code === 11000) {
    next(new DuplicationError('Пользователь с такими данными уже существует'));
  } else {
    next(err);
  }
}

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => sendError(err, next));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      const data = {
        email: user.email,
        name: user.name,
      };
      res.send({ data });
    })
    .catch((err) => sendError(err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const data = {
        email: user.email,
        name: user.name,
      };
      res.send({ data });
    })
    .catch((err) => sendError(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new IncorrectDataError('Неверные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new IncorrectDataError('Неверные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

          const data = {
            email: user.email,
            name: user.name,
            _id: user._id,
          };
          res.send({ token, data });
        });
    })
    .catch((err) => sendError(err, next));
};
