const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

/**
 * JWT token service
 */

const issueToken = (userId, role, email) => {
  const payload = {
    sub: userId.toString(),
    role,
    email,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  issueToken,
  verifyToken,
};
