const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  documentName: { type: String, required: true },
  pageNumber: { type: Number, default: 1 },
  snippet: { type: String },
  score: { type: Number }
});

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sources: [sourceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
