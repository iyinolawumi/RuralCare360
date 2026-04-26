const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');

// ── Start Consultation (healthworker) ─────────────────
exports.startConsultation = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if consultation already exists
    const existing = await Consultation.findOne({ 
      appointment: req.params.appointmentId 
    });
    if (existing) {
      return res.status(200).json({ 
        message: 'Consultation already exists', 
        consultation: existing 
      });
    }

    const consultation = await Consultation.create({
      appointment: appointment._id,
      patient: appointment.patient,
      healthWorker: appointment.healthWorker,
      status: 'active',
      startedAt: new Date()
    });

    // Update appointment status
    appointment.status = 'confirmed';
    await appointment.save();

    res.status(201).json({
      message: 'Consultation started successfully',
      consultation
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get Consultation by Appointment ───────────────────
exports.getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ 
      appointment: req.params.appointmentId 
    })
      .populate('patient', 'fullName email')
      .populate('healthWorker', 'fullName email')
      .populate('messages.sender', 'fullName role');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.status(200).json({ consultation });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get My Consultations ──────────────────────────────
exports.getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({
      $or: [
        { patient: req.user.id },
        { healthWorker: req.user.id }
      ]
    })
      .populate('appointment')
      .populate('patient', 'fullName')
      .populate('healthWorker', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: consultations.length,
      consultations
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── End Consultation (healthworker) ───────────────────
exports.endConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.status = 'completed';
    consultation.endedAt = new Date();
    consultation.summary = req.body.summary || '';
    await consultation.save();

    // Mark appointment as completed
    await Appointment.findByIdAndUpdate(
      consultation.appointment,
      { status: 'completed' }
    );

    res.status(200).json({
      message: 'Consultation ended successfully',
      consultation
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};