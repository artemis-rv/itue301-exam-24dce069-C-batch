function formatValidationError(err) {
  const details = Object.entries(err.errors || {}).map(([field, errorObj]) => ({
    field,
    message: errorObj.message,
  }));
  return {
    error: "Validation failed",
    details,
  };
}

module.exports = { formatValidationError };
