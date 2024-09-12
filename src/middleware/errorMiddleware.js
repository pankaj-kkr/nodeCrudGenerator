const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  console.log('statsus', err);
  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    const validationErrors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));
    return res.status(400).json({ errors: validationErrors });
  }

  switch (statusCode) {
    case 400:
      return res.json({ error: 'Bad Request', message: err.message });
    case 403:
      return res.json({ error: 'Forbidden', message: err.message });
    case 404:
      return res.json({ error: 'Not Found', message: err.message });
    case 500:
      return res.json({ error: 'Internal Server Err', message: err.message });
    default:
      return res.json({
        error: 'Error',
        message: err.message,
      });
  }
};

module.exports = {
  errorHandler,
};
