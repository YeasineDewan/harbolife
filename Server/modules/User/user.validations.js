import Joi from "joi";
import { ROLES } from "../../utils/constants.js";

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be less than 50 characters",
    "string.base": "Name must be a string",
  }),

  date_of_birth: Joi.date().max("now").iso().messages({
    "date.base": "Date of birth must be a valid date",
    "date.max": "Date of birth cannot be in the future",
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
  }),

  gender: Joi.string().valid("male", "female").messages({
    "any.only": "Gender must be either male or female",
    "string.base": "Gender must be a string",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Phone must be a valid number (10-15 digits)",
      "string.base": "Phone must be a string",
    }),

  email: Joi.string().email().optional(),

  address: Joi.object({
    label: Joi.string().trim().max(50).messages({
      "string.max": "Address label must be less than 50 characters",
      "string.base": "Address label must be a string",
    }),
    city: Joi.string().trim().max(50).messages({
      "string.max": "City must be less than 50 characters",
      "string.base": "City must be a string",
    }),
    street: Joi.string().trim().max(100).messages({
      "string.max": "Street must be less than 100 characters",
      "string.base": "Street must be a string",
    }),
  }).messages({
    "object.base": "Address must be an object",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided",
  });

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().lowercase().trim().required(),

  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
  }),

  role: Joi.string()
    .valid(...ROLES)
    .required()
    .messages({
      "any.only": "Invalid role",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/),
});

export const toggleActiveSchema = Joi.object({
  is_active: Joi.boolean().required(),
});
