# Inventory Service

Inventory & Stock Management Service for HomeEssentials+

## 📋 Overview

This service manages inventory and stock levels for all products in the HomeEssentials+ platform. It handles stock availability checks, reservations, and deductions.

## 🎯 Responsibilities

- Track product stock levels
- Reserve stock during order placement
- Release stock if order fails
- Deduct stock after successful payment
- Monitor low stock items
- Manage stock availability

## 🔌 API Endpoints

### Inventory Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/inventory` | Get all inventory items | Public |
| GET | `/api/inventory/:productId` | Get inventory for product | Public |
| POST | `/api/inventory` | Create inventory entry | Admin |
| PUT | `/api/inventory/:productId` | Update stock levels | Admin |
| GET | `/api/inventory/low-stock` | Get low stock items | Admin |

### Stock Operations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/inventory/check` | Check stock availability | Public |
| POST | `/api/inventory/reserve` | Reserve stock for order | Order Service |
| POST | `/api/inventory/release` | Release reserved stock | Order Service |
| POST | `/api/inventory/deduct` | Deduct stock after payment | Order Service |

## 🔗 Service Communication

### Outgoing (This service calls)
- **Product Service**: Validates product exists before creating inventory

### Incoming (Other services call this)
- **Order Service**: Checks availability, reserves, releases, and deducts stock

## 💾 Database Schema

### Inventory Model

```javascript
{
  productId: String,           // Product ID (unique)
  productName: String,         // Product name
  quantity: Number,            // Total quantity in stock
  reservedQuantity: Number,    // Quantity currently reserved
  availableQuantity: Number,   // quantity - reservedQuantity
  lowStockThreshold: Number,   // Threshold for low stock alerts
  reorderPoint: Number,        // When to reorder
  location: {
    warehouse: String,
    shelf: String
  },
  lastRestocked: Date,
  isActive: Boolean,
  stockStatus: String,         // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  isLowStock: Boolean
}
```

### Reservation Model

```javascript
{
  productId: String,
  orderId: String,
  quantity: Number,
  status: String,              // PENDING, CONFIRMED, RELEASED, EXPIRED
  expiresAt: Date,            // Auto-release after timeout
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Stock Management Flow

### 1. Order Placement Flow

```
Order Service → Check Stock → Reserve Stock → Wait for Payment
```

**API Call:**
```bash
POST /api/inventory/reserve
{
  "productId": "123",
  "orderId": "order-456",
  "quantity": 5
}
```

### 2. Payment Success Flow

```
Payment Success → Deduct Stock from Total → Confirm Reservation
```

**API Call:**
```bash
POST /api/inventory/deduct
{
  "orderId": "order-456"
}
```

### 3. Payment Failure Flow

```
Payment Failed → Release Reserved Stock → Cancel Reservation
```

**API Call:**
```bash
POST /api/inventory/release
{
  "orderId": "order-456"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
cd inventory-service
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Update MongoDB connection string
3. Configure service URLs

```env
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3004
LOW_STOCK_THRESHOLD=10
RESERVATION_TIMEOUT_MINUTES=15
```

### Running Locally

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run linter
npm run lint
```

### Using Docker

```bash
# Build image
docker build -t inventory-service .

# Run container
docker run -p 3003:3003 --env-file .env inventory-service
```

## 📚 API Documentation

Access Swagger documentation:
- **Development**: http://localhost:3003/api-docs
- **Production**: https://api.homeessentials.com/inventory/api-docs

## 🧪 Testing

### Manual Testing with cURL

```bash
# Check stock availability
curl -X POST http://localhost:3003/api/inventory/check \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "123",
    "quantity": 5
  }'

# Reserve stock
curl -X POST http://localhost:3003/api/inventory/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "123",
    "orderId": "order-456",
    "quantity": 5
  }'

# Get low stock items
curl http://localhost:3003/api/inventory/low-stock
```

## 🔐 Security Features

- Helmet.js for HTTP security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- MongoDB injection prevention
- Service-to-service authentication (recommended)

## 📊 Stock Status Logic

```javascript
// Stock Status Calculation
if (availableQuantity === 0) → OUT_OF_STOCK
else if (availableQuantity <= lowStockThreshold) → LOW_STOCK
else → IN_STOCK

// Available Quantity
availableQuantity = quantity - reservedQuantity
```

## ⏰ Reservation Timeout

Reservations automatically expire after 15 minutes (configurable) to prevent stock being locked indefinitely.

**Background Job (Recommended):**
```javascript
// Clean up expired reservations
setInterval(() => {
  releaseExpiredReservations();
}, 5 * 60 * 1000); // Every 5 minutes
```

## 🏗️ CI/CD Pipeline

GitHub Actions workflow:
1. Code checkout
2. Install dependencies
3. Run ESLint
4. Run tests
5. SonarCloud scan
6. Snyk security scan
7. Build Docker image
8. Push to Amazon ECR
9. Deploy to Amazon ECS Fargate

## ☁️ AWS Deployment

- **Service**: ECS Fargate
- **Container Registry**: Amazon ECR
- **Load Balancer**: Application Load Balancer
- **Logging**: CloudWatch Logs
- **Secrets**: AWS Secrets Manager

## 🤝 Integration with Other Services

### Order Service Integration

**Step 1: Check Availability**
```javascript
POST /api/inventory/check
{
  "productId": "123",
  "quantity": 5
}

Response:
{
  "success": true,
  "available": true,
  "availableQuantity": 50
}
```

**Step 2: Reserve Stock**
```javascript
POST /api/inventory/reserve
{
  "productId": "123",
  "orderId": "order-456",
  "quantity": 5
}
```

**Step 3: After Payment**
- **Success**: `POST /api/inventory/deduct`
- **Failure**: `POST /api/inventory/release`

## 📝 Developer Notes

### Adding New Features

1. **Auto-reorder**: Implement when stock < reorderPoint
2. **Batch operations**: Reserve multiple products at once
3. **Stock history**: Track all stock movements

### Performance Optimization

- Index on `productId`, `availableQuantity`
- Cache frequently accessed inventory
- Use MongoDB transactions for stock operations

## 🐛 Troubleshooting

### Common Issues

1. **Negative Stock**
   - Check reservation logic
   - Ensure atomic operations

2. **Reservations Not Expiring**
   - Implement background job
   - Check `expiresAt` field

3. **Race Conditions**
   - Use MongoDB transactions
   - Implement optimistic locking

## 📄 License

Part of HomeEssentials+ - SLIIT SE4010 Assignment

## 👤 Author

Student: B4S1NDU
