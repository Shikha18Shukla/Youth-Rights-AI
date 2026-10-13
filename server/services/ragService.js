const { generateEmbedding } = require('./embeddingService');
const { searchVectorStore } = require('./vectorStoreService');
const { generateResponse, getProviderInfo, getProviderConfig } = require('./llmProvider');

/**
 * Sanitize user input to prevent prompt injection.
 * Removes common injection patterns while preserving legitimate legal questions.
 */
const sanitizeInput = (text) => {
  if (!text || typeof text !== 'string') return '';
  // Remove common prompt injection patterns
  return text
    .replace(/ignore (all |any )?(previous|above|prior) instructions/gi, '')
    .replace(/you are now/gi, '')
    .replace(/system prompt/gi, '')
    .replace(/<\/?[a-z][\s\S]*?>/gi, '') // Strip HTML tags
    .trim();
};

/**
 * Validate that citations in the LLM response match retrieved evidence.
 * Returns true if all cited sources are found in the evidence.
 */
const validateCitations = (answer, sources) => {
  if (!answer || !sources || sources.length === 0) return true;

  // Extract cited law names from the answer
  const citedLaws = [];
  for (const source of sources) {
    if (source.law && answer.includes(source.law)) {
      citedLaws.push(source.law);
    }
    if (source.article && answer.includes(source.article)) {
      citedLaws.push(source.article);
    }
  }

  // If the answer cites something not in our sources, flag it
  // Look for patterns like "Section XXX" or "Article XXX" in the answer
  const sectionPattern = /(?:Section|Article|Rule)\s+(\d+[A-Za-z]?)/gi;
  const citedSections = [];
  let match;
  while ((match = sectionPattern.exec(answer)) !== null) {
    citedSections.push(match[0]);
  }

  // Check if cited sections exist in our sources
  for (const cited of citedSections) {
    const found = sources.some(s => {
      const articleMatch = s.article && s.article.includes(cited);
      const textMatch = s.text && s.text.includes(cited);
      return articleMatch || textMatch;
    });
    if (!found) {
      console.warn(`[Citation Validation] Answer cites "${cited}" not found in retrieved evidence`);
      return false;
    }
  }

  return true;
};

/**
 * RAG Generation Pipeline
 * @param {string} userQuestion
 * @param {string} modelName
 */
