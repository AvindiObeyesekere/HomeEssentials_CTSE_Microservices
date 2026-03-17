const axios = require('axios');

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_BASE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_BASE_URL || 'http://localhost:3002';
const INVENTORY_SERVICE_BASE_URL = process.env.INVENTORY_SERVICE_BASE_URL || 'http://localhost:3003';
const PAYMENT_SERVICE_BASE_URL = process.env.PAYMENT_SERVICE_BASE_URL || 'http://localhost:3005';

const httpClient = axios.create({
  timeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT_MS, 10) || 5000
});

async function validateUser(userId) {
  const response = await httpClient.get(`${USER_SERVICE_BASE_URL}/api/users/${userId}`);
  return response.data?.data || response.data;
}

async function validateProduct(productId) {
  const response = await httpClient.get(`${PRODUCT_SERVICE_BASE_URL}/api/products/${productId}`);
  return response.data?.data || response.data;
}

async function checkStock(productId, quantity) {
  const response = await httpClient.post(`${INVENTORY_SERVICE_BASE_URL}/api/inventory/check`, {
    productId,
    quantity
  });
  return response.data;
}

async function reserveStock(productId, orderId, quantity) {
  const response = await httpClient.post(`${INVENTORY_SERVICE_BASE_URL}/api/inventory/reserve`, {
    productId,
    orderId,
    quantity
  });
  return response.data;
}

async function deductStock(orderId) {
  const response = await httpClient.post(`${INVENTORY_SERVICE_BASE_URL}/api/inventory/deduct`, {
    orderId
  });
  return response.data;
}

async function releaseStock(orderId) {
  const response = await httpClient.post(`${INVENTORY_SERVICE_BASE_URL}/api/inventory/release`, {
    orderId
  });
  return response.data;
}

async function processPayment({ orderId, userId, amount }) {
  const response = await httpClient.post(`${PAYMENT_SERVICE_BASE_URL}/api/payments`, {
    orderId,
    userId,
    amount
  });
  return response.data;
}

module.exports = {
  validateUser,
  validateProduct,
  checkStock,
  reserveStock,
  deductStock,
  releaseStock,
  processPayment
};

