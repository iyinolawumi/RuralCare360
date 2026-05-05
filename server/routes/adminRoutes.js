const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
  verifyNHIS,
  getRecentActivity,
  getAllNHISRecords
} = require('../controllers/adminController');

const { protect, authorise } = require('../middleware/authMiddleware');

// All admin routes are protected and admin only
router.use(protect, authorise('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.post('/nhis/verify', verifyNHIS);
router.get('/activity', getRecentActivity);
router.get('/nhis', protect, authorise('admin'), getAllNHISRecords);

module.exports = router;