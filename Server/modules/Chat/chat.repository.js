import { Chat } from "./chat.model.js";

export const ChatRepository = {
  findByUserId: async (userId) => {
    return await Chat.findOne({ user: userId, is_deleted: false });
  },

  createChat: async (chatData) => {
    return await Chat.create(chatData);
  },

  saveChat: async (chatDoc) => {
    return await chatDoc.save();
  },
};
