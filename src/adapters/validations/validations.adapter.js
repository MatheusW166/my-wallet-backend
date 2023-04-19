import Joi from "joi";
import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";
import { validate } from "uuid";

function mapError(error) {
  return error?.details.map((err) => err.message).join(",") ?? "";
}

function validateId(id) {
  const { value, error } = Joi.string()
    .required()
    .custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw Error("user id is invalid");
      }
      return value;
    })
    .validate(id);
  return { value, error: mapError(error) };
}

function validateToken(token) {
  const { value, error } = Joi.string()
    .required()
    .custom((value) => {
      if (!validate(value)) {
        throw Error("token is invalid");
      }
      return value;
    })
    .validate(token);
  return { value, error: mapError(error) };
}

function customHtmlStripTest(value, field) {
  if (!value || typeof value !== "string") {
    throw Error(`${field} must be a non-empty string`);
  }
  const didChange = stripHtml(value).result !== value;
  if (didChange) {
    throw Error(`${field} contains html tags`);
  }
  return value;
}

function validateUser(user) {
  const { value, error } = Joi.object({
    email: Joi.string().trim().email().required(),
    name: Joi.string()
      .trim()
      .required()
      .custom((value) => customHtmlStripTest(value, "name")),
    password: Joi.string()
      .trim()
      .min(3)
      .required()
      .custom((value) => customHtmlStripTest(value, "password")),
  }).validate(user);
  return { value, error: mapError(error) };
}

function validateLogin(login) {
  const { value, error } = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .trim()
      .min(3)
      .required()
      .custom((value) => customHtmlStripTest(value, "password")),
  }).validate(login);
  return { value, error: mapError(error) };
}

const validationAdapter = {
  validateId,
  validateLogin,
  validateToken,
  validateUser,
};

export default validationAdapter;