const generateRagResponse = async (userQuestion, modelName = null) => {
  try {
    const providerInfo = getProviderConfig();

    // 0. Sanitize user input
    const sanitizedQuestion = sanitizeInput(userQuestion);
    if (!sanitizedQuestion || sanitizedQuestion.trim().length === 0) {
      return {
        answer: "I couldn't understand your question. Please try rephrasing it.",
        sources: [],
        grounded: false,
      };
    }

    // 1. Generate Embedding for User Question
    const queryVector = await generateEmbedding(sanitizedQuestion);

    // 2. Vector Search for relevant legal document chunks
    const retrievedChunks = await searchVectorStore(queryVector, 4, 0.25);

    // 3. Check Grounding Condition
    if (!retrievedChunks || retrievedChunks.length === 0) {
      return {
        answer: "I couldn't find sufficient information in my available legal sources to answer this question. This may be because the topic is not covered in my current knowledge base, or the question may need clarification. Could you try rephrasing your question or providing more specific details about your legal issue?",
        sources: [],
        grounded: false,
      };
    }

    // Prepare context block & source citations
    let contextText = '';
    const sources = retrievedChunks.map((chunk, idx) => {
      const sourceLabel = `[Document ${idx + 1}: ${chunk.documentName}, Page ${chunk.pageNumber}]`;
      contextText += `${sourceLabel}\n${chunk.text}\n\n`;
      return {
        documentId: chunk.documentId,
        documentName: chunk.law || chunk.documentName,
        article: chunk.article,
        pageNumber: chunk.pageNumber,
        snippet: chunk.text.substring(0, 200) + '...',
        score: Math.round((chunk.score || 0) * 100) / 100,
        sourceUrl: chunk.sourceUrl || null,
        category: chunk.category,
        topic: chunk.topic,
      };
    });

    // 4. Construct Strict RAG System Prompt
    const systemPrompt = `You are Youth Rights AI, an educational legal information assistant focused on Indian law. You help students and young adults understand their legal rights in simple language.

CRITICAL INSTRUCTIONS:
1. Answer using ONLY the legal provisions provided in the context below. Do NOT make up laws, sections, articles, or legal facts.
2. If the answer is NOT explicitly covered in the context, respond with: "I don't have sufficient information in my available sources to answer this question confidently. Please consult a qualified lawyer or the appropriate authority for advice specific to your situation."
3. When you reference a legal provision, cite it using the exact document name and article/section number from the context (e.g., "Article 21 of the Constitution of India" or "Section 3 of the POSH Act, 2013").
4. Explain legal concepts in simple, easy-to-understand language.
5. Include a brief note at the end: "This is general legal information, not legal advice. For advice specific to your situation, please consult a qualified lawyer."
6. Do NOT guarantee specific legal outcomes or promises about case results.

RELEVANT LEGAL CONTEXT:
${contextText}

USER QUESTION:
${sanitizedQuestion}

ANSWER (in simple English, grounded only in the context above):`;

    // 5. Query LLM Provider
    try {
      const generatedAnswer = await generateResponse(systemPrompt, sanitizedQuestion);

      if (!generatedAnswer || generatedAnswer.trim().length === 0) {
        return {
          answer: "I don't have sufficient information in my available sources to answer this question confidently. Please consult a qualified lawyer or the appropriate authority for advice specific to your situation.",
          sources,
          grounded: false,
        };
      }

      // 6. Validate citations in the generated answer
      const citationsValid = validateCitations(generatedAnswer, sources);

      if (!citationsValid) {
        console.warn('[RAG] Citation validation failed — answer may contain unverified references');
        // Append a warning to the answer
        const warningAnswer = generatedAnswer + "\n\n*Note: Some references in this answer could not be fully verified against available sources. Please verify with official publications.*";
        return {
          answer: warningAnswer,
          sources,
          grounded: true,
          modelUsed: providerInfo.model,
          citationWarning: true,
        };
      }

      return {
        answer: generatedAnswer,
        sources,
        grounded: true,
        modelUsed: providerInfo.model,
      };

    } catch (llmErr) {
      console.warn(`[LLM Provider Error] ${llmErr.message}`);

      // Fallback: return retrieved evidence directly when LLM is unavailable
      const fallbackAnswer = buildFallbackGroundedAnswer(sanitizedQuestion, retrievedChunks);
      return {
        answer: fallbackAnswer,
        sources,
        grounded: true,
        modelUsed: 'RAG-Context-Direct',
      };
    }

  } catch (err) {
    console.error('[RAG Pipeline Error]', err);
    return {
      answer: "An error occurred while processing your legal query. Please try again later.",
      sources: [],
      error: err.message,
    };
  }
};

/**
 * Direct grounded text synthesizer if LLM service is offline
 */
function buildFallbackGroundedAnswer(question, chunks) {
  let answer = `Based on the legal provisions I found in my knowledge base:\n\n`;
  chunks.forEach((chunk, index) => {
    const law = chunk.law || chunk.documentName;
    const article = chunk.article || '';
    answer += `**${index + 1}. ${law}${article ? ` — ${article}` : ''}:**\n`;
    answer += `> "${chunk.text}"\n\n`;
    if (chunk.sourceUrl) {
      answer += `   Source: ${chunk.sourceUrl}\n\n`;
    }
  });
  answer += `*This information is retrieved from indexed legal documents. This is general legal information, not legal advice. For advice specific to your situation, please consult a qualified lawyer.*`;
  return answer;
}

module.exports = { generateRagResponse, sanitizeInput, validateCitations };
