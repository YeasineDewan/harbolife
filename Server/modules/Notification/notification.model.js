import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "general", // e.g., "low_stock", "order", "system"
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Null means it targets role-based users or broadcast
    },
    recipientRole: {
      type: String,
      enum: ["user", "admin", "courier", "super_admin", "all"],
      default: "all",
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipientRole: 1 });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
