const express = require('express');

const app = express();

const { getApi } = require('../controllers/app.controllers');

const { getTopics } = require('../controllers/topics.controllers');

const { getArticleById } = require('../controllers/articles.controllers');

const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
  notFoundErrorHandler
} = require('../db/errors/index');

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('*', notFoundErrorHandler);

app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
