const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// ── Book Appointment (patient) ────────────────────────
exports.bookAppointment = async (req, res) => {
  try {
    // Get patient record linked to logged in user
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ 
        message: 'Patient record not found. Please create your patient profile first.' 
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      ...req.body
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get My Appointments (patient) ────────────────────
exports.getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('healthWorker', 'fullName email phone')
      .sort({ date: -1 });

    res.status(200).json({
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get All Appointments (healthworker & admin) ───────
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient')
      .populate('healthWorker', 'fullName email phone')
      .sort({ date: -1 });

    res.status(200).json({
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get My Assigned Appointments (healthworker) ───────
exports.getMyAssignedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ healthWorker: req.user.id })
      .populate('patient')
      .sort({ date: 1 });

    res.status(200).json({
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get Single Appointment ────────────────────────────
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('healthWorker', 'fullName email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ appointment });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Update Appointment Status (healthworker & admin) ──
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Cancel Appointment ────────────────────────────────
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.id;
    appointment.cancelReason = req.body.cancelReason || 'No reason provided';
    await appointment.save();

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};