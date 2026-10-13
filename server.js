const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, getDBStatus } = require('./server/config/db');
const { apiLimiter } = require('./server/middlewares/rateLimiter');
const errorHandler = require('./server/middlewares/errorHandler');

// Route imports
const authRoutes = require('./server/routes/authRoutes');
const chatRoutes = require('./server/routes/chatRoutes');
const documentRoutes = require('./server/routes/documentRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const analyticsRoutes = require('./server/routes/analyticsRoutes');
const { getProviderInfo } = require('./server/services/llmProvider');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const providerInfo = getProviderInfo();
  const dbStatus = getDBStatus();
  const isReady = dbStatus.connected;

  res.status(isReady ? 200 : 503).json({
    success: isReady,
    message: isReady
      ? 'Youth Rights AI API is running'
      : 'Youth Rights AI API is running but database is unavailable',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    llm: providerInfo,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] Youth Rights AI API running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Connect to MongoDB and seed legal documents
const initializeApp = async () => {
  const conn = await connectDB();

  if (!conn) {
    console.log('[Init] Skipping legal document seeding — database unavailable.');
    return;
  }

  // Seed legal documents into vector store
  try {
    const { seedLegalDocuments } = require('./server/services/legalSeeder');
    const result = await seedLegalDocuments();
    if (result.seeded) {
      console.log(`[Init] Legal documents seeded: ${result.count} provisions indexed.`);
    } else {
      console.log(`[Init] Legal documents already present: ${result.count} provisions.`);
    }
  } catch (seedErr) {
    console.warn('[Init] Legal seeding failed:', seedErr.message);
    console.warn('[Init] Chat retrieval may have limited content. Upload documents via admin panel.');
  }
};

initializeApp();

module.exports = app;
