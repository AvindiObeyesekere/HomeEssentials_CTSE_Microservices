const { successResponse } = require('../utils/response');
const authService = require('../services/auth.service');

/**
 * Authentication controller
 */

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, address } = req.body;

    const result = await authService.register(firstName, lastName, email, password, address);

    res.status(201).json(
      successResponse(
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json(
      successResponse(
        {
          accessToken: result.accessToken,
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      const error = new Error('oldPassword and newPassword are required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    const user = await authService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json(
      successResponse(user, 'Password changed successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  changePassword,
};
