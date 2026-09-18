import Joi from "joi";

export const createReviewSchema = Joi.object({
  product: Joi.string().hex().length(24).required().messages({
    "string.base": "Product ID must be a string",
    "string.hex": "Product ID must be a valid hex string",
    "string.length": "Product ID must be exactly 24 characters long",
    "any.required": "Product ID is required",
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().trim().max(1000).optional().allow("").messages({
    "string.base": "Comment must be a string",
    "string.max": "Comment must be at most 1000 characters",
  }),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
  }),
  comment: Joi.string().trim().max(1000).optional().allow("").messages({
    "string.base": "Comment must be a string",
    "string.max": "Comment must be at most 1000 characters",
  }),
  isTopReview: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
