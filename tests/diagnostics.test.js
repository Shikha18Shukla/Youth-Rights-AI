const { getErrorDiagnostics, safeSerialize } = require('../server/config/db');

describe('MongoDB Error Diagnostics', () => {
  test('should handle a basic connection error', () => {
    const error = new Error('Connection failed');
    error.name = 'MongoNetworkError';
    error.code = 'ECONNREFUSED';

    const diagnostics = getErrorDiagnostics(error);

    expect(diagnostics.name).toBe('MongoNetworkError');
    expect(diagnostics.message).toBe('Connection failed');
    expect(diagnostics.code).toBe('ECONNREFUSED');
  });

  test('should serialize server-selection reason with topology servers', () => {
    const mockReason = {
      name: 'MongoServerSelectionError',
      message: 'Could not connect to any servers in your MongoDB Atlas cluster.',
      code: null,
      topology: {
        s: {
          servers: new Map([
            ['ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017', {
              address: 'ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017',
              type: 'Unknown',
              error: { name: 'MongoNetworkError', message: 'connect ECONNREFUSED', code: null },
            }],
            ['ac-c19wdoh-shard-00-01.xu5olgv.mongodb.net:27017', {
              address: 'ac-c19wdoh-shard-00-01.xu5olgv.mongodb.net:27017',
              type: 'Unknown',
              error: { name: 'MongoNetworkError', message: 'connect ECONNREFUSED', code: null },
            }],
          ]),
        },
      },
    };

    const error = new Error('Could not connect to any servers');
    error.name = 'MongooseServerSelectionError';
    error.reason = mockReason;

    const diagnostics = getErrorDiagnostics(error);

    expect(diagnostics.name).toBe('MongooseServerSelectionError');
    expect(diagnostics.reason).toBeDefined();
    expect(diagnostics.reason.topology.s.servers).toBeDefined();

    // Verify server details are serialized
    const servers = diagnostics.reason.topology.s.servers;
    expect(servers['ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017']).toBeDefined();
    expect(servers['ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017'].address).toBe('ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017');
    expect(servers['ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017'].type).toBe('Unknown');
    expect(servers['ac-c19wdoh-shard-00-00.xu5olgv.mongodb.net:27017'].error.name).toBe('MongoNetworkError');
  });

  test('should handle circular references safely', () => {
    const obj = { name: 'test' };
    obj.self = obj; // circular reference

    const result = safeSerialize(obj);

    expect(result.name).toBe('test');
    expect(result.self).toBe('[Circular]');
  });

  test('should redact sensitive fields', () => {
    const error = new Error('Auth failed');
    error.uri = 'mongodb+srv://user:pass@cluster0.mongodb.net';
    error.username = 'testuser';
    error.password = 'secret123';

    const result = safeSerialize(error);

    expect(result.uri).toBe('[REDACTED]');
    expect(result.username).toBe('[REDACTED]');
    expect(result.password).toBe('[REDACTED]');
  });

  test('should handle Map objects', () => {
    const map = new Map([
      ['key1', 'value1'],
      ['key2', { nested: 'value2' }],
    ]);

    const result = safeSerialize(map);

    expect(result.key1).toBe('value1');
    expect(result.key2.nested).toBe('value2');
  });

  test('should handle Error objects', () => {
    const err = new Error('Test error');
    err.name = 'TestError';
    err.code = 'TEST001';

    const result = safeSerialize(err);

    expect(result.name).toBe('TestError');
    expect(result.message).toBe('Test error');
    expect(result.code).toBe('TEST001');
  });

  test('should handle nested objects with depth limit', () => {
    let obj = { value: 'deep' };
    for (let i = 0; i < 15; i++) {
      obj = { nested: obj };
    }

    const result = safeSerialize(obj);

    // Should not throw, and should eventually hit max depth
    expect(result).toBeDefined();
  });

  test('should not log credentials in getErrorDiagnostics', () => {
    const error = new Error('Connection failed');
    error.name = 'MongoServerSelectionError';
    error.reason = {
      topology: {
        s: {
          servers: new Map([
            ['cluster0.mongodb.net:27017', {
              address: 'cluster0.mongodb.net:27017',
              type: 'Standalone',
              error: { name: 'MongoError', message: 'Authentication failed' },
            }],
          ]),
        },
      },
    };

    const diagnostics = getErrorDiagnostics(error);
    const diagnosticsStr = JSON.stringify(diagnostics);

    // Should not contain credential patterns
    expect(diagnosticsStr).not.toMatch(/mongodb\+srv:\/\//);
    expect(diagnosticsStr).not.toMatch(/password/i);
    expect(diagnosticsStr).not.toMatch(/username.*:/);
  });
});
