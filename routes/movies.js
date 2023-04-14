const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^http[s]?:\/\/[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+\.[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+$/),
    trailer: Joi.string().required().pattern(/^http[s]?:\/\/[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+\.[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+$/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(/^http[s]?:\/\/[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+\.[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+$/),
    movieId: Joi.number().integer().required(),
  }),
}), createMovie);

module.exports = router;
