require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, DB_ADDRESS } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://0.0.0.0:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

// app.use(cors({ origin: ['https://yanabonne.nomoredomains.monster'] }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
