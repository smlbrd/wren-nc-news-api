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
  const promiseArr = [addCommentByArticleId(article_id, username, body)];

  if (article_id) {
    promiseArr.push(checkArticleExists(article_id));
  }

  Promise.all(promiseArr)
    .then(([comment]) => {
      console.log(comment);
      res.status(201).send({ comment });
    })
    // TODO: The error for this is coming back as
    // 23502 and being caught by psqlErrorHandler
    // It should be 404, because checkArticleExists
    // throws a 404 if the article doesn't exist
    // ...is the 23502 *overwriting* the 404?
    .catch(next);
};
