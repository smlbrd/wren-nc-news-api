const { checkExists } = require('../db/seeds/utils');
const {
  updateCommentById,
  removeCommentById,
} = require('../models/comments.models');

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return checkExists('comments', 'comment_id', comment_id)
    .then(() => {
      return updateCommentById(comment_id, inc_votes).then((comment) => {
        res.status(200).send({ comment });
      });
    })
    .catch(next);
};

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