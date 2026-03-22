const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

// Create warehouse
router.post('/add', warehouseController.createWarehouse);

// Get all warehouses
router.get('/', warehouseController.getAllWarehouses);

// Get warehouse by ID
router.get('/:warehouse_id', warehouseController.getWarehouseById);

// Update warehouse
router.put('/:warehouse_id', warehouseController.updateWarehouse);

// Soft delete warehouse
router.delete('/:warehouse_id', warehouseController.deleteWarehouse);

// Hard delete warehouse (permanent)
router.delete('/:warehouse_id/permanent', warehouseController.hardDeleteWarehouse);

module.exports = router;
