const axios = require('axios');
const { generateEmbedding } = require('./embeddingService');
const { searchVectorStore } = require('./vectorStoreService');
const { OLLAMA_BASE_URL, DEFAULT_MODEL } = require('../config/ollama');

/**
 * RAG Generation Pipeline
 * @param {string} userQuestion
 * @param {string} modelName
 */
const generateRagResponse = async (userQuestion, modelName = DEFAULT_MODEL) => {
  try {
    const selectedModel = modelName || DEFAULT_MODEL;

    // 1. Generate Embedding for User Question
    const queryVector = await generateEmbedding(userQuestion);

    // 2. Vector Search for relevant legal document chunks
    const retrievedChunks = await searchVectorStore(queryVector, 4, 0.25);

    // 3. Check Grounding Condition
    if (!retrievedChunks || retrievedChunks.length === 0) {
      return {
        answer: "I couldn't find sufficient information in the uploaded legal documents.",
        sources: [],
        grounded: false
      };
    }

    // Prepare context block & source citations
    let contextText = '';
    const sources = retrievedChunks.map((chunk, idx) => {
      const sourceLabel = `[Document ${idx + 1}: ${chunk.documentName}, Page ${chunk.pageNumber}]`;
      contextText += `${sourceLabel}\n${chunk.text}\n\n`;
      return {
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        pageNumber: chunk.pageNumber,
        snippet: chunk.text.substring(0, 200) + '...',
        score: Math.round((chunk.score || 0) * 100) / 100
      };
    });

    // 4. Construct Strict RAG System Prompt
    const systemPrompt = `You are a certified Indian Law AI Assistant. You must answer legal questions accurately using ONLY the provided legal document excerpts below.

CRITICAL INSTRUCTIONS:
1. Do NOT make up, assume, or extrapolate any legal facts, statutes, or case law outside of the provided context.
2. If the exact answer is NOT explicitly covered in the context below, respond ONLY with: "I couldn't find sufficient information in the uploaded legal documents."
3. Every claim or legal explanation must explicitly cite the document name and page number from the context (e.g., "[Constitution of India, Page 12]").

RELEVANT LEGAL CONTEXT:
${contextText}

USER QUESTION:
${userQuestion}

DETAILED LEGAL ANSWER (Grounded in Context Only):`;

    // 5. Query Ollama Local LLM
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: selectedModel,
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.2, // Low temperature for high precision & grounded adherence
          top_p: 0.9,
        }
      }, { timeout: 45000 });

      const generatedAnswer = response.data?.response?.trim() || "I couldn't find sufficient information in the uploaded legal documents.";

      return {
        answer: generatedAnswer,
        sources,
        grounded: true,
        modelUsed: selectedModel
      };

    } catch (ollamaErr) {
      console.warn(`[Ollama Error] Could not connect to local Ollama (${OLLAMA_BASE_URL}): ${ollamaErr.message}`);
      
      // Fallback rule-based grounded context answer if Ollama service is loading/unavailable
      const fallbackAnswer = buildFallbackGroundedAnswer(userQuestion, retrievedChunks);
      return {
        answer: fallbackAnswer,
        sources,
        grounded: true,
        modelUsed: 'RAG-Context-Direct'
      };
    }

  } catch (err) {
    console.error('[RAG Pipeline Error]', err);
    return {
      answer: "An error occurred while processing your legal query through the RAG pipeline.",
      sources: [],
      error: err.message
    };
  }
};

/**
 * Direct grounded text synthesizer if Ollama LLM service is offline
 */
function buildFallbackGroundedAnswer(question, chunks) {
  let answer = `**Based on retrieved Indian Legal Documents:**\n\n`;
  chunks.forEach((chunk, index) => {
    answer += `**${index + 1}. From ${chunk.documentName} (Page ${chunk.pageNumber}):**\n`;
    answer += `> "${chunk.text}"\n\n`;
  });
  answer += `*Note: Generated directly from indexed legal source chunks.*`;
  return answer;
}

module.exports = { generateRagResponse };
