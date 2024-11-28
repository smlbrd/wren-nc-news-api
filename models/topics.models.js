const db = require('../db/connection');

exports.fetchTopics = () => {
  return db
    .query(
      `
      SELECT topics.slug
      , topics.description 
      FROM topics`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const queryString = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`;

  const queryValues = [slug, description];

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
