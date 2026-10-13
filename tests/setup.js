const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let mongod;

// Use a dedicated temp directory inside the project to avoid
// filling the system temp partition and to simplify cleanup.
const TEST_TEMP_DIR = path.join(__dirname, '..', '.test-temp');

beforeAll(async () => {
  // Pin MongoDB version for Windows compatibility
  process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '7.0.14';
  process.env.MONGOMS_DISABLE_POSTINSTALL = '1';

  // Ensure a clean, dedicated temp directory for MongoDB data files
  if (fs.existsSync(TEST_TEMP_DIR)) {
    fs.rmSync(TEST_TEMP_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_TEMP_DIR, { recursive: true });

  mongod = await MongoMemoryServer.create({
    binary: {
      version: process.env.MONGOMS_VERSION,
    },
    instance: {
      storageEngine: 'wiredTiger',
    },
  });

  const uri = mongod.getUri();
  await mongoose.connect(uri);
}, 60000); // Increased timeout for binary download if needed

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  // Clean up the dedicated temp directory
  if (fs.existsSync(TEST_TEMP_DIR)) {
    fs.rmSync(TEST_TEMP_DIR, { recursive: true, force: true });
  }
}, 30000);

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
