import Joi from "joi";

export const CreateProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 1 character",
    "string.max": "Name must be less than or equal to 200 characters",
    "any.required": "Name is required",
  }),

  description: Joi.string().min(5).max(1000).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 5 characters",
    "string.max": "Description must be less than or equal to 1000 characters",
    "any.required": "Description is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  category: Joi.string().hex().length(24).required(),

  stock: Joi.number().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),

  requires_prescription: Joi.boolean().empty("").default(false).messages({
    "boolean.base": "Requires_prescription must be true or false",
  }),

  has_strips: Joi.boolean().empty("").default(false).messages({
    "boolean.base": "Has_strips must be true or false",
  }),

  strip_count: Joi.number().empty("").optional().min(0).default(0).messages({
    "number.base": "Strip_count must be a number",
    "number.min": "Strip_count cannot be negative",
  }),

  strips_per_box: Joi.number().empty("").optional().min(0).default(0).messages({
    "number.base": "Strips per box must be a number",
    "number.min": "Strips per box cannot be negative",
  }),

  is_active: Joi.boolean().empty("").default(true).messages({
    "boolean.base": "is_active must be true or false",
  }),
});

export const UpdateProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character",
    "string.max": "Name must be less than or equal to 200 characters",
  }),

  description: Joi.string().min(5).max(1000).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 5 characters",
    "string.max": "Description must be less than or equal to 1000 characters",
  }),

  price: Joi.number().empty("").min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),

  category: Joi.string().hex().length(24),

  stock: Joi.number().empty("").min(0).messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
  }),

  requires_prescription: Joi.boolean().empty("").messages({
    "boolean.base": "Requires_prescription must be true or false",
  }),

  has_strips: Joi.boolean().empty("").messages({
    "boolean.base": "Has_strips must be true or false",
  }),

  strip_count: Joi.number().empty("").min(0).messages({
    "number.base": "Strip_count must be a number",
    "number.min": "Strip_count cannot be negative",
  }),

  strips_per_box: Joi.number().empty("").min(0).messages({
    "number.base": "Strips per box must be a number",
    "number.min": "Strips per box cannot be negative",
  }),

  is_active: Joi.boolean().empty("").messages({
    "boolean.base": "is_active must be true or false",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
