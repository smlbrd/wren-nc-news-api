const db = require('../db/connection');

const { articleExists } = require('../db/seeds/utils');

exports.fetchCommentsByArticleId = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  const queryString = `SELECT comment_id
    , votes
    , created_at
    , author
    , body
    , article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`;

  return articleExists(article_id).then(() => {
    return db.query(queryString, [article_id]).then(({ rows }) => {
      return rows;
    });
  });
};
