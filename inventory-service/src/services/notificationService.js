const axios = require('axios');

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';

const ALLOWED_RECIPIENT_ROLES = ['StoreManager', 'Admin'];

const sendLowStockAlert = async ({ recipient, inventory }) => {
  if (!recipient?.sub || !recipient?.email || !recipient?.role) {
    return;
  }

  if (!ALLOWED_RECIPIENT_ROLES.includes(recipient.role)) {
    throw new Error('Low stock notifications can only be sent to StoreManager or Admin users');
  }

  const payload = {
    userId: recipient.sub,
    email: recipient.email,
    type: 'LOW_STOCK_ALERT',
    message: `${inventory.productName} has reached the low stock threshold (${inventory.lowStockThreshold})`,
    metadata: {
      productName: inventory.productName,
      currentStock: inventory.availableQuantity,
      threshold: inventory.lowStockThreshold,
      userName: recipient.email,
      recipientRole: recipient.role,
    },
  };

  await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send`, payload, {
    timeout: Number.parseInt(process.env.NOTIFICATION_TIMEOUT_MS || '3000', 10),
  });
};

module.exports = {
  sendLowStockAlert,
  ALLOWED_RECIPIENT_ROLES,
};
