const express = require('express');

const app = express();

const { getApi } = require('../controllers/app.controllers');

const { getTopics } = require('../controllers/topics.controllers');

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require('../controllers/articles.controllers');

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../controllers/comments.controllers');

const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
  notFoundErrorHandler,
} = require('../db/errors/index');

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.all('*', notFoundErrorHandler);

app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
