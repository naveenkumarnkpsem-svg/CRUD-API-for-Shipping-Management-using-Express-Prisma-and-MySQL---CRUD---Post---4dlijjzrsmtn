const express = require('express');
const { prisma } = require('../db/config');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new shipping record
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { userId, productId, count } = req.body;

    if (!userId || !productId || !count) {
      return res.status(400).json({ message: 'userId, productId, and count are required' });
    }

    const shipping = await prisma.shipping.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        count: parseInt(count)
      }
    });

    res.status(201).json(shipping);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shipping record', error: error.message });
  }
});

// Cancel a shipping record
router.put('/cancel', authMiddleware, async (req, res) => {
  try {
    const { shippingId } = req.body;

    if (!shippingId) {
      return res.status(400).json({ message: 'shippingId is required' });
    }

    const shipping = await prisma.shipping.update({
      where: { id: parseInt(shippingId) },
      data: { status: 'cancelled' }
    });

    res.status(200).json(shipping);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Shipping record not found' });
    }
    res.status(500).json({ message: 'Error cancelling shipping record', error: error.message });
  }
});

// Get all shipping records or filter by userId
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    let where = {};

    if (userId) {
      where.userId = parseInt(userId);
    }

    const shippings = await prisma.shipping.findMany({ where });
    res.status(200).json(shippings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipping records', error: error.message });
  }
});

module.exports = router;
