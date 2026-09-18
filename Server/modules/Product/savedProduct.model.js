import mongoose from "mongoose";

const savedProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

savedProductSchema.index({ user: 1, product: 1 }, { unique: true });

const SavedProduct = mongoose.models.SavedProduct || mongoose.model("SavedProduct", savedProductSchema);

export default SavedProduct;
