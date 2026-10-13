const mongoose = require('mongoose');
const legalTopics = require('../data/legalTopics');
const { generateEmbedding } = require('./embeddingService');

/**
 * Seed the vector store with legal topic provisions.
 * This enables the RAG pipeline to retrieve relevant legal content
 * without requiring manual PDF uploads.
 *
 * Idempotent: skips seeding if provisions already exist.
 * Safe: catches all errors and reports status without crashing.
 */
const seedLegalDocuments = async () => {
  try {
    const Embedding = mongoose.model('Embedding');

    // Check if already seeded — use system-seeded marker
    const existingCount = await Embedding.countDocuments({ documentId: null });
    if (existingCount > 0) {
      console.log(`[Legal Seeder] Vector store already has ${existingCount} system-seeded provisions. Skipping seed.`);
      return { seeded: false, count: existingCount, reason: 'already_seeded' };
    }

    console.log('[Legal Seeder] Indexing legal provisions into vector store...');

    const embeddingDocs = [];

    for (const topic of legalTopics) {
      for (const provision of topic.provisions) {
        // Create a comprehensive text chunk for embedding
        const text = [
          `Category: ${topic.category}`,
          `Topic: ${topic.topic}`,
          `Description: ${topic.description}`,
          `Law: ${provision.law}`,
          `${provision.article}: ${provision.text}`,
          provision.sourceUrl ? `Source: ${provision.sourceUrl}` : '',
        ].filter(Boolean).join('\n');

        const vector = await generateEmbedding(text);

        embeddingDocs.push({
          documentId: null, // System-seeded content marker
          documentName: `${provision.law} - ${provision.article}`,
          documentCategory: topic.category,
          documentTopic: topic.topic,
          chunkIndex: embeddingDocs.length,
          pageNumber: 1,
          text: text,
          vector: vector,
          metadata: {
            law: provision.law,
            article: provision.article,
            sourceUrl: provision.sourceUrl || null,
            effectiveDate: provision.effectiveDate || null,
            category: topic.category,
            topic: topic.topic,
          },
        });
      }
    }

    if (embeddingDocs.length > 0) {
      await Embedding.insertMany(embeddingDocs);
    }

    console.log(`[Legal Seeder] Successfully indexed ${embeddingDocs.length} legal provisions.`);
    return { seeded: true, count: embeddingDocs.length };
  } catch (error) {
    console.error('[Legal Seeder Error]', error.message);
    // Don't throw — let the server continue without seeded content
    return { seeded: false, count: 0, error: error.message };
  }
};

module.exports = { seedLegalDocuments };
