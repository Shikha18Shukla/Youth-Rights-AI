module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  verbose: true,
  // Force sequential execution to prevent MongoDB binary crashes on Windows
  // Jest worker processes interfere with mongod binary execution
  maxWorkers: 1,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
