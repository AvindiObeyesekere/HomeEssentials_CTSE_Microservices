# User Service - HomeEssentials Microservice

A Node.js/Express microservice for user management and authentication in the HomeEssentials e-commerce platform.

## Features

- ✅ User registration with validation
- ✅ User login with bcrypt password hashing
- ✅ JWT token generation (HS256)
- ✅ User profile management (CRUD)
- ✅ Password change functionality
- ✅ Role-based user types (Customer, Admin, StoreManager, Cashier, Delivery, Support)
- ✅ Centralized error handling
- ✅ Standard JSON response envelopes
- ✅ MongoDB integration with Mongoose
- ✅ Environment-based configuration
- ✅ Health check endpoint
- ✅ Request logging with Morgan
- ✅ CORS enabled

## Installation

1. **Navigate to the project:**
   ```bash
   cd user-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file from example:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` with your settings:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/homeessentials-user-service
   JWT_SECRET=your-super-secret-key-here
   JWT_EXPIRES_IN=1h
   NODE_ENV=development
   ```

## Running the Service

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will start on the configured PORT (default: 5000).

## Project Structure

```
src/
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── config/
│   ├── db.js                # MongoDB connection
│   └── env.js               # Environment configuration
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   └── user.controller.js   # User management logic
├── services/
│   ├── auth.service.js      # Auth business logic
│   └── jwt.service.js       # JWT token operations
├── models/
│   └── User.js              # User MongoDB schema
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   └── user.routes.js       # User endpoints
├── middleware/
│   └── errorHandler.js      # Centralized error handling
└── utils/
    ├── response.js          # Response envelope utilities
    └── validators.js        # Input validation utilities

docs/
└── api.md                    # Complete API documentation
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `PATCH /api/auth/:userId/password` - Change password

### User Management
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user profile

For complete API documentation, see [docs/api.md](./docs/api.md)
