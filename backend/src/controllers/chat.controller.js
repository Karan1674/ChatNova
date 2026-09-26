const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const { deleteMemoryByMessageIds } = require("../services/vector.service");

async function createChat(req, res) {
  try {
    const { title } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
      user: user._id,
      title: title || "New Chat"
    });

    return res.status(201).json({
      message: "Chat created Successfully",
      chat: {
        _id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        user: chat.user
      }
    });
  } catch (error) {
    console.error("Create Chat Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getChats(req, res) {
  try {
    const userId = req.user._id;

    const chats = await chatModel.find({ user: userId }).sort({createdAt: -1})
 
    return res.status(200).json({
      message: "Chats fetched successfully",
      chats
    });
  } catch (error) {
    console.error("Get Chats Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getMessageByChatId(req, res) {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await chatModel.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Chat fetched successfully",
      chat,
      messages
    });
  } catch (error) {
    console.error("Get Chat By ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function renameChat(req, res) {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedChat = await chatModel.findOneAndUpdate(
      { _id: chatId, user: userId },
      { title: title.trim(), lastActivity: Date.now() },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Chat renamed successfully",
      chat: updatedChat
    });
  } catch (error) {
    console.error("Rename Chat Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await chatModel.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }

    const messages = await messageModel.find({ chat: chatId }, { _id: 1 });
    const messageIds = messages.map(msg => msg._id.toString());

    if (messageIds.length > 0) {
      await deleteMemoryByMessageIds(messageIds);
    }

    await messageModel.deleteMany({ chat: chatId });

    await chatModel.deleteOne({ _id: chatId });

    return res.status(200).json({
      message: "Chat and associated messages deleted successfully",
      chatId
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createChat,
  getChats,
  getMessageByChatId,
  renameChat,
  deleteChat
};