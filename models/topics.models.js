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
      return rows.length > 0 ? true : false;
    });
};
