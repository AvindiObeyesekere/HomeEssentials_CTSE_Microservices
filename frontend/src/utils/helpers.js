export const formatCurrency = (amount) => {
  return `LKR ${Number(amount).toFixed(2)}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
};

export const getStockStatusColor = (status) => {
  switch (status) {
    case 'IN_STOCK':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'LOW_STOCK':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'OUT_OF_STOCK':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'Admin':
      return 'text-purple-700 bg-purple-100';
    case 'StoreManager':
      return 'text-blue-700 bg-blue-100';
    case 'Customer':
      return 'text-green-700 bg-green-100';
    case 'Cashier':
      return 'text-orange-700 bg-orange-100';
    case 'Delivery':
      return 'text-cyan-700 bg-cyan-100';
    case 'Support':
      return 'text-pink-700 bg-pink-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export const extractErrorMessage = (error) => {
  // User service structured error
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  // Product / Inventory flat error
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  // Express-validator array
  if (error?.response?.data?.errors?.[0]?.msg) {
    return error.response.data.errors.map((e) => e.msg).join(', ');
  }
  return error?.message || 'An unexpected error occurred';
};
