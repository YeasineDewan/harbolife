import { ChatRepository } from "./chat.repository.js";
import groq from "../../config/groq.js";
import { BadRequestError } from "../../utils/errors.js";
import { getDbContext } from "../../helpers/chat.helpers.js";

export const ChatService = {
  getChatHistory: async (userId) => {
    let chat = await ChatRepository.findByUserId(userId);
    if (!chat) {
      chat = await ChatRepository.createChat({ user: userId, messages: [] });
    }
    return chat.messages;
  },

  sendMessage: async (userId, message) => {
    if (!message || message.trim() === "") {
      throw new BadRequestError("Message content is required");
    }

    let chat = await ChatRepository.findByUserId(userId);
    if (!chat) {
      chat = await ChatRepository.createChat({ user: userId, messages: [] });
    }

    const dbContext = await getDbContext(userId, message);
    const defaultModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

    const systemPrompt = `You are an expert Pharmacy Assistant chatbot for our e-commerce platform.
    Your name is PharmaBot. Your goal is to help users find medications, check order statuses, view their cart, and give general advice.

    Guidelines:
    1. Always be polite, helpful, professional, and friendly.
    2. Provide a medical disclaimer when answering health questions: "Please note: I am an AI assistant. For serious medical conditions, please consult a healthcare professional."
    3. You can answer in English or Arabic depending on the language the user uses.
    4. Keep your answers concise, clear, and helpful.
    5. Use the provided database context to give accurate information about user's orders, cart, and available products. If the user asks about an order or cart and they are in the context, refer to them. If the product is not in stock or not in the context, politely suggest options or tell them.

    Current Date: ${new Date().toDateString()}

    [DATABASE CONTEXT]
    ${dbContext}`;

    const recentHistoryLimit = 10;
    const recentMessages = chat.messages
      .slice(-recentHistoryLimit)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages,
      { role: "user", content: message },
    ];

    const response = await groq.chat.completions.create({
      model: defaultModel,
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantReply = response.choices[0].message.content;

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: assistantReply });

    await ChatRepository.saveChat(chat);

    return {
      reply: assistantReply,
      history: chat.messages,
    };
  },

  clearChatHistory: async (userId) => {
    const chat = await ChatRepository.findByUserId(userId);
    if (chat) {
      chat.messages = [];
      await ChatRepository.saveChat(chat);
    }
  },
};
