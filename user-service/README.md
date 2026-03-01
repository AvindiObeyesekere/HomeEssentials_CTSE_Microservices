# User Service

User Authentication & Management Service for HomeEssentials+

## 📋 Overview

**Assigned to:** Student 1

This service manages user registration, authentication, and user profile management.

## 🎯 Responsibilities

- User registration
- User login with JWT token generation
- Password hashing (bcrypt)
- User profile management
- User role management (Customer/Admin)

## 🔌 API Endpoints (To Implement)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user profile |

## 💾 Database Schema (Suggested)

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  role: String (Customer/Admin),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 Service Communication

- **Order Service**: Validates user before creating orders

## 🚀 Tech Stack (Recommended)

- Node.js + Express
- MongoDB
- JWT for authentication
- bcrypt for password hashing

## 📝 Implementation Guide

1. Copy structure from Product Service
2. Modify for user management
3. Implement JWT authentication middleware
4. Add password hashing
5. Create Dockerfile
6. Setup CI/CD workflow

## Port

**Development:** 3001

---

See Product Service or Inventory Service for implementation reference.
