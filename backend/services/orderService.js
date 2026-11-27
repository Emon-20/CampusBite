const Food = require('../models/Food');
const Order = require('../models/Order');
const discountService = require('./discountService');
const { orderSubject } = require('../patterns/OrderObserver');

const VALID_STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
const VALID_PAYMENT_STATUSES = ['Pending', 'Paid'];

function createHttpError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Validates requested items against current food availability and stock.
 * Returns verified food docs and snapshot items without mutating stock.
 */
async function validateAndPrepareOrderItems(items, foodRepo = Food) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError('Cart cannot be empty', 400);
  }

  const verifiedFoods = [];
  const snapshotItems = [];

  for (const reqItem of items) {
    const qty = Number(reqItem.quantity);
    if (!reqItem.foodId || !Number.isInteger(qty) || qty < 1) {
      throw createHttpError('Each order item must have a valid foodId and positive integer quantity', 400);
    }

    const food = await foodRepo.findById(reqItem.foodId);
    if (!food) {
      throw createHttpError(`Food item not found: ${reqItem.foodId}`, 404);
    }

    if (!food.isAvailable || food.stock <= 0) {
      throw createHttpError(`${food.name} is currently unavailable`, 400);
    }

    if (food.stock < qty) {
      throw createHttpError(
        `Insufficient stock for ${food.name}. Available: ${food.stock}, Requested: ${qty}`,
        400
      );
    }

    verifiedFoods.push({ food, qty });
    snapshotItems.push({
      foodId: food._id,
      name: food.name,
      price: food.price,
      quantity: qty
    });
  }

  return { verifiedFoods, snapshotItems };
}

/**
 * Places a Cash on Pickup order:
 * 1. Validates stock and availability.
 * 2. Recalculates subtotal, discount, and total on the backend.
 * 3. Creates the order.
 * 4. Deducts stock only after successful order creation.
 */
async function placeOrder(
  { userId, items },
  { foodRepo = Food, orderRepo = Order, discountSvc = discountService } = {}
) {
  const { verifiedFoods, snapshotItems } = await validateAndPrepareOrderItems(items, foodRepo);
  const pricing = discountSvc.calculateBestDiscount(snapshotItems);

  const createdOrder = await orderRepo.create({
    userId,
    items: snapshotItems,
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    total: pricing.total,
    promotionName: pricing.promotionName,
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Pending',
    status: 'Pending'
  });

  // Deduct stock only after order creation succeeds
  for (const { food, qty } of verifiedFoods) {
    const updatedStock = Math.max(0, food.stock - qty);
    food.stock = updatedStock;
    if (updatedStock === 0) {
      food.isAvailable = false;
    }
    await food.save();
  }

  return createdOrder;
}

/**
 * Updates an order's status and/or paymentStatus.
 * Restores stock when an eligible Pending order is Cancelled.
 * Notifies observers on status change.
 */
async function updateOrderStatus(
  { orderId, status, paymentStatus },
  { orderRepo = Order, foodRepo = Food, subject = orderSubject } = {}
) {
  const order = await orderRepo.findById(orderId);
  if (!order) {
    throw createHttpError('Order not found', 404);
  }

  const previousStatus = order.status;

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      throw createHttpError(`Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`, 400);
    }

    if (status === 'Cancelled' && previousStatus !== 'Pending') {
      throw createHttpError(
        `Only Pending orders can be cancelled (current status: ${previousStatus})`,
        400
      );
    }

    if (previousStatus === 'Cancelled' && status !== 'Cancelled') {
      throw createHttpError('Cancelled orders cannot be reopened', 400);
    }

    order.status = status;
  }

  if (paymentStatus !== undefined) {
    if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      throw createHttpError(
        `Invalid payment status. Allowed: ${VALID_PAYMENT_STATUSES.join(', ')}`,
        400
      );
    }
    order.paymentStatus = paymentStatus;
  }

  const savedOrder = await order.save();

  // Restore stock if an eligible Pending order was cancelled
  if (status === 'Cancelled' && previousStatus === 'Pending') {
    for (const item of order.items) {
      const food = await foodRepo.findById(item.foodId);
      if (food) {
        food.stock += item.quantity;
        if (food.stock > 0) {
          food.isAvailable = true;
        }
        await food.save();
      }
    }
  }

  // Notify observers when status actually changes
  if (status !== undefined && status !== previousStatus && subject) {
    subject.notify({
      orderId: savedOrder._id,
      orderCode: savedOrder.orderCode,
      userId: savedOrder.userId,
      previousStatus,
      newStatus: savedOrder.status,
      updatedAt: new Date().toISOString()
    });
  }

  return savedOrder;
}

module.exports = {
  VALID_STATUSES,
  VALID_PAYMENT_STATUSES,
  validateAndPrepareOrderItems,
  placeOrder,
  updateOrderStatus
};
