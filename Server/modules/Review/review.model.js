import mongoose from "mongoose";
import Product from "../Product/product.model.js";
import User from "../User/user.model.js";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
        isTopReview: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });


const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;