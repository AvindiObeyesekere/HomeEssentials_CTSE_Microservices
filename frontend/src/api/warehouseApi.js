import { inventoryClient } from './axiosConfig';

export const warehouseApi = {
  getAll: (params = {}) => inventoryClient.get('/api/warehouse', { params }),
  getById: (warehouseId) => inventoryClient.get(`/api/warehouse/${warehouseId}`),
  create: (data) => inventoryClient.post('/api/warehouse/add', data),
  update: (warehouseId, data) => inventoryClient.put(`/api/warehouse/${warehouseId}`, data),
  delete: (warehouseId) => inventoryClient.delete(`/api/warehouse/${warehouseId}`),
};
