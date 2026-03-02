const User = require('../models/User');
const { successResponse } = require('../utils/response');
const { validateUpdateUserInput, isValidRole } = require('../utils/validators');

/**
 * User controller
 */

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const safeUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ...(user.address && { address: user.address }),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(successResponse(safeUser));
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments();

    const safeUsers = users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ...(user.address && { address: user.address }),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(
      successResponse({
        users: safeUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input
    const validationErrors = validateUpdateUserInput(updateData);
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join('; '));
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const safeUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ...(user.address && { address: user.address }),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(
      successResponse(safeUser, 'User updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  getUsers,
  updateUser,
};
