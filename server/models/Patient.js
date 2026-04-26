const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  genotype: {
    type: String,
    enum: ['AA', 'AS', 'SS', 'AC'],
  },
  address: {
    street: String,
    lga: String,       // Local Government Area
    state: String,
  },
  nextOfKin: {
    name: String,
    relationship: String,
    phone: String
  },
  allergies: [String],
  chronicConditions: [String],
  medicalHistory: [
    {
      diagnosis: String,
      treatment: String,
      date: { type: Date, default: Date.now },
      attendingWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  prescriptions: [
    {
      medication: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date,
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  nhisId: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);