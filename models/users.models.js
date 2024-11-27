const db = require('../db/connection');

exports.fetchUsers = () => {
  return db
    .query(
      `SELECT username, name, avatar_url 
    FROM users`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `SELECT username, name, avatar_url
    FROM users
    WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      console.log(rows)
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'User Not Found' });
      }
      return rows[0];
    });
};
