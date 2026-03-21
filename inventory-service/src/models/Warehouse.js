const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  warehouse_id: {
    type: String,
    required: [true, 'Warehouse ID is required'],
    unique: true,
    index: true
  },
  warehouseName: {
    type: String,
    required: [true, 'Warehouse name is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Pre-save hook to update updatedAt
warehouseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for soft delete queries
warehouseSchema.index({ deletedAt: 1 });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
