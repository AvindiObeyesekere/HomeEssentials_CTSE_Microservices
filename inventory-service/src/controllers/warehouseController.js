const Warehouse = require('../models/Warehouse');

// Create a new warehouse
exports.createWarehouse = async (req, res, next) => {
  try {
    const { warehouse_id, warehouseName } = req.body;

    // Validation
    if (!warehouse_id || !warehouseName) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse ID and warehouse name are required'
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
    const { warehouseName } = req.body;

    // Validation
    if (!warehouseName) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse name is required'
      });
    }

    // Find and update warehouse
    const warehouse = await Warehouse.findOneAndUpdate(
      { warehouse_id, deletedAt: null },
      {
        warehouseName,
        updatedAt: new Date()
      },
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
