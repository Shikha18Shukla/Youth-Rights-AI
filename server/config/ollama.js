const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'llama3.2';

/**
 * Check if Ollama server is running and accessible
 */
const checkOllamaHealth = async () => {
  try {
    const res = await axios.get(`${OLLAMA_BASE_URL}/api/version`, { timeout: 3000 });
    return { online: true, version: res.data?.version || 'unknown' };
  } catch (err) {
    return { online: false, error: err.message };
  }
};

/**
 * Fetch list of available local models in Ollama
 */
const getAvailableModels = async () => {
  try {
    const res = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 });
    const models = res.data?.models?.map(m => m.name) || [];
    if (!models.includes(DEFAULT_MODEL)) {
      models.unshift(DEFAULT_MODEL);
    }
    return models;
  } catch (err) {
    return [DEFAULT_MODEL, 'llama3', 'mistral', 'deepseek-r1'];
  }
};

module.exports = {
  OLLAMA_BASE_URL,
  DEFAULT_MODEL,
  checkOllamaHealth,
  getAvailableModels
};
