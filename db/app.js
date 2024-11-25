const express = require('express');

const app = express();

const { getApi } = require('../controllers/app.controllers');

app.get('/api', getApi);

module.exports = app;
