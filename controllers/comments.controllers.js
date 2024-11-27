const { checkExists } = require('../db/seeds/utils');
const { removeCommentById } = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return checkExists('comments', 'comment_id', comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
