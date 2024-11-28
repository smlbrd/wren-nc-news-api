const { checkExists } = require('../db/seeds/utils');
const {
  fetchArticles,
  addArticle,
  fetchArticleById,
  updateArticleById,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  countArticles,
} = require('../models/articles.models');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  const promiseArr = [
    fetchArticles(sort_by, order, topic, limit, p),
    countArticles(topic, limit, p),
  ];

  if (topic) {
    promiseArr.push(checkExists('topics', 'slug', topic));
  }

  Promise.all(promiseArr)
    .then(([articles, articleCount, _]) => {
      res.status(200).send({ articles, articleCount });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  return addArticle(author, title, body, topic, article_img_url)
    .then((article_id) => {
      return fetchArticleById(article_id).then((article) => {
        res.status(201).send({ article });
      });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit } = req.query;

  const promiseArr = [fetchCommentsByArticleId(article_id, limit)];

  if (article_id) {
    promiseArr.push(checkExists('articles', 'article_id', article_id));
  }

  Promise.all(promiseArr)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const promiseArr = [
    checkExists('articles', 'article_id', article_id),
    addCommentByArticleId(article_id, username, body),
  ];

  if (username) {
    promiseArr.push(checkExists('users', 'username', username));
  }

  Promise.all(promiseArr)
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  checkExists('articles', 'article_id', article_id)
    .then(() => {
      return updateArticleById(article_id, inc_votes).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch(next);
};
