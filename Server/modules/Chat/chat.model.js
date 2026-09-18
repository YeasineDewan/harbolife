import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

chatSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;