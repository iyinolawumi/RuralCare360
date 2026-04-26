const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredTo: {
    facilityName: {
      type: String,
      required: [true, 'Facility name is required']
    },
    facilityAddress: {
      type: String
    },
    department: {
      type: String
    },
    contactPhone: {
      type: String
    }
  },
  reason: {
    type: String,
    required: [true, 'Reason for referral is required']
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'emergency'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  diagnosis: {
    type: String
  },
  notes: {
    type: String
  },
  feedback: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);