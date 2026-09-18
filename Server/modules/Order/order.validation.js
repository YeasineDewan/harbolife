import Joi from "joi";

export const CreateOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().hex().length(24).required().messages({
          "string.base": "Product ID must be a string",
          "string.hex": "Product ID must be a valid hex string",
          "string.length": "Product ID must be 24 characters long",
          "any.required": "Product ID is required",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "Order must contain at least one item",
      "any.required": "Items array is required",
    }),
  address: Joi.object({
    street: Joi.string().trim().required().messages({
      "string.base": "Street must be a string",
      "string.empty": "Street is required",
      "any.required": "Street is required",
    }),
    city: Joi.string().trim().required().messages({
      "string.base": "City must be a string",
      "string.empty": "City is required",
      "any.required": "City is required",
    }),
    postalCode: Joi.string().trim().allow("").optional().messages({
      "string.base": "Postal code must be a string",
    }),
    phone: Joi.string().trim().allow("").optional().messages({
      "string.base": "Phone must be a string",
    }),
  })
    .required()
    .messages({
      "any.required": "Address is required",
    }),
  paymentMethod: Joi.string()
    .valid("COD", "card")
    .default("COD")
    .optional()
    .messages({
      "any.only": "Payment method must be either COD or card",
    }),
});

export const UpdateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "shipped", "delivered", "canceled")
    .required()
    .messages({
      "any.only":
        "Status must be one of: pending, shipped, delivered, canceled",
      "any.required": "Status is required",
    }),
});
