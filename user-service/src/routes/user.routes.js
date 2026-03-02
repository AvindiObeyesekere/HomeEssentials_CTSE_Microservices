const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

/**
 * GET /users
 * Get all users with pagination
 */
router.get('/', userController.getUsers);

/**
 * GET /users/:id
 * Get user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * PATCH /users/:id
 * Update user
 */
router.patch('/:id', userController.updateUser);

module.exports = router;
