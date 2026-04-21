export default function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const validationError = new Error("Dados de entrada inválidos");
      validationError.status = 400;
      validationError.details = error.details.map((detail) => detail.message);
      return next(validationError);
    }
    req.body = value;
    return next();
  };
}
