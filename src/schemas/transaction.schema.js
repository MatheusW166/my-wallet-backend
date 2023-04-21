import Joi from "joi";

const transactionSchema = Joi.object({
  value: Joi.number().greater(0).required(),
  description: Joi.string().required(),
  isExit: Joi.bool().required(),
});

export { transactionSchema };
