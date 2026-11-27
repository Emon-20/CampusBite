const Order = require('../models/Order');
const discountService = require('../services/discountService');
const orderService = require('../services/orderService');
const { studentNotificationObserver } = require('../patterns/OrderObserver');

async function previewCartDiscount(req, res) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(200).json({
        subtotal: 0,
        discount: 0,
        total: 0,
        promotionName: 'None'
      });
    }

    const result = discountService.calculateBestDiscount(items);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to calculate discount' });
  }
}

async function createOrder(req, res) {
  try {
    const order = await orderService.placeOrder({
      userId: req.user.id,
      items: req.body.items
    });

    return res.status(201).json({
      message: 'Order placed successfully (Cash on Pickup)',
      order
    });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: error.message || 'Failed to place order' });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
}

async function getAllOrders(_req, res) {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch all orders' });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const ownerId = order.userId._id ? order.userId._id.toString() : order.userId.toString();
    if (req.user.role !== 'admin' && ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You cannot access another student’s order' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status, paymentStatus } = req.body;
    const order = await orderService.updateOrderStatus({
      orderId: req.params.id,
      status,
      paymentStatus
    });

    return res.status(200).json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: error.message || 'Failed to update order' });
  }
}

async function cancelMyOrder(req, res) {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only cancel your own orders' });
    }

    const order = await orderService.updateOrderStatus({
      orderId: req.params.id,
      status: 'Cancelled'
    });

    return res.status(200).json({
      message: 'Order cancelled and stock restored',
      order
    });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: error.message || 'Failed to cancel order' });
  }
}

async function getMyNotifications(req, res) {
  const notifications = studentNotificationObserver.getByUser(req.user.id);
  return res.status(200).json({ notifications });
}

module.exports = {
  previewCartDiscount,
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder,
  getMyNotifications
};
