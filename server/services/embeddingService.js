let pipeline = null;

/**
 * Initialize local feature-extraction pipeline for sentence-transformers/all-MiniLM-L6-v2
 */
const getPipeline = async () => {
  if (!pipeline) {
    try {
      const { pipeline: transformersPipeline } = await import('@xenova/transformers');
      pipeline = await transformersPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('[Embedding Service] Local HuggingFace all-MiniLM-L6-v2 pipeline loaded successfully.');
    } catch (err) {
      console.warn('[Embedding Service Warning] Xenova transformers fallback engaged:', err.message);
    }
  }
  return pipeline;
};

/**
 * Generate 384-dimensional embedding for given text string
 */
const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string') return new Array(384).fill(0);
  const cleanText = text.replace(/\n+/g, ' ').trim();

  try {
    const pipe = await getPipeline();
    if (pipe) {
      const output = await pipe(cleanText, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    }
  } catch (err) {
    console.error('[Embedding Generation Error]', err.message);
  }

  // Pure JavaScript Fallback embedding generator (deterministic 384-dim normalized vector)
  return fallbackEmbedding(cleanText);
};

/**
 * Deterministic fallback vector generator (384 dimensions)
 */
function fallbackEmbedding(text) {
  const dim = 384;
  const vec = new Array(dim).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
    const index = Math.abs((hash + i) % dim);
    vec[index] += Math.sin(char + i) * 0.1;
  }
  // Normalize
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vec.map(v => v / norm);
}

module.exports = { generateEmbedding };
