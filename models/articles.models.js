const db = require('../db/connection');

exports.fetchArticles = (sort_by = 'created_at') => {
  const validSorts = [
    'created_at',
    'article_id',
    'title',
    'topic',
    'author',
    'votes',
  ];

  let queryString = `SELECT articles.article_id
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
  GROUP BY articles.article_id`;

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort parameter!' });
  }

  queryString += ` ORDER BY ${sort_by} DESC`;

  return db.query(queryString).then(({ rows }) => {
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
