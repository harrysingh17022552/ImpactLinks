const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = {};
    result.error.issues.forEach((err) => {
      const field = err.path[0];
      formattedErrors[field] = err.message;
    });

    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  req.body = result.data;

  next();
};
export default validate;
