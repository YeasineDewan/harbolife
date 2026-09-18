import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(1, "Product Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    requires_prescription: z.boolean(),
    has_strips: z.boolean(),
    strip_count: z.coerce.number().default(0),
    strips_per_box: z.coerce.number().default(0),
  })
  .superRefine((data, ctx) => {
    if (data.has_strips) {
      if (data.strips_per_box <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["strips_per_box"],
          message:
            "Strips per box must be greater than 0 if product has strips",
        });
      }
      if (data.strip_count >= data.strips_per_box) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["strip_count"],
          message: `Strip count (${data.strip_count}) must be less than strips per box (${data.strips_per_box})`,
        });
      }
    }
  });
