import Joi from "joi";

const nameField = Joi.string()
  .trim()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z\s]+$/)
  .invalid(...Array.from({ length: 10 }, (_, i) => String(i)))
  .messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 50 characters",
    "string.pattern.base":
      "Name must contain only letters and spaces, no numbers allowed",
    "any.required": "Name is required",
    "any.invalid": "Name must be a word, not a number",
  });

const descriptionField = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Description must be a string",
  "string.max": "Description must be at most 500 characters",
});

export const createCategorySchema = Joi.object({
  name: nameField.required(),
  description: descriptionField.optional(),
});

export const updateCategorySchema = Joi.object({
  name: nameField.optional(),
  description: descriptionField.optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided",
  });
