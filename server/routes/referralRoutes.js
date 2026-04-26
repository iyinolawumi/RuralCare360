const express = require('express');
const router = express.Router();
const {
  createReferral,
  getAllReferrals,
  getMyReferrals,
  getMyPatientReferrals,
  getReferralById,
  updateReferralStatus,
  deleteReferral
} = require('../controllers/referralController');

const { protect, authorise } = require('../middleware/authMiddleware');

// Patient routes
router.get('/my-referrals', protect, authorise('patient'), getMyPatientReferrals);

// Health worker routes
router.post('/', protect, authorise('healthworker'), createReferral);
router.get('/my-created', protect, authorise('healthworker'), getMyReferrals);

// Health worker & admin routes
router.get('/:id', protect, authorise('healthworker', 'admin'), getReferralById);
router.put('/:id/status', protect, authorise('healthworker', 'admin'), updateReferralStatus);

// Admin only
router.get('/', protect, authorise('admin'), getAllReferrals);
router.delete('/:id', protect, authorise('admin'), deleteReferral);

module.exports = router;