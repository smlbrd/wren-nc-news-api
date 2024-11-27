const express = require('express');

const app = express();

const apiRouter = require('../routes/api-router');

const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
  notFoundErrorHandler,
} = require('../db/errors/index');

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', notFoundErrorHandler);

app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
