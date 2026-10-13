const { getDBStatus } = require('../server/config/db');

describe('Database Configuration', () => {
  test('should report connected status when DB is connected (test setup connects)', () => {
    const status = getDBStatus();
    // The test setup connects to mongodb-memory-server, so DB should be connected
    expect(status.connected).toBe(true);
    expect(status.host).not.toBeNull();
  });

  test('should have correct default database name in env', () => {
    const fs = require('fs');
    const path = require('path');
    const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
    expect(envExample).toContain('youth_rights_ai');
    expect(envExample).not.toContain('legal_guide_rag');
  });

  test('should have LLM provider configuration in env', () => {
    const fs = require('fs');
    const path = require('path');
    const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
    expect(envExample).toContain('LLM_PROVIDER');
    expect(envExample).toContain('OPENAI_API_KEY');
    expect(envExample).toContain('ANTHROPIC_API_KEY');
  });
});
