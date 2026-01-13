/**
 * @description A wrapper to handle asynchronous express routes, 
 * catching any errors and passing them to the next middleware.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
