const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.put('/:id/status', updateOrderStatus);

module.exports = router;

