const express = require('express');
const router = express.Router();
const {
  createPatient,
  getMyRecord,
  getAllPatients,
  getPatientById,
  updatePatient,
  addMedicalHistory,
  addPrescription,
  deletePatient
} = require('../controllers/patientController');

const { protect, authorise } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, authorise('patient'), createPatient);
router.get('/me', protect, authorise('patient'), getMyRecord);
router.put('/me', protect, authorise('patient'), updatePatient);

// Health worker & admin routes
router.get('/', protect, authorise('healthworker', 'admin'), getAllPatients);
router.get('/:id', protect, authorise('healthworker', 'admin'), getPatientById);
router.post('/:id/history', protect, authorise('healthworker', 'admin'), addMedicalHistory);
router.post('/:id/prescription', protect, authorise('healthworker', 'admin'), addPrescription);

// Admin only
router.delete('/:id', protect, authorise('admin'), deletePatient);

module.exports = router;