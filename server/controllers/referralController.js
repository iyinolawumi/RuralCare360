const Referral = require('../models/Referral');
const Patient = require('../models/Patient');

// ── Create Referral (healthworker) ────────────────────
exports.createReferral = async (req, res) => {
  try {
    const referral = await Referral.create({
      ...req.body,
      referredBy: req.user.id
    });

    res.status(201).json({
      message: 'Referral created successfully',
      referral
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get All Referrals (admin) ─────────────────────────
exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('patient')
      .populate('referredBy', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: referrals.length,
      referrals
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get My Created Referrals (healthworker) ───────────
exports.getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referredBy: req.user.id })
      .populate('patient')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: referrals.length,
      referrals
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get My Referrals (patient) ────────────────────────
exports.getMyPatientReferrals = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    const referrals = await Referral.find({ patient: patient._id })
      .populate('referredBy', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: referrals.length,
      referrals
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Get Single Referral ───────────────────────────────
exports.getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('patient')
      .populate('referredBy', 'fullName email phone');

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    res.status(200).json({ referral });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Update Referral Status (healthworker & admin) ─────
exports.updateReferralStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true, runValidators: true }
    );

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    res.status(200).json({
      message: `Referral ${status} successfully`,
      referral
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Delete Referral (admin only) ──────────────────────
exports.deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    res.status(200).json({ message: 'Referral deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};