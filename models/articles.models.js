const db = require('../db/connection');

exports.fetchArticles = (
  sort_by = 'created_at',
  order = 'DESC',
  topic,
  limit = 10,
  p = 1
) => {
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
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort parameter' });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid order parameter - please choose ASC or DESC',
    });
  }

  queryString += ` GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order}`;

  const validateLimit = Number(limit);
  const validatePage = Number(p);
  const offset = (p - 1) * limit;

  if (isNaN(validateLimit) || isNaN(validatePage)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  queryString += ` LIMIT ${limit}`;
  queryString += ` OFFSET ${offset}`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.countArticles = (topic, limit = 10, p = 1) => {
  let countString = `SELECT COUNT(DISTINCT article_id)::INT AS total_count FROM articles`;

  const countValues = [];

  if (topic) {
    countString += ` WHERE articles.topic = $1`;
    countValues.push(topic);
  }

  return db.query(countString, countValues).then(({ rows }) => {
    const totalArticles = rows[0].total_count;
    const totalPages = Math.ceil(totalArticles / limit);

    if (totalPages > 0 && totalPages < p) {
      return [];
    }
    return rows[0];
  });
};

exports.addArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  const queryValues = [author, title, body, topic, article_img_url];

  const queryString = `INSERT INTO articles (author, title, body, topic, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`;

  return db
    .query(queryString, queryValues)
    .then(({ rows: [{ article_id }] }) => {
      return article_id;
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
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`;

  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
    ])
};

exports.fetchCommentsByArticleId = (article_id, limit = 10, p = 1) => {
  let queryString = `SELECT comment_id
    , votes
    , created_at
    , author
    , body
    , article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`;

  const validateLimit = Number(limit);
  const validatePage = Number(p);
  const offset = (p - 1) * limit;

  if (isNaN(validateLimit) || isNaN(validatePage)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  queryString += ` LIMIT ${limit}`;

  queryString += ` OFFSET ${offset}`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  const queryString = `INSERT INTO comments (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *`;

  return db
    .query(queryString, [article_id, username, body])
    .then(({ rows }) => {
      return rows[0];
    });
};
