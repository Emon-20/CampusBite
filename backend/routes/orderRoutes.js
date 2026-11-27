const express = require('express');
const {
  previewCartDiscount,
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder,
  getMyNotifications
} = require('../controllers/orderController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/preview', protect, previewCartDiscount);
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/notifications', protect, getMyNotifications);
router.get('/', protect, requireAdmin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);
router.patch('/:id/cancel', protect, cancelMyOrder);

module.exports = router;
