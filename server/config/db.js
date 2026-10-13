const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS SRV resolution issue (EBADRESP)
// Node.js c-ares library cannot parse SRV records from some Windows DNS servers
// Setting ipv4first changes the resolution order and avoids the parsing issue
dns.setDefaultResultOrder('ipv4first');

const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null,
});

/**
 * Safely serialize a value for diagnostic logging.
 * Handles circular references, Maps, Sets, and redacts sensitive fields.
 * Never logs credentials, connection strings, tokens, or API keys.
 */
const SENSITIVE_KEYS = [
  'uri', 'url', 'connectionString', 'connection_string',
  'username', 'user', 'password', 'pass',
  'apiKey', 'api_key', 'token', 'secret',
  'mongodbUri', 'mongo_uri', 'MONGO_URI',
];

const redactValue = (key, value) => {
  const lowerKey = (key || '').toLowerCase();
  if (SENSITIVE_KEYS.some(sk => lowerKey.includes(sk))) {
    return '[REDACTED]';
  }
  return value;
};

const safeSerialize = (value, depth = 0, seen = new WeakSet()) => {
  // Prevent infinite recursion
  if (depth > 10) return '[Max depth exceeded]';
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;

  // Handle circular references
  if (seen.has(value)) return '[Circular]';
  seen.add(value);

  // Handle Maps
  if (value instanceof Map) {
    const obj = {};
    for (const [k, v] of value) {
      obj[k] = safeSerialize(v, depth + 1, seen);
    }
    return obj;
  }

  // Handle Sets
  if (value instanceof Set) {
    return Array.from(value).map(v => safeSerialize(v, depth + 1, seen));
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => safeSerialize(item, depth + 1, seen));
  }

  // Handle Error objects specially — extract safe fields and redact sensitive ones
  if (value instanceof Error) {
    const errResult = {};
    for (const key of Object.keys(value)) {
      try {
        const val = value[key];
        if (val === null || val === undefined) {
          errResult[key] = val;
        } else if (typeof val === 'object') {
          errResult[key] = safeSerialize(redactValue(key, val), depth + 1, seen);
        } else {
          errResult[key] = redactValue(key, val);
        }
      } catch (e) {
        errResult[key] = '[Error reading property]';
      }
    }
    // Always include name, message, code for Error objects
    errResult.name = value.name;
    errResult.message = value.message;
    errResult.code = value.code || null;
    return errResult;
  }

  // Handle plain objects
  const result = {};
  for (const key of Object.keys(value)) {
    try {
      const val = value[key];
      if (val === null || val === undefined) {
        result[key] = val;
      } else if (typeof val === 'object') {
        result[key] = safeSerialize(redactValue(key, val), depth + 1, seen);
      } else {
        result[key] = redactValue(key, val);
      }
    } catch (e) {
      result[key] = '[Error reading property]';
    }
  }
  return result;
};

/**
 * Extract safe diagnostic information from a MongoDB connection error.
 * Never logs the connection URI, username, password, or API keys.
 */
const getErrorDiagnostics = (error) => {
  const diagnostics = {
    name: error.name || 'Unknown',
    message: error.message || 'No message',
    code: error.code || null,
    errorType: error.errorType || null,
  };

  // Serialize the server-selection reason safely
  if (error.reason) {
    diagnostics.reason = safeSerialize(error.reason);
  }

  // Extract server selection errors (MongoDB driver v4+)
  if (error.errors && Array.isArray(error.errors)) {
    diagnostics.serverErrors = error.errors.map(e => ({
      name: e.name || 'Unknown',
      message: e.message || 'No message',
      code: e.code || null,
    }));
  }

  // Extract topology errors
  if (error.topology && error.topology.errors) {
    diagnostics.topologyErrors = error.topology.errors.map(e => ({
      name: e.name || 'Unknown',
      message: e.message || 'No message',
      code: e.code || null,
    }));
  }

  return diagnostics;
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youth_rights_ai', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    const diagnostics = getErrorDiagnostics(error);
    console.error('[Database Error] Connection failed');
    console.error(`  Name: ${diagnostics.name}`);
    console.error(`  Message: ${diagnostics.message}`);
    if (diagnostics.code) console.error(`  Code: ${diagnostics.code}`);
    if (diagnostics.errorType) console.error(`  ErrorType: ${diagnostics.errorType}`);

    // Log the serialized reason (safe, redacted)
    if (diagnostics.reason) {
      const reasonStr = JSON.stringify(diagnostics.reason, null, 2);
      console.error('  Reason:');
      reasonStr.split('\n').forEach(line => console.error(`    ${line}`));
    }

    if (diagnostics.serverErrors && diagnostics.serverErrors.length > 0) {
      console.error('  Server Errors:');
      diagnostics.serverErrors.forEach((e, i) => {
        console.error(`    [${i}] ${e.name}: ${e.message}${e.code ? ` (code: ${e.code})` : ''}`);
      });
    }

    if (diagnostics.topologyErrors && diagnostics.topologyErrors.length > 0) {
      console.error('  Topology Errors:');
      diagnostics.topologyErrors.forEach((e, i) => {
        console.error(`    [${i}] ${e.name}: ${e.message}${e.code ? ` (code: ${e.code})` : ''}`);
      });
    }

    console.log('[Database Warning] MongoDB connection failed. Database-dependent features will not work.');
    console.log('[Database Hint] Set MONGO_URI in .env to a valid MongoDB connection string.');
    // Do not exit — let the server start so health endpoint can report status
    return null;
  }
};

module.exports = { connectDB, getDBStatus, getErrorDiagnostics, safeSerialize };
