const Patient = require('../models/Patient');

// ── Create Patient Record ─────────────────────────────
exports.createPatient = async (req, res) => {
  try {
    // Check if patient record already exists for this user
    const existing = await Patient.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Patient record already exists for this user' });
    }

    const patient = await Patient.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      message: 'Patient record created successfully',
      patient
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get My Patient Record ─────────────────────────────
exports.getMyRecord = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id })
      .populate('user', 'fullName email phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    res.status(200).json({ patient });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get All Patients (health worker & admin only) ─────
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: patients.length,
      patients
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get Single Patient by ID (health worker & admin only)
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('medicalHistory.attendingWorker', 'fullName')
      .populate('prescriptions.prescribedBy', 'fullName');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ patient });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Update Patient Record ─────────────────────────────
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    res.status(200).json({
      message: 'Patient record updated successfully',
      patient
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Add Medical History Entry ─────────────────────────
exports.addMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.medicalHistory.push({
      ...req.body,
      attendingWorker: req.user.id
    });

    await patient.save();

    res.status(200).json({
      message: 'Medical history entry added successfully',
      patient
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Add Prescription ──────────────────────────────────
exports.addPrescription = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.prescriptions.push({
      ...req.body,
      prescribedBy: req.user.id
    });

    await patient.save();

    res.status(200).json({
      message: 'Prescription added successfully',
      patient
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Delete Patient Record (admin only) ───────────────
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient record deactivated successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};