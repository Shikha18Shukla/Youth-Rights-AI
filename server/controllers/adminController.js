const User = require('../models/User');
const Document = require('../models/Document');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Embedding = require('../models/Embedding');

// @desc    Get dashboard metrics & statistics for Admin
// @route   GET /api/admin/dashboard
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPdfs = await Document.countDocuments();
    const totalConversations = await Chat.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalChunks = await Embedding.countDocuments();

    const recentUploads = await Document.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'username email');

    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPdfs,
        totalConversations,
        totalMessages,
        totalChunks,
      },
      recentUploads,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for Admin
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user <-> admin)
// @route   PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Clean up user chats and messages
    const userChats = await Chat.find({ userId: req.params.id });
    const chatIds = userChats.map(c => c._id);
    await Message.deleteMany({ chatId: { $in: chatIds } });
    await Chat.deleteMany({ userId: req.params.id });

    res.json({ success: true, message: 'User and associated chat history deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
};
