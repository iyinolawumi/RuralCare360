const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Referral = require('../models/Referral');

// ── Get Dashboard Stats ───────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await Patient.countDocuments({ isActive: true });
    const totalHealthWorkers = await User.countDocuments({ role: 'healthworker' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const totalConsultations = await Consultation.countDocuments();
    const activeConsultations = await Consultation.countDocuments({ status: 'active' });
    const totalReferrals = await Referral.countDocuments();
    const urgentReferrals = await Referral.countDocuments({ urgency: 'emergency' });

    res.status(200).json({
      stats: {
        users: {
          total: totalUsers,
          healthWorkers: totalHealthWorkers,
          patients: totalPatients
        },
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          completed: completedAppointments
        },
        consultations: {
          total: totalConsultations,
          active: activeConsultations
        },
        referrals: {
          total: totalReferrals,
          emergency: urgentReferrals
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get All Users ─────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get Single User ───────────────────────────────────
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Activate or Deactivate User ───────────────────────
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Update User Role ──────────────────────────────────
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Delete User ───────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── NHIS Simulation ───────────────────────────────────
exports.verifyNHIS = async (req, res) => {
  try {
    const { nhisId } = req.body;

    // Simulated NHIS database entries
    const mockNHISDatabase = [
      {
        nhisId: 'NHIS-001-2024',
        fullName: 'Adaeze Okonkwo',
        plan: 'Basic',
        status: 'active',
        expiryDate: '2025-12-31',
        coverageDetails: 'Outpatient, Inpatient, Maternity'
      },
      {
        nhisId: 'NHIS-002-2024',
        fullName: 'Emeka Chukwu',
        plan: 'Standard',
        status: 'active',
        expiryDate: '2025-06-30',
        coverageDetails: 'Outpatient, Inpatient, Surgery'
      },
      {
        nhisId: 'NHIS-003-2024',
        fullName: 'Fatima Abdullahi',
        plan: 'Premium',
        status: 'expired',
        expiryDate: '2024-01-01',
        coverageDetails: 'Full Coverage'
      }
    ];

    const record = mockNHISDatabase.find(r => r.nhisId === nhisId);

    if (!record) {
      return res.status(404).json({
        message: 'NHIS ID not found in database',
        verified: false
      });
    }

    res.status(200).json({
      message: 'NHIS record found',
      verified: true,
      data: record
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get Recent Activity ───────────────────────────────
exports.getRecentActivity = async (req, res) => {
  try {
    const recentAppointments = await Appointment.find()
      .populate('patient')
      .populate('healthWorker', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReferrals = await Referral.find()
      .populate('patient')
      .populate('referredBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      recentAppointments,
      recentReferrals,
      recentUsers
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};