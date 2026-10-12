const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Legal Query',
      trim: true,
    },
    model: {
      type: String,
      default: 'llama3.2',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
