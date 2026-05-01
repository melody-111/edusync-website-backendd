const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/enquiry — public, no auth needed
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, organization, subject, message, productInterest, quantity } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'Name, email, subject, message required' });

    const enquiry = await Enquiry.create({ name, email, phone, organization, subject, message, productInterest, quantity });
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/enquiry — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/enquiry/:id — update status (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
