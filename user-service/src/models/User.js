const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Customer', 'Admin', 'StoreManager', 'Cashier', 'Delivery', 'Support'],
      default: 'Customer',
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      district: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Sri Lanka',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
