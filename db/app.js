const express = require('express');

const app = express();

const { getApi } = require('../controllers/app.controllers');

const { getTopics } = require('../controllers/topics.controllers');

const {
  getArticles,
  getArticleById,
} = require('../controllers/articles.controllers');

const {
  getCommentsByArticleId,
} = require('../controllers/comments.controllers');

const {
  customErrorHandler,
  serverErrorHandler,
  notFoundErrorHandler,
} = require('../db/errors/index');

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);



app.all('*', notFoundErrorHandler);

app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
