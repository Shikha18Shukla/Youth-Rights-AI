const axios = require('axios');

/**
 * LLM Provider Abstraction
 * Supports: openai, anthropic, ollama
 * Configure via environment variables.
 */

const getProviderConfig = () => {
  const provider = (process.env.LLM_PROVIDER || 'ollama').toLowerCase();

  switch (provider) {
    case 'openai':
      return {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        baseURL: 'https://api.openai.com/v1',
      };
    case 'anthropic':
      return {
        provider: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        baseURL: 'https://api.anthropic.com/v1',
      };
    case 'ollama':
    default:
      return {
        provider: 'ollama',
        apiKey: null,
        model: process.env.DEFAULT_MODEL || 'llama3.2',
        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      };
  }
};

/**
 * Generate a response from the configured LLM provider.
 * @param {string} systemPrompt - System prompt with context
 * @param {string} userMessage - User question
 * @returns {Promise<string>} Generated response
 */
const generateResponse = async (systemPrompt, userMessage) => {
  const config = getProviderConfig();

  if (config.provider === 'openai') {
    if (!config.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured. Set it in your .env file.');
    }
    return await callOpenAI(config, systemPrompt, userMessage);
  }

  if (config.provider === 'anthropic') {
    if (!config.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured. Set it in your .env file.');
    }
    return await callAnthropic(config, systemPrompt, userMessage);
  }

  // Ollama (default)
  return await callOllama(config, systemPrompt, userMessage);
};

const callOpenAI = async (config, systemPrompt, userMessage) => {
  const response = await axios.post(
    `${config.baseURL}/chat/completions`,
    {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    },
    {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );
  return response.data.choices[0].message.content.trim();
};

const callAnthropic = async (config, systemPrompt, userMessage) => {
  const response = await axios.post(
    `${config.baseURL}/messages`,
    {
      model: config.model,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage },
      ],
    },
    {
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      timeout: 60000,
    }
  );
  return response.data.content[0].text.trim();
};

const callOllama = async (config, systemPrompt, userMessage) => {
  const response = await axios.post(
    `${config.baseURL}/api/generate`,
    {
      model: config.model,
      prompt: `${systemPrompt}\n\n${userMessage}`,
      stream: false,
      options: {
        temperature: 0.2,
        top_p: 0.9,
      },
    },
    { timeout: 45000 }
  );
  return response.data?.response?.trim() || '';
};

const getProviderInfo = () => {
  const config = getProviderConfig();
  return {
    provider: config.provider,
    model: config.model,
    configured: config.provider === 'ollama' ? true : !!config.apiKey,
  };
};

module.exports = {
  generateResponse,
  getProviderConfig,
  getProviderInfo,
};
