/**
 * Input validation utilities
 */

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 8;
};

const isValidRole = (role) => {
  const validRoles = ['Customer', 'Admin', 'StoreManager', 'Cashier', 'Delivery', 'Support'];
  return validRoles.includes(role);
};

const validateRegisterInput = (firstName, lastName, email, password) => {
  const errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push('firstName is required');
  }

  if (!lastName || lastName.trim() === '') {
    errors.push('lastName is required');
  }

  if (!email || email.trim() === '') {
    errors.push('email is required');
  } else if (!isValidEmail(email)) {
    errors.push('email format is invalid');
  }

  if (!password || password === '') {
    errors.push('password is required');
  } else if (!isValidPassword(password)) {
    errors.push('password must be at least 8 characters long');
  }

  return errors;
};

const validateLoginInput = (email, password) => {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('email is required');
  }

  if (!password || password === '') {
    errors.push('password is required');
  }

  return errors;
};

const validateUpdateUserInput = (updateData) => {
  const allowedFields = ['firstName', 'lastName', 'address', 'role'];
  const errors = [];

  const invalidFields = Object.keys(updateData).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    errors.push(`Invalid fields: ${invalidFields.join(', ')}`);
  }

  if (updateData.role && !isValidRole(updateData.role)) {
    errors.push('Invalid role');
  }

  return errors;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidRole,
  validateRegisterInput,
  validateLoginInput,
  validateUpdateUserInput,
};
