const db = require('../db/connection');

exports.updateCommentById = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  const queryString = `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *`;

  return db.query(queryString, [inc_votes, comment_id])
    .then(({ rows }) => {
    return rows[0];
  });
};

exports.removeCommentById = (comment_id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1
    `,
    [comment_id]
  );
};
