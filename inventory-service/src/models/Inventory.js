const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    unique: true,
    index: true
  },
  warehouse_id: {
    type: String,
    required: [true, 'Warehouse ID is required'],
    ref: 'Warehouse',
    index: true
  },
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Reserved quantity cannot be negative']
  },
  availableQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Available quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: parseInt(process.env.LOW_STOCK_THRESHOLD) || 10
  },
  reorderPoint: {
    type: Number,
    default: 20
  },
  location: {
    warehouse: {
      type: String,
      default: 'Main Warehouse'
    },
    shelf: {
      type: String,
      default: 'A1'
    }
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.availableQuantity === 0) return 'OUT_OF_STOCK';
  if (this.availableQuantity <= this.lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
});

// Virtual for is low stock
inventorySchema.virtual('isLowStock').get(function() {
  return this.availableQuantity <= this.lowStockThreshold;
});

// Pre-save hook to calculate available quantity
inventorySchema.pre('save', function(next) {
  this.availableQuantity = this.quantity - this.reservedQuantity;
  next();
});

// Ensure virtuals are included in JSON
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

// Index for querying low stock items
inventorySchema.index({ availableQuantity: 1, lowStockThreshold: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
