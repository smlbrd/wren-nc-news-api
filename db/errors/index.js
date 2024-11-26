exports.notFoundErrorHandler = (req, res) => {
  res.status(404).send({ msg: `Sorry, there's nothing here!` });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
};

exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: 'Something broke!' });
};
