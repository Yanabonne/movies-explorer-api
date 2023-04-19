const { isURL } = require('validator');
const mongoose = require('mongoose');
require('mongoose-type-url');

function omitV(doc, obj) {
  delete obj.__v;
  return obj;
}

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: isURL,
        isAsync: false,
      },
    },
    trailer: {
      type: String,
      required: true,
      validate: {
        validator: isURL,
        isAsync: false,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: isURL,
        isAsync: false,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: omitV,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
