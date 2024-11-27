const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const topicsRouter = require('./topics-router');
const commentsRouter = require('./comments-router');

const { getApi } = require('../controllers/app.controllers');

apiRouter.get('/', getApi);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;
