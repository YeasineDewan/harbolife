import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    num_reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    requires_prescription: {
      type: Boolean,
      default: false,
    },
    has_strips: {
      type: Boolean,
      default: false,
    },
    strip_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    strips_per_box: {
      type: Number,
      default: 0,
      min: 0,
    },
    top_selling: { type: Boolean, default: false },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    save_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    embeddings: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ is_deleted: 1, is_active: 1 });
productSchema.index({ category: 1, is_deleted: 1 });
productSchema.index({ top_selling: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
