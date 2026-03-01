# Product Service

Product Catalog Management Service for HomeEssentials+

## 📋 Overview

This service manages the product catalog for household essentials including rice, soap, detergent, cooking oil, and other household items.

## 🎯 Responsibilities

- Product CRUD operations
- Product categorization
- Product search and filtering
- Product information retrieval for Order Service

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products (paginated) | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create new product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/products/category/:category` | Get products by category | Public |
| GET | `/api/products/categories/list` | Get all categories | Public |

### Categories

- `rice` - Rice products
- `soap` - Soap products
- `detergent` - Detergent products
- `cooking-oil` - Cooking oil
- `spices` - Spices
- `cleaning` - Cleaning supplies
- `personal-care` - Personal care items
- `other` - Other household items

## 🔗 Service Communication

### Outgoing (This service calls)
- None directly

### Incoming (Other services call this)
- **Order Service**: Validates products and retrieves product details when placing orders

## 💾 Database Schema

```javascript
{
  name: String,           // Product name
  description: String,    // Product description
  category: String,       // Product category
  price: Number,          // Product price
  unit: String,          // Unit (kg, g, l, ml, piece, pack)
  imageUrl: String,      // Product image URL
  brand: String,         // Product brand
  isActive: Boolean,     // Active status
  createdBy: String,     // Creator
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
cd product-service
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Update MongoDB connection string
3. Configure other environment variables

```env
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/products_db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3004
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
docker build -t product-service .

# Run container
docker run -p 3002:3002 --env-file .env product-service
```

## 📚 API Documentation

Access Swagger documentation:
- **Development**: http://localhost:3002/api-docs
- **Production**: https://api.homeessentials.com/products/api-docs

## 🧪 Testing

### Manual Testing with cURL

```bash
# Get all products
curl http://localhost:3002/api/products

# Get product by ID
curl http://localhost:3002/api/products/<product-id>

# Create product (Admin)
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basmati Rice",
    "description": "Premium quality basmati rice",
    "category": "rice",
    "price": 450,
    "unit": "kg",
    "brand": "Araliya"
  }'
```

### Using Postman

Import the Postman collection from `postman-collection.json`

## 🔐 Security Features

- Helmet.js for HTTP security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- MongoDB injection prevention
- XSS protection

## 📊 Monitoring & Logging

- Health check: `/health`
- Readiness check: `/readiness`
- Morgan logging (development/production)
- CloudWatch logs (Production on AWS)

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

When Order Service places an order:

```javascript
// Order Service calls Product Service
GET /api/products/:productId

// Response includes:
{
  success: true,
  data: {
    _id: "...",
    name: "Product Name",
    price: 450,
    category: "rice",
    // ... other details
  }
}
```

## 📝 Developer Notes

### Adding New Categories

Update the category enum in:
- `src/models/Product.js`
- `src/controllers/productController.js`
- `swagger.yaml`

### Data Validation

All inputs are validated using express-validator. See `src/routes/productRoutes.js` for validation rules.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB URI in `.env`
   - Verify network access in MongoDB Atlas

2. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing process: `lsof -ti:3002 | xargs kill`

3. **Docker Build Fails**
   - Clear Docker cache: `docker system prune -a`
   - Check Dockerfile syntax

## 📄 License

Part of HomeEssentials+ - SLIIT SE4010 Assignment

## 👤 Author

Student: B4S1NDU
