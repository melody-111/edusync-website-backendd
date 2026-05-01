const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/cart — add item
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.cart.find(i => i.product.toString() === productId && i.variant === variant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, variant });
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/cart/:itemId — update quantity
router.put('/:itemId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    item.quantity = req.body.quantity;
    if (item.quantity <= 0) user.cart.pull(req.params.itemId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/cart/:itemId — remove item
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart.pull(req.params.itemId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/cart — clear cart
router.delete('/', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, cart: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
