const Embedding = require('../models/Embedding');

/**
 * Calculate Cosine Similarity between two numeric vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Perform vector similarity search for top-K matching chunks
 * @param {Array<number>} queryVector
 * @param {number} topK
 * @param {number} minScore
 */
const searchVectorStore = async (queryVector, topK = 4, minScore = 0.25) => {
  try {
    const allEmbeddings = await Embedding.find({}).lean();
    if (!allEmbeddings || allEmbeddings.length === 0) {
      return [];
    }

    const scoredChunks = allEmbeddings.map(item => {
      const score = cosineSimilarity(queryVector, item.vector);
      return {
        ...item,
        score,
        law: item.metadata?.law || item.documentName,
        article: item.metadata?.article || null,
        sourceUrl: item.metadata?.sourceUrl || null,
        category: item.documentCategory || item.metadata?.category || 'General',
        topic: item.documentTopic || item.metadata?.topic || 'General',
      };
    });

    // Sort descending by similarity score
    scoredChunks.sort((a, b) => b.score - a.score);

    // Filter by minScore threshold
    const filtered = scoredChunks.filter(item => item.score >= minScore).slice(0, topK);
    return filtered;
  } catch (error) {
    console.error('[Vector Search Error]', error.message);
    return [];
  }
};

module.exports = {
  cosineSimilarity,
  searchVectorStore
};
