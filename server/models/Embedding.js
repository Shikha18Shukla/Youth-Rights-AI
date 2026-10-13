const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
      index: true,
    },
    documentName: {
      type: String,
      required: true,
    },
    documentCategory: {
      type: String,
      default: 'General',
    },
    documentTopic: {
      type: String,
      default: 'General',
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    pageNumber: {
      type: Number,
      default: 1,
    },
    text: {
      type: String,
      required: true,
    },
    vector: {
      type: [Number], // 384-dim array for all-MiniLM-L6-v2
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Embedding', embeddingSchema);
