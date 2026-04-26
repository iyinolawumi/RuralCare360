const express = require('express');
const router = express.Router();
const {
  startConsultation,
  getConsultation,
  getMyConsultations,
  endConsultation
} = require('../controllers/consultationController');

const { protect, authorise } = require('../middleware/authMiddleware');

router.post('/start/:appointmentId', protect, authorise('healthworker'), startConsultation);
router.get('/me', protect, getMyConsultations);
router.get('/:appointmentId', protect, getConsultation);
router.put('/:id/end', protect, authorise('healthworker'), endConsultation);

module.exports = router;