const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
  const queryString = `SELECT comment_id
    , votes
    , created_at
    , author
    , body
    , article_id
    FROM comments
    WHERE article_id = $1`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};
