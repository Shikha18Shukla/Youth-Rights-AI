const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
