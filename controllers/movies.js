const Movie = require('../models/movie');

const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const NoRightsError = require('../errors/no-rights-err');

function sendError(err, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные фильма'));
  } else {
    next(err);
  }
}

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((result) => {
      const movies = result.filter((item) => item.owner._id.toHexString() === req.user._id);
      res.send({ data: movies });
    })
    .catch((err) => sendError(err, next));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .populate(['owner'])
        .then((result) => {
          res.send({ data: result });
        })
        .catch((err) => sendError(err, next));
    })
    .catch((err) => sendError(err, next));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toHexString() !== req.user._id) {
        throw new NoRightsError('Вы не можете удалить чужой фильм');
      }
      movie.deleteOne()
        .then(() => {
          res.send({ data: movie });
        })
        .catch((err) => sendError(err, next));
    })
    .catch((err) => sendError(err, next));
};
