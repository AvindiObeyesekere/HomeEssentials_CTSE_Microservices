# User Service - Setup & Implementation Guide

## ✅ Project Complete

A fully functional User Service microservice has been built with the following components:

---

## 📦 Files Created/Updated

### Core Application Files
- ✅ `src/app.js` - Express app with routes and middleware setup
- ✅ `src/server.js` - Server entry point with MongoDB connection

### Configuration
- ✅ `src/config/env.js` - Environment variables configuration
- ✅ `src/config/db.js` - MongoDB connection
- ✅ `.env.example` - Environment variables template
- ✅ `.env` - Development environment configuration

### Models
- ✅ `src/models/User.js` - Mongoose User schema with all required fields

### Services (Business Logic)
- ✅ `src/services/auth.service.js` - Registration, login, password change logic
- ✅ `src/services/jwt.service.js` - JWT token generation and verification

### Controllers (Request Handlers)
- ✅ `src/controllers/auth.controller.js` - Authentication endpoints
- ✅ `src/controllers/user.controller.js` - User management endpoints

### Routes (API Endpoints)
- ✅ `src/routes/auth.routes.js` - Auth endpoints (register, login, change password)
- ✅ `src/routes/user.routes.js` - User endpoints (CRUD operations)

### Utilities & Middleware
- ✅ `src/utils/response.js` - Standard response envelope utilities
- ✅ `src/utils/validators.js` - Input validation functions
- ✅ `src/middleware/errorHandler.js` - Centralized error handling

### Documentation
- ✅ `docs/api.md` - Complete API documentation with examples
- ✅ `README.md` - Project overview and quick start guide
- ✅ `package.json` - Dependencies updated

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v14+ installed
- MongoDB running locally or a remote MongoDB URI

### 2. Install Dependencies
```bash
cd user-service
npm install
```

### 3. Configure Environment
The `.env` file is already set up with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/homeessentials-user-service
JWT_SECRET=test-secret-key-for-development-only
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` in production!

### 4. Start the Service
Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The service will start on `http://localhost:5000`

---

## 📋 API Endpoints Summary

### Health Check
```
GET /health
```
Returns service health status

### Authentication
```
POST /api/auth/register         - Register new user
POST /api/auth/login            - User login (get JWT token)
PATCH /api/auth/:userId/password - Change password
```

### User Management
```
GET /api/users                  - Get all users (with pagination)
GET /api/users/:id              - Get user by ID
PATCH /api/users/:id            - Update user profile
```

---

## 🔐 Features Implemented

### ✅ Authentication
- User registration with input validation
- Email uniqueness check
- Bcrypt password hashing (10 salt rounds)
- JWT token generation (HS256)
- Password change functionality

### ✅ User Management
- Create users with roles (Customer, Admin, StoreManager, Cashier, Delivery, Support)
- Retrieve users with pagination
- Update user information (firstName, lastName, address, role)
- Prevent email and password updates through user endpoint

### ✅ Security
- Passwords never exposed in responses
- Input validation on all endpoints
- Centralized error handling
- JWT token management
- CORS enabled for microservice communication

### ✅ Database
- MongoDB integration with Mongoose
- Automatic timestamps (createdAt, updatedAt)
- Email uniqueness constraint
- Role enumeration
- Optional address object with default country

### ✅ API Standards
- Consistent JSON response envelopes
- Standard HTTP status codes (201, 400, 401, 404, 409, 500)
- Descriptive error codes and messages
- Request logging with Morgan

---

## 📊 User Model Schema

```javascript
{
  firstName: String (required, trimmed),
  lastName: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  passwordHash: String (required, bcrypt hashed),
  role: String (enum: Customer*, Admin, StoreManager, Cashier, Delivery, Support),
  address: {
    line1: String,
    line2: String,
    city: String,
    district: String,
    postalCode: String,
    country: String (default: "Sri Lanka")
  },
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

---

## 🧪 Testing the API

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "address": {
      "city": "Colombo",
      "district": "Western Province",
      "country": "Sri Lanka"
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "Customer",
      "address": {...},
      "createdAt": "...",
      "updatedAt": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### Login a User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get User by ID
```bash
curl http://localhost:5000/api/users/{userId}
```

### Get All Users
```bash
curl http://localhost:5000/api/users?page=1&limit=10
```

### Update User
```bash
curl -X PATCH http://localhost:5000/api/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

