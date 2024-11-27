const db = require('../db/connection');

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  const validSortBy = [
    'created_at',
    'article_id',
    'title',
    'topic',
    'author',
    'votes',
    'comment_count',
  ];

  const validOrder = ['ASC', 'DESC'];

  const queryValues = [];

  let queryString = `SELECT articles.article_id
  , articles.title
  , articles.topic
  , articles.author
  , articles.created_at
  , articles.votes
  , articles.article_img_url
  , COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort parameter' });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order parameter - please choose ASC or DESC' });
  }

  queryString += ` GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order}`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  const queryString = `SELECT articles.article_id
  , articles.title
  , articles.topic
  , articles.author
  , articles.body
  , articles.created_at
  , articles.votes
  , articles.article_img_url
  , COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

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
