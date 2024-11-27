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

exports.fetchTopicsBySlug = (topic) => {
  if (!topic) {
    return;
  }
  return db
    .query(
      `SELECT * FROM topics
    WHERE slug = $1`,
      [topic]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Not Found',
        });
      }
      return rows;
    });
};