## 🔑 JWT Token Details

### Token Structure
Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload:
```json
{
  "sub": "userId",
  "role": "Customer",
  "email": "john@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Token Usage
- Token is returned in `accessToken` field on register/login
- Token expires based on `JWT_EXPIRES_IN` env variable (default: 1h)
- Use token in Authorization header for protected endpoints (if api gateway is used)

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/homeessentials-user-service |
| JWT_SECRET | Secret key for signing JWT | test-secret-key-for-development-only |
| JWT_EXPIRES_IN | Token expiration time | 1h |
| NODE_ENV | Environment (development/production) | development |

---

## ❌ What NOT Included (As Per Requirements)

- ❌ No API Gateway logic
- ❌ No gateway headers
- ❌ No JWT verification middleware
- ❌ No gateway assumptions
- ❌ This service focuses on user management only

---

## 📚 Documentation

For complete API documentation with all endpoints, request/response examples, and error codes, see:
- **[docs/api.md](../docs/api.md)** - Complete API reference
- **[README.md](../README.md)** - Project overview

---

## 🔧 Project Structure

```
user-service/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── env.js               # Environment config
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth handlers
│   │   └── user.controller.js   # User handlers
│   ├── services/
│   │   ├── auth.service.js      # Auth business logic
│   │   └── jwt.service.js       # JWT operations
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   └── user.routes.js       # User endpoints
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling
│   └── utils/
│       ├── response.js          # Response envelopes
│       └── validators.js        # Input validation
├── docs/
│   └── api.md                    # API documentation
├── .env                          # Development config
├── .env.example                  # Config template
├── package.json                  # Dependencies
└── README.md                     # Project readme
```

---

## ✅ Validation Rules

### Password
- Minimum 8 characters
- Required for registration and login

### Email
- Valid email format required
- Unique per user
- Case-insensitive
- Automatically trimmed and lowercased

### Name Fields
- Required (firstName, lastName)
- Automatically trimmed

### Role
- Must be one of: Customer, Admin, StoreManager, Cashier, Delivery, Support
- Default: Customer

### Address
- Optional
- All fields optional if address is provided
- Default country: "Sri Lanka"

---

## 🐛 Error Handling

All errors follow standard error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional info */ }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400) - Invalid input
- `INVALID_CREDENTIALS` (401) - Wrong email/password
- `USER_NOT_FOUND` (404) - User doesn't exist
- `EMAIL_ALREADY_EXISTS` (409) - Email already registered
- `INVALID_TOKEN` (401) - Invalid JWT
- `TOKEN_EXPIRED` (401) - Token expired
- `INTERNAL_SERVER_ERROR` (500) - Server error

---

## 📝 Notes

1. **Password Security**: Passwords are hashed with bcrypt (10 salt rounds) and never exposed
2. **Safe User Object**: API returns user data without `passwordHash`
3. **Timestamps**: All timestamps in ISO 8601 format
4. **Pagination**: Default limit is 10, customizable via query parameters
5. **CORS**: Enabled for microservice communication
6. **Logging**: HTTP requests logged with Morgan in 'dev' format
7. **No Auth Middleware**: Service doesn't include JWT verification middleware (to be done by API Gateway)

---

## 🎯 Next Steps

1. ✅ Dependencies installed
2. ✅ Environment configured (.env file ready)
3. ✅ Run the service: `npm run dev`
4. ✅ Test endpoints using curl or Postman
5. ✅ Integrate with other microservices via API Gateway
6. ✅ Change `JWT_SECRET` in production

---

## 📞 Support

For API documentation details, see [docs/api.md](../docs/api.md)
For more info, see [README.md](../README.md)

**The User Service is ready to deploy and integrate with your HomeEssentials platform!** 🚀
