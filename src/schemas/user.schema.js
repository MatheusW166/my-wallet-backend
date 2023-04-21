import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  name: Joi.string().trim().required(),
  password: Joi.string().trim().min(3).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(3).required(),
});

export { loginSchema, registerSchema };
