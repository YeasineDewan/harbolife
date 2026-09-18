import Joi from "joi";
import { ROLES, DEFAULT_ROLE } from "../../utils/constants.js";

const strongPassword = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be less than or equal to 128 characters",
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number and special character (@$!%*?&)",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  });

// Register
export const RegisterSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than or equal to 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: strongPassword,

  role: Joi.string()
    .valid(...ROLES)
    .default(DEFAULT_ROLE)
    .messages({
      "any.only": `Role must be one of: ${ROLES.join(", ")}`,
      "string.base": "Role must be a string",
    }),
});

// Login 
export const LoginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),
});
