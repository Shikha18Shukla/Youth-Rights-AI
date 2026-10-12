const fs = require('fs');
const pdfParse = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const Document = require('../models/Document');
const Embedding = require('../models/Embedding');
const { generateEmbedding } = require('./embeddingService');

/**
 * Extract text and page data from PDF file buffer
 */
const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return {
    text: pdfData.text,
    numPages: pdfData.numpages || 1,
    info: pdfData.info
  };
};

/**
 * Process PDF file: Extract, Chunk, Embed, and Index into Vector DB
 */
const processAndIndexPdf = async (documentId, filePath, originalName) => {
  try {
    const documentObj = await Document.findById(documentId);
    if (!documentObj) throw new Error('Document record not found');

    const { text, numPages } = await extractPdfText(filePath);

    if (!text || text.trim().length === 0) {
      documentObj.status = 'failed';
      documentObj.error = 'PDF contains no extractable text content';
      await documentObj.save();
      return { success: false, message: 'PDF contains no text' };
    }

    // Update document total page count
    documentObj.pageCount = numPages;
    await documentObj.save();

    // Use RecursiveCharacterTextSplitter from LangChain JS
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
      separators: ["\n\n", "\n", " ", ""]
    });

    const rawChunks = await splitter.splitText(text);

    // Delete existing embeddings for this document if re-indexing
    await Embedding.deleteMany({ documentId });

    const embeddingDocs = [];
    const avgCharsPerPage = text.length / numPages || 1000;

    for (let i = 0; i < rawChunks.length; i++) {
      const chunkText = rawChunks[i];
      if (!chunkText || chunkText.trim().length < 20) continue;

      // Estimate page number based on chunk character offset
      const approxOffset = i * (800 - 150);
      const pageNumber = Math.min(Math.ceil(approxOffset / avgCharsPerPage) + 1, numPages);

      const vector = await generateEmbedding(chunkText);

      embeddingDocs.push({
        documentId: documentObj._id,
        documentName: originalName,
        chunkIndex: i,
        pageNumber,
        text: chunkText,
        vector
      });
    }

    if (embeddingDocs.length > 0) {
      await Embedding.insertMany(embeddingDocs);
    }

    documentObj.chunkCount = embeddingDocs.length;
    documentObj.status = 'indexed';
    await documentObj.save();

    return {
      success: true,
      chunkCount: embeddingDocs.length,
      pageCount: numPages
    };
  } catch (err) {
    console.error('[PDF Ingestion Error]', err);
    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
      error: err.message
    });
    throw err;
  }
};

module.exports = {
  extractPdfText,
  processAndIndexPdf
};
