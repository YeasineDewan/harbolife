import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatService } from "./chat.service.js";
import { ChatRepository } from "./chat.repository.js";
import groq from "../../config/groq.js";
import { getDbContext } from "../../helpers/chat.helpers.js";
import { BadRequestError } from "../../utils/errors.js";

vi.mock("./chat.repository.js");
vi.mock("../../config/groq.js", () => ({
  default: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));
vi.mock("../../helpers/chat.helpers.js");

describe("ChatService", () => {
  const mockUserId = "user123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getChatHistory", () => {
    it("should return existing chat messages", async () => {
      const fakeChat = { user: mockUserId, messages: [{ role: "user", content: "Hi" }] };
      ChatRepository.findByUserId.mockResolvedValue(fakeChat);

      const result = await ChatService.getChatHistory(mockUserId);

      expect(result).toEqual(fakeChat.messages);
      expect(ChatRepository.createChat).not.toHaveBeenCalled();
    });

    it("should create new chat if it does not exist and return empty messages", async () => {
      ChatRepository.findByUserId.mockResolvedValue(null);
      ChatRepository.createChat.mockResolvedValue({ user: mockUserId, messages: [] });

      const result = await ChatService.getChatHistory(mockUserId);

      expect(result).toEqual([]);
      expect(ChatRepository.createChat).toHaveBeenCalledWith({ user: mockUserId, messages: [] });
    });
  });

  describe("sendMessage", () => {
    it("should throw BadRequestError if message is missing or empty", async () => {
      await expect(ChatService.sendMessage(mockUserId, "")).rejects.toThrow(BadRequestError);
      await expect(ChatService.sendMessage(mockUserId, "   ")).rejects.toThrow(BadRequestError);
      await expect(ChatService.sendMessage(mockUserId, null)).rejects.toThrow(BadRequestError);
    });

    it("should process message for a new chat successfully", async () => {
      ChatRepository.findByUserId.mockResolvedValue(null);
      const fakeChat = { user: mockUserId, messages: [] };
      ChatRepository.createChat.mockResolvedValue(fakeChat);
      getDbContext.mockResolvedValue("Mocked DB Context");
      
      groq.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: "Hello from AI" } }],
      });

      const result = await ChatService.sendMessage(mockUserId, "Hello");

      expect(getDbContext).toHaveBeenCalledWith(mockUserId, "Hello");
      expect(groq.chat.completions.create).toHaveBeenCalled();
      expect(fakeChat.messages).toHaveLength(2);
      expect(fakeChat.messages[0]).toEqual({ role: "user", content: "Hello" });
      expect(fakeChat.messages[1]).toEqual({ role: "assistant", content: "Hello from AI" });
      expect(ChatRepository.saveChat).toHaveBeenCalledWith(fakeChat);
      expect(result.reply).toBe("Hello from AI");
      expect(result.history).toEqual(fakeChat.messages);
    });

    it("should process message for an existing chat and slice recent history", async () => {
      const fakeMessages = Array(12).fill({ role: "user", content: "old message" });
      const fakeChat = { user: mockUserId, messages: [...fakeMessages] };
      
      ChatRepository.findByUserId.mockResolvedValue(fakeChat);
      getDbContext.mockResolvedValue("Context");
      
      groq.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: "AI Reply" } }],
      });

      const result = await ChatService.sendMessage(mockUserId, "New Message");

      expect(groq.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: "system" }),
            expect.objectContaining({ role: "user", content: "New Message" })
          ])
        })
      );
      
      const callArgs = groq.chat.completions.create.mock.calls[0][0];
      expect(callArgs.messages.length).toBe(12);

      expect(fakeChat.messages.length).toBe(14);
      expect(result.reply).toBe("AI Reply");
    });
  });

  describe("clearChatHistory", () => {
    it("should clear messages and save if chat exists", async () => {
      const fakeChat = { user: mockUserId, messages: [{ role: "user", content: "Hi" }] };
      ChatRepository.findByUserId.mockResolvedValue(fakeChat);

      await ChatService.clearChatHistory(mockUserId);

      expect(fakeChat.messages).toEqual([]);
      expect(ChatRepository.saveChat).toHaveBeenCalledWith(fakeChat);
    });

    it("should do nothing if chat does not exist", async () => {
      ChatRepository.findByUserId.mockResolvedValue(null);

      await ChatService.clearChatHistory(mockUserId);

      expect(ChatRepository.saveChat).not.toHaveBeenCalled();
    });
  });
});