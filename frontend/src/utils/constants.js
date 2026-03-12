export const API_URLS = {
  USER_SERVICE: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3001',
  PRODUCT_SERVICE: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3002',
  INVENTORY_SERVICE: import.meta.env.VITE_INVENTORY_SERVICE_URL || 'http://localhost:3003',
  ORDER_SERVICE: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3004',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3005',
  NOTIFICATION_SERVICE: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
};

export const ROLES = {
  ADMIN: 'Admin',
  STORE_MANAGER: 'StoreManager',
  CUSTOMER: 'Customer',
  CASHIER: 'Cashier',
  DELIVERY: 'Delivery',
  SUPPORT: 'Support',
};

export const PRODUCT_CATEGORIES = [
  'rice',
  'soap',
  'detergent',
  'cooking-oil',
  'spices',
  'cleaning',
  'personal-care',
  'other',
];

export const PRODUCT_UNITS = ['kg', 'g', 'l', 'ml', 'piece', 'pack'];

export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
};

export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  RELEASED: 'RELEASED',
  EXPIRED: 'EXPIRED',
};
