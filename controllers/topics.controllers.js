const { fetchTopics, addTopic } = require('../models/topics.models');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  fetchTopics()
    .then((topics) => {
      const topicAlreadyExists = topics.some((topic) => topic.slug === slug);

      if (topicAlreadyExists) {
        return Promise.reject({
          status: 409,
          msg: 'Topic Already Exists!',
        });
      }

      return addTopic(slug, description);
    })
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
