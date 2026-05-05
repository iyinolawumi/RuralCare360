const mongoose = require('mongoose');

const nhisSchema = new mongoose.Schema({
  nhisId: {
    type: String,
    unique: true,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium'],
    default: 'Basic'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'suspended'],
    default: 'active'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  coverageDetails: {
    type: String,
    default: 'Outpatient, Inpatient, Maternity'
  }
}, { timestamps: true });

module.exports = mongoose.model('NHIS', nhisSchema);