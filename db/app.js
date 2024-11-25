const express = require('express');

const app = express();

const { getApi } = require('../controllers/app.controllers');

const { getTopics } = require('../controllers/topics.controllers');

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
  res.status(404).send({ msg: `Sorry, there's nothing here!` });
});

module.exports = app;
