const db = require('../db/connection');

exports.fetchTopics = () => {
  return db
    .query(`SELECT topics.slug, topics.description FROM topics`)
    .then(({ rows }) => {
      return rows;
    });
};
