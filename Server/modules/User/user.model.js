import mongoose from "mongoose";
import { ROLES, DEFAULT_ROLE } from "../../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    communications_email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [...ROLES],
      default: DEFAULT_ROLE,
      required: true,
    },
    address: {
      label: { type: String },
      city: { type: String },
      street: { type: String },
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

userSchema.index({ role: 1, is_deleted: 1, is_active: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
