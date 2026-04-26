const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getMyAssignedAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');

const { protect, authorise } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, authorise('patient'), bookAppointment);
router.get('/me', protect, authorise('patient'), getMyAppointments);

// Health worker routes
router.get('/assigned', protect, authorise('healthworker'), getMyAssignedAppointments);

// Health worker & admin routes
router.get('/', protect, authorise('healthworker', 'admin'), getAllAppointments);
router.get('/:id', protect, authorise('healthworker', 'admin', 'patient'), getAppointmentById);
router.put('/:id/status', protect, authorise('healthworker', 'admin'), updateAppointmentStatus);

// All roles can cancel
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;