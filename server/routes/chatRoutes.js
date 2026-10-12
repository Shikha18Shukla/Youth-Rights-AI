const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getChatHistory,
  getChatById,
  deleteChat,
  renameChat,
} = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');
const { registeredOnly } = require('../middlewares/roleMiddleware');

router.use(protect, registeredOnly);

router.post('/', askQuestion);
router.get('/history', getChatHistory);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);
router.patch('/:id', renameChat);

module.exports = router;
