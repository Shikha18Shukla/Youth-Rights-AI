const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Analytics = require('../models/Analytics');
const { generateRagResponse } = require('../services/ragService');

// @desc    Process a legal question using RAG and save conversation
// @route   POST /api/chat
const askQuestion = async (req, res, next) => {
  try {
    const { question, chatId, model } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question text is required' });
    }

    let activeChat;
    if (chatId) {
      activeChat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    }

    // Create new chat if not specified or not found
    if (!activeChat) {
      const summaryTitle = question.length > 40 ? question.substring(0, 37) + '...' : question;
      activeChat = await Chat.create({
        userId: req.user.id,
        title: summaryTitle,
        model: model || 'llama3.2',
      });
    }

    // Save User Question Message
    const userMessage = await Message.create({
      chatId: activeChat._id,
      sender: 'user',
      content: question.trim(),
    });

    // Execute RAG Pipeline
    const ragResult = await generateRagResponse(question.trim(), model || activeChat.model || 'llama3.2');

    // Save Bot Response Message
    const botMessage = await Message.create({
      chatId: activeChat._id,
      sender: 'bot',
      content: ragResult.answer,
      sources: ragResult.sources || [],
    });

    // Track analytics
    await Analytics.create({
      eventType: 'chat_query',
      userId: req.user.id,
      metadata: {
        chatId: activeChat._id,
        grounded: ragResult.grounded,
        sourceCount: ragResult.sources ? ragResult.sources.length : 0,
      },
    });

    res.status(200).json({
      success: true,
      chatId: activeChat._id,
      chatTitle: activeChat.title,
      userMessage,
      botMessage,
      sources: ragResult.sources,
      grounded: ragResult.grounded,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chat threads for logged in user
// @route   GET /api/chat/history
const getChatHistory = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: chats.length, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chat thread with message history
// @route   GET /api/chat/:id
const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat thread not found' });
    }

    const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
    res.json({ success: true, chat, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a chat thread & associated messages
// @route   DELETE /api/chat/:id
const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat thread not found' });
    }

    await Message.deleteMany({ chatId: req.params.id });

    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename a chat thread
// @route   PATCH /api/chat/:id
const renameChat = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'New title is required' });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat thread not found' });
    }

    res.json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getChatHistory,
  getChatById,
  deleteChat,
  renameChat,
};
