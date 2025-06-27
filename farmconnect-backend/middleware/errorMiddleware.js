exports.errorHandler = (err, req, res, next) => {
  // TODO: Implement error handler
  res.status(500).json({ message: err.message || 'Server Error' });
}; 