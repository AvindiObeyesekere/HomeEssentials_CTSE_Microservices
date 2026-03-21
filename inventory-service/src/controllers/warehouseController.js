const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');

// Create a new warehouse
exports.createWarehouse = async (req, res, next) => {
  try {
    const { warehouse_id, warehouseName, user_id } = req.body;

    // Validation
    if (!warehouse_id || !warehouseName) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse ID and warehouse name are required'
      });
    }

    if (user_id !== undefined && user_id !== null && !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user_id format. Use a valid User _id'
      });
    }

    // Check if warehouse already exists
    const existingWarehouse = await Warehouse.findOne({ warehouse_id });
    if (existingWarehouse) {
      return res.status(409).json({
        success: false,
        message: 'Warehouse with this ID already exists'
      });
    }

    // Create new warehouse
    const warehouse = await Warehouse.create({
      warehouse_id,
      warehouseName,
      user_id: user_id || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    });

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse
    });
  } catch (error) {
    next(error);
  }
};

// Get all warehouses
exports.getAllWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find({ deletedAt: null });

    res.status(200).json({
      success: true,
      message: 'Warehouses retrieved successfully',
      data: warehouses
    });
  } catch (error) {
    next(error);
  }
};

// Get warehouse by ID
exports.getWarehouseById = async (req, res, next) => {
  try {
    const { warehouse_id } = req.params;

    const warehouse = await Warehouse.findOne({ warehouse_id, deletedAt: null });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse retrieved successfully',
      data: warehouse
    });
  } catch (error) {
    next(error);
  }
};

// Update warehouse
exports.updateWarehouse = async (req, res, next) => {
  try {
    const { warehouse_id } = req.params;
    const { warehouseName, user_id } = req.body;

    // Validation
    if (!warehouseName && user_id === undefined) {
      return res.status(400).json({
        success: false,
        message: 'warehouseName or user_id is required'
      });
    }

    if (user_id !== undefined && user_id !== null && !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user_id format. Use a valid User _id'
      });
    }

    const updates = {
      updatedAt: new Date()
    };

    if (warehouseName) {
      updates.warehouseName = warehouseName;
    }

    if (user_id !== undefined) {
      updates.user_id = user_id || null;
    }

    // Find and update warehouse
    const warehouse = await Warehouse.findOneAndUpdate(
      { warehouse_id, deletedAt: null },
      updates,
      { new: true, runValidators: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse updated successfully',
      data: warehouse
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete warehouse
exports.deleteWarehouse = async (req, res, next) => {
  try {
    const { warehouse_id } = req.params;

    // Soft delete: set deletedAt timestamp
    const warehouse = await Warehouse.findOneAndUpdate(
      { warehouse_id, deletedAt: null },
      {
        deletedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse deleted successfully',
      data: warehouse
    });
  } catch (error) {
    next(error);
  }
};

// Hard delete warehouse (permanent)
exports.hardDeleteWarehouse = async (req, res, next) => {
  try {
    const { warehouse_id } = req.params;

    const warehouse = await Warehouse.findOneAndDelete({ warehouse_id });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse permanently deleted',
      data: warehouse
    });
  } catch (error) {
    next(error);
  }
};
