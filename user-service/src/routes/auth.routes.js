const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * User login
 */
router.post('/login', authController.login);

/**
 * PATCH /auth/:userId/password
 * Change user password
 */
router.patch('/:userId/password', authController.changePassword);

module.exports = router;
