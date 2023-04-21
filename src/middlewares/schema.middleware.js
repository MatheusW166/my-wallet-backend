function mapError(error) {
  return error?.details.map((err) => err.message).join(",") ?? "";
}

function validateSchema(schema) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body);
    if (error) {
      return res.status(422).send(mapError(error));
    }
    req.body = value;
    next();
  };
}

export default validateSchema;
