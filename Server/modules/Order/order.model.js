import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, enum: ["box", "strip"], default: "box" },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "card"],
      default: "COD",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    paymobOrderId: {
      type: String,
      default: null,
      index: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
      phone: { type: String },
    },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    canceledAt: { type: Date },
    is_deleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ user: 1, status: 1 });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
