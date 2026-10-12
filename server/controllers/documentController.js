const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Embedding = require('../models/Embedding');
const Analytics = require('../models/Analytics');
const { processAndIndexPdf } = require('../services/pdfProcessorService');

// @desc    Upload legal PDF document & process into vector store
// @route   POST /api/documents/upload
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach a PDF file to upload' });
    }

    const { filename, originalname, path: filePath, size } = req.file;

    // Create Document record
    const documentObj = await Document.create({
      filename,
      originalName: originalname,
      filepath: filePath,
      size,
      uploadedBy: req.user.id,
      status: 'processing',
    });

    // Run PDF extraction, chunking, and embedding generation
    const indexResult = await processAndIndexPdf(documentObj._id, filePath, originalname);

    // Track analytics
    await Analytics.create({
      eventType: 'document_upload',
      userId: req.user.id,
      metadata: {
        documentId: documentObj._id,
        filename: originalname,
        chunkCount: indexResult.chunkCount,
      },
    });

    const updatedDoc = await Document.findById(documentObj._id);

    res.status(201).json({
      success: true,
      message: 'PDF document uploaded and indexed successfully into vector store',
      document: updatedDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all uploaded legal documents
// @route   GET /api/documents
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({}).sort({ createdAt: -1 }).populate('uploadedBy', 'username email');
    res.json({ success: true, count: documents.length, documents });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document and its vector embeddings
// @route   DELETE /api/documents/:id
const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Delete physical file if exists
    if (fs.existsSync(doc.filepath)) {
      try { fs.unlinkSync(doc.filepath); } catch (e) { console.warn('Could not delete file:', e.message); }
    }

    // Delete vector embeddings from DB
    await Embedding.deleteMany({ documentId: doc._id });

    // Delete Document record
    await doc.deleteOne();

    res.json({ success: true, message: 'Document and its vector index deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Re-index all documents in vector store
// @route   POST /api/documents/reindex
const reindexDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({});
    let totalChunksIndexed = 0;

    for (const doc of documents) {
      if (fs.existsSync(doc.filepath)) {
        doc.status = 'processing';
        await doc.save();
        const res = await processAndIndexPdf(doc._id, doc.filepath, doc.originalName);
        totalChunksIndexed += res.chunkCount || 0;
      }
    }

    await Analytics.create({
      eventType: 'reindex_documents',
      userId: req.user.id,
      metadata: { totalDocuments: documents.length, totalChunksIndexed },
    });

    res.json({
      success: true,
      message: `Successfully re-indexed ${documents.length} documents (${totalChunksIndexed} total chunks)`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  reindexDocuments,
};
