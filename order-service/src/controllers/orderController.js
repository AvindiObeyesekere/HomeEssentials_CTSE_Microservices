const crypto = require('crypto');
const Order = require('../models/Order');
const {
  validateUser,
  validateProduct,
  checkStock,
  reserveStock,
  deductStock,
  releaseStock,
  processPayment
} = require('../services/externalClients');

const calculateTotalAmount = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

exports.createOrder = async (req, res, next) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      const error = new Error('userId and at least one item are required');
      error.statusCode = 400;
      throw error;
    }

    const authorization = req.headers.authorization;

    await validateUser(userId, authorization);

    const enrichedItems = [];
    const orderId = `ORD-${crypto.randomUUID()}`;

    console.log(`\n═════════════════════════════════════`);
    console.log(`[ORDER] Creating new order: ${orderId} for user ${userId}`);
    console.log(`[ORDER] Items to order: ${items.length}`);

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        const error = new Error('Each item must have productId and quantity');
        error.statusCode = 400;
        throw error;
      }

      console.log(`[ORDER] Processing item: ${item.productId} x${item.quantity}`);

      const product = await validateProduct(item.productId, authorization);

      const stockCheck = await checkStock(item.productId, item.quantity, authorization);
      if (!stockCheck.available) {
        const error = new Error(
          `Insufficient stock for product ${item.productId}, requested ${item.quantity}`
        );
        error.statusCode = 400;
        throw error;
      }

      console.log(`[ORDER] ✅ Stock available, reserving...`);
      await reserveStock(item.productId, orderId, item.quantity, authorization);

      enrichedItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const totalAmount = calculateTotalAmount(enrichedItems);

    console.log(`[ORDER] ✅ All items reserved. Total: LKR ${totalAmount}`);
    console.log(`[ORDER] Processing payment...`);

    const paymentResult = await processPayment({
      orderId,
      userId,
      amount: totalAmount
    });

    // Only mark as CONFIRMED if payment explicitly succeeds
    // Default to PENDING if no success status provided
    const paymentSuccess = paymentResult?.success === true;

    let status = paymentSuccess ? 'CONFIRMED' : (paymentResult?.success === false ? 'CANCELLED' : 'PENDING');

    console.log(`[ORDER] Payment result: ${paymentSuccess ? '✅ SUCCESS' : (paymentResult?.success === false ? '❌ FAILED' : '⏳ PENDING')}`);

    if (paymentSuccess) {
      console.log(`[ORDER] Deducting stock...`);
      await deductStock(orderId, authorization);
      console.log(`[ORDER] ✅ Stock deducted, order CONFIRMED`);
    } else if (paymentResult?.success === false) {
      console.log(`[ORDER] Releasing reserved stock...`);
      await releaseStock(orderId, authorization);
      console.log(`[ORDER] ✅ Stock released, order CANCELLED`);
    } else {
      console.log(`[ORDER] Payment pending - order set to PENDING status`);
    }

    const order = await Order.create({
      orderId,
      userId,
      items: enrichedItems,
      totalAmount,
      status,
      paymentId: paymentResult?.data?.paymentId || paymentResult?.paymentId
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderId: id });

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrdersByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const authorization = req.headers.authorization;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      const err = new Error('Invalid status value');
      err.statusCode = 400;
      throw err;
    }

    const order = await Order.findOne({ orderId: id });

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    const previousStatus = order.status;
    console.log(`[ORDER-UPDATE] Updating order ${id} from ${previousStatus} to ${status}`);

    // Handle inventory operations based on status transition
    if (previousStatus === 'PENDING' && status === 'CONFIRMED') {
      console.log(`[ORDER-UPDATE] Confirming order - deducting stock...`);
      try {
        await deductStock(id, authorization);
        console.log(`[ORDER-UPDATE] ✅ Stock deducted successfully`);
      } catch (error) {
        console.error(`[ORDER-UPDATE] ❌ Failed to deduct stock:`, error.message);
        throw error;
      }
    } else if ((previousStatus === 'PENDING' || previousStatus === 'CONFIRMED') && status === 'CANCELLED') {
      console.log(`[ORDER-UPDATE] Cancelling order - releasing reserved stock...`);
      try {
        await releaseStock(id, authorization);
        console.log(`[ORDER-UPDATE] ✅ Stock released successfully`);
      } catch (error) {
        console.error(`[ORDER-UPDATE] ❌ Failed to release stock:`, error.message);
        throw error;
      }
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      { status },
      { new: true }
    );

    console.log(`[ORDER-UPDATE] ✅ Order status updated to ${status}`);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Order.findOneAndDelete({ orderId: id });

    if (!deleted) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

