const db = require('../db/connection');

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id
  , articles.title
  , articles.topic
  , articles.author
  , articles.created_at
  , articles.votes
  , articles.article_img_url
  , COUNT (*)::INT AS comment_count
  FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  const queryString = `SELECT article_id
  , title
  , topic
  , author
  , body
  , created_at 
  , votes
  , article_img_url
  FROM articles 
  WHERE article_id = $1`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Not Found`,
      });
    }
    return rows[0];
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  const queryString = `UPDATE articles
  SET votes = $1
  WHERE article_id = $2
  RETURNING *`;

  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * 
      FROM articles 
      WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not Found`,
        });
      }
    });
};
