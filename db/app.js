const express = require('express');

const app = express();

const { getApi } = require('../controllers/app.controllers');

const {
  getTopics,
  getArticleById,
} = require('../controllers/topics.controllers');

const { customErrorHandler, psqlErrorHandler } = require('../db/errors/index');

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('*', (req, res) => {
  res.status(404).send({ msg: `Sorry, there's nothing here!` });
});

app.use(customErrorHandler);
app.use(psqlErrorHandler);

module.exports = app;
