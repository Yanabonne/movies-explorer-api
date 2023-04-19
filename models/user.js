const { isEmail } = require('validator');
const mongoose = require('mongoose');
require('mongoose-type-url');

function omitV(doc, obj) {
  delete obj.__v;
  return obj;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: isEmail,
        isAsync: false,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    toJSON: {
      transform: omitV,
    },
  },
);

module.exports = mongoose.model('user', userSchema);
