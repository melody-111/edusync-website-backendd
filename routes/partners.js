const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// --- PUBLIC ROUTES ---

// Get all partner colleges
router.get('/colleges', async (req, res) => {
  try {
    const partners = await Partner.find().sort({ implementationYear: -1 });
    res.json({ success: true, partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all approved reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- ADMIN ROUTES ---

// Add a new partner (Admin Only)
router.post('/colleges', auth.protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json({ success: true, partner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Add a new review (Admin Only - usually manually added from feedback)
router.post('/reviews', auth.protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update review approval status
router.put('/reviews/:id/approve', auth.protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
