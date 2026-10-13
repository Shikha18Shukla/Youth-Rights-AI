const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youth_rights_ai', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

const seed = async () => {
  console.log('[Seed] Starting database seed...');

  await connectDB();

  // Clear existing data
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
    console.log(`[Seed] Cleared collection: ${collection.collectionName}`);
  }

  // Create uploads directory
  const uploadsDir = path.join(__dirname, 'server', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('[Seed] Created uploads directory');
  }

  console.log('[Seed] Database seeded successfully.');
  console.log('[Seed] You can now upload legal documents via the admin panel or API.');
  process.exit(0);
};

seed();
