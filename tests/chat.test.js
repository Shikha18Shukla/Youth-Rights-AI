const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('../server/routes/chatRoutes');
const User = require('../server/models/User');
const { protect } = require('../server/middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);

describe('Chat Endpoints', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      username: 'ChatUser',
      email: 'chat@example.com',
      password: 'password123',
    });
    userId = user._id;

    const jwt = require('jsonwebtoken');
    authToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '7d' }
    );
  });

  test('POST /api/chat - should reject without authentication', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ question: 'What are my rights?' });

    expect(res.status).toBe(401);
  });

  test('POST /api/chat - should reject empty question', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ question: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/chat/history - should return empty array for new user', async () => {
    const res = await request(app)
      .get('/api/chat/history')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.chats).toEqual([]);
  });
});
