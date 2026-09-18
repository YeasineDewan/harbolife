import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Category name must be at most 50 characters"],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description must be at most 500 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

categorySchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

categorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
