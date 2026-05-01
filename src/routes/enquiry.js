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

    // Send Email to Admin
    try {
      const sendEmail = require('../utils/sendEmail');
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: `New Enquiry from ${name}: ${subject}`,
        html: `
          <h3>New Website Enquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailErr) {
      console.error('Email failed to send:', emailErr.message);
      // Don't fail the request if email fails
    }

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
