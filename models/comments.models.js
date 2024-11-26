const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
  const queryString = `SELECT comment_id
    , votes
    , created_at
    , author
    , body
    , article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 404,
      msg: `Not Found`,
    });
  }

  const queryString = `INSERT INTO comments (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *`;

  return db
    .query(queryString, [article_id, username, body])
    .then(({ rows }) => {
      return rows[0];
    });
};
