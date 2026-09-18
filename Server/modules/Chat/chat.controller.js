import { ChatService } from "./chat.service.js";

export const getChatHistory = async (req, res, next) => {
  try {
    const history = await ChatService.getChatHistory(req.user._id);
    res.status(200).json({
      status: "success",
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const result = await ChatService.sendMessage(req.user._id, message);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const clearChatHistory = async (req, res, next) => {
  try {
    await ChatService.clearChatHistory(req.user._id);
    res.status(200).json({
      status: "success",
      message: "Chat history cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};
