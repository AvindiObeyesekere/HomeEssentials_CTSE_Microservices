# User Service API Documentation

## Overview
User Service is a microservice for managing user registration, authentication, and user profile management in the HomeEssentials e-commerce platform. It provides JWT-based token issuing for authenticated sessions.

**Service URL:** `http://localhost:5000`

---

## Health Check

### GET /health
Returns the health status of the service.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "user-service",
    "timestamp": "2026-03-02T10:30:45.123Z"
  }
}
```

**Status Code:** 200 OK

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "address": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "Colombo",
    "district": "Western Province",
    "postalCode": "00100",
    "country": "Sri Lanka"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "Customer",
      "address": {
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "Colombo",
        "district": "Western Province",
        "postalCode": "00100",
        "country": "Sri Lanka"
      },
      "createdAt": "2026-03-02T10:30:45.123Z",
      "updatedAt": "2026-03-02T10:30:45.123Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email format is invalid; password must be at least 8 characters long"
  }
}
```

---

### POST /api/auth/login
Authenticate user and receive JWT access token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "Customer",
      "address": {
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "Colombo",
        "district": "Western Province",
        "postalCode": "00100",
        "country": "Sri Lanka"
      },
      "createdAt": "2026-03-02T10:30:45.123Z",
      "updatedAt": "2026-03-02T10:30:45.123Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

### PATCH /api/auth/{userId}/password
Change user password.

**Request Body:**
```json
{
  "oldPassword": "SecurePassword123",
  "newPassword": "NewSecurePassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "Customer",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "Colombo",
      "district": "Western Province",
      "postalCode": "00100",
      "country": "Sri Lanka"
    },
    "createdAt": "2026-03-02T10:30:45.123Z",
    "updatedAt": "2026-03-02T10:30:45.123Z"
  },
  "message": "Password changed successfully"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Old password is incorrect"
  }
}
```

---

## User Endpoints

### GET /api/users
Get all users with pagination.

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Number of users per page

**Example:** `GET /api/users?page=1&limit=20`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "Customer",
        "address": {
          "line1": "123 Main St",
          "line2": "Apt 4B",
          "city": "Colombo",
          "district": "Western Province",
          "postalCode": "00100",
          "country": "Sri Lanka"
        },
        "createdAt": "2026-03-02T10:30:45.123Z",
        "updatedAt": "2026-03-02T10:30:45.123Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

### GET /api/users/{userId}
Get a specific user by ID.

**Path Parameters:**
- `userId`: MongoDB ObjectId of the user

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "Customer",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "Colombo",
      "district": "Western Province",
      "postalCode": "00100",
      "country": "Sri Lanka"
    },
    "createdAt": "2026-03-02T10:30:45.123Z",
    "updatedAt": "2026-03-02T10:30:45.123Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

---

### PATCH /api/users/{userId}
Update user profile information.

**Allowed Fields:**
- `firstName`
- `lastName`
- `address`
- `role` (must be one of: Customer, Admin, StoreManager, Cashier, Delivery, Support)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "Customer",
  "address": {
    "line1": "456 Oak Ave",
    "city": "Galle",
    "district": "Southern Province",
    "postalCode": "90000",
    "country": "Sri Lanka"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "john.doe@example.com",
    "role": "Customer",
    "address": {
      "line1": "456 Oak Ave",
      "city": "Galle",
      "district": "Southern Province",
      "postalCode": "90000",
      "country": "Sri Lanka"
    },
    "createdAt": "2026-03-02T10:30:45.123Z",
    "updatedAt": "2026-03-02T10:35:20.456Z"
  },
  "message": "User updated successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid role"
  }
}
```

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { /* optional details */ }
  }
}
```

---

## JWT Token Format

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "65a1b2c3d4e5f6g7h8i9j0k1",
  "role": "Customer",
  "email": "john.doe@example.com",
  "iat": 1709382645,
  "exp": 1709386245
}
```

---

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid credentials or authentication failed |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., email) |
| 500 | Internal Server Error | Server error |

---

## User Roles

The system supports the following user roles:
- **Customer**: Default role for regular users making purchases
- **Admin**: Administrator with full access
- **StoreManager**: Store management role
- **Cashier**: Cashier role for transactions
- **Delivery**: Delivery personnel role
- **Support**: Customer support role

---

## Password Requirements

- Minimum 8 characters
- Can contain letters, numbers, and special characters
- Must be provided during registration and login

---

## Email Validation

Email must be in valid format: `[username]@[domain].[extension]`

---

## Default Address Country

If address is provided without a country, it defaults to "Sri Lanka".

---

## Implementation Notes

1. **Password Storage**: Passwords are hashed using bcrypt with salt rounds of 10. Never exposed in API responses.
2. **Token Expiry**: Access tokens expire based on `JWT_EXPIRES_IN` environment variable (default: 1 hour).
3. **Email Uniqueness**: Email is case-insensitive and unique per user.
4. **Timestamps**: All timestamps are in ISO 8601 format.
5. **Pagination**: Default page size is 10, adjustable via `limit` query parameter.
