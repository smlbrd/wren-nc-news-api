const { checkArticleExists } = require('../models/articles.models');
const {
  fetchCommentsByArticleId,
  addCommentByArticleId,
} = require('../models/comments.models');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const promiseArr = [fetchCommentsByArticleId(article_id)];

  if (article_id) {
    promiseArr.push(checkArticleExists(article_id));
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

  checkArticleExists(article_id)
    .then(() => {
      return addCommentByArticleId(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
