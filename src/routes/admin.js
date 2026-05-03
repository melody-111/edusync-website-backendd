const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Enquiry = require('../models/Enquiry');
const { protect, adminOnly } = require('../middleware/auth');

const signAdminToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// @POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    const token = signAdminToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/admin/create — create admin (one-time setup or super-admin)
router.post('/create', async (req, res) => {
  try {
    const { name, email, password, superKey } = req.body;
    if (superKey !== 'EDUSYNC_ADMIN_2024') 
      return res.status(403).json({ success: false, message: 'Invalid super key' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ success: true, message: 'Admin created', admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/admin/dashboard — high-fidelity stats
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalOrders, 
      totalUsers, 
      totalProducts, 
      totalEnquiries, 
      recentOrders,
      statusStats,
      stockStats
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        { $group: { _id: "$inStock", count: { $sum: 1 } } }
      ])
    ]);

    const revenue = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Format status stats for easy consumption
    const formattedStatuses = {};
    statusStats.forEach(s => formattedStatuses[s._id] = s.count);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalStudents: totalUsers,
        totalProducts,
        newEnquiries: totalEnquiries,
        totalRevenue: revenue[0]?.total || 0,
        orderStatus: {
          pending: formattedStatuses['placed'] || 0,
          processing: formattedStatuses['processing'] || 0,
          shipped: formattedStatuses['shipped'] || 0,
          delivered: formattedStatuses['delivered'] || 0,
          installed: formattedStatuses['installed'] || 0,
        },
        inventory: {
          inStock: stockStats.find(s => s._id === true)?.count || 0,
          outOfStock: stockStats.find(s => s._id === false)?.count || 0
        }
      },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/admin/invoices — view all invoices (ADMIN ONLY)
router.get('/invoices', protect, adminOnly, async (req, res) => {
  try {
    const invoices = await require('../models/Invoice').find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('order', 'orderNumber status');
      
    res.json({ success: true, count: invoices.length, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
