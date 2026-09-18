import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        unit: { type: String, enum: ["box", "strip"], default: "box" },
        price: { type: Number, required: true },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    total_price: { type: Number },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

cartSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
