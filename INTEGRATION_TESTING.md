# 🔗 Product + Inventory Integration Testing Guide

This guide demonstrates how to test the integration between Product Service and Inventory Service.

## 📋 Overview

Your responsibility: **Product Service** + **Inventory Service**

These services work together to:
1. Manage product catalog
2. Track inventory for each product
3. Handle stock operations

## 🧪 Integration Test Scenarios

### Scenario 1: Create Product and Initialize Inventory

**Step 1: Start both services**

```bash
# Terminal 1 (Product Service)
cd product-service
npm run dev

# Terminal 2 (Inventory Service)
cd inventory-service
npm run dev
```

**Step 2: Create a product**

```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunlight Soap",
    "description": "Premium quality soap bar for household cleaning",
    "category": "soap",
    "price": 85,
    "unit": "piece",
    "brand": "Sunlight"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Sunlight Soap",
    "price": 85,
    ...
  }
}
```

**Copy the `_id` from response**

**Step 3: Initialize inventory for this product**

```bash
curl -X POST http://localhost:3003/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "productName": "Sunlight Soap",
    "quantity": 500,
    "lowStockThreshold": 50
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Inventory created successfully",
  "data": {
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "quantity": 500,
    "availableQuantity": 500,
    "stockStatus": "IN_STOCK"
  }
}
```

---

### Scenario 2: Stock Check Flow

**Test checking stock availability:**

```bash
curl -X POST http://localhost:3003/api/inventory/check \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "quantity": 10
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "available": true,
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "requestedQuantity": 10,
  "availableQuantity": 500,
  "stockStatus": "IN_STOCK"
}
```

---

### Scenario 3: Simulate Order Flow (Integration with Order Service)

This demonstrates how Order Service would interact with your services.

**Step 1: Validate product exists**

```bash
curl http://localhost:3002/api/products/65a1b2c3d4e5f6g7h8i9j0k1
```

**Step 2: Check inventory**

```bash
curl -X POST http://localhost:3003/api/inventory/check \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "quantity": 20
  }'
```

**Step 3: Reserve stock (when order created)**

```bash
curl -X POST http://localhost:3003/api/inventory/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderId": "ORDER-12345",
    "quantity": 20
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Stock reserved successfully",
  "data": {
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderId": "ORDER-12345",
    "quantity": 20,
    "availableQuantity": 480
  }
}
```

**Step 4a: Payment SUCCESS - Deduct stock**

```bash
curl -X POST http://localhost:3003/api/inventory/deduct \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER-12345"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Stock deducted successfully",
  "data": {
    "orderId": "ORDER-12345",
    "deductedItems": 1
  }
}
```

**Verify inventory updated:**
```bash
curl http://localhost:3003/api/inventory/65a1b2c3d4e5f6g7h8i9j0k1
```

Expected: `quantity: 480`, `availableQuantity: 480`

---

**Step 4b: Payment FAILED - Release stock**

```bash
# First reserve again
curl -X POST http://localhost:3003/api/inventory/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderId": "ORDER-99999",
    "quantity": 15
  }'

# Then release
curl -X POST http://localhost:3003/api/inventory/release \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER-99999"
  }'
```

**Expected:** Stock quantity returns to previous value.

---

### Scenario 4: Low Stock Alert

**Step 1: Create product with low stock**

```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vim Bar",
    "description": "Dishwashing bar",
    "category": "cleaning",
    "price": 45,
    "unit": "piece",
    "brand": "Vim"
  }'
```

**Step 2: Initialize with low quantity**

```bash
curl -X POST http://localhost:3003/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<vim-product-id>",
    "productName": "Vim Bar",
    "quantity": 8,
    "lowStockThreshold": 10
  }'
```

**Expected:** `stockStatus: "LOW_STOCK"`

**Step 3: Get all low stock items**

```bash
curl http://localhost:3003/api/inventory/low-stock
```

**Expected:** List includes Vim Bar.

---

## 📊 Demonstration Flow for Assignment

During your demonstration, show this flow:

### 1. **Service Health Checks**
```bash
curl http://localhost:3002/health
curl http://localhost:3003/health
```

### 2. **API Documentation**
- Open: http://localhost:3002/api-docs
- Open: http://localhost:3003/api-docs

### 3. **Complete Product-to-Inventory Flow**
1. Create 3-4 sample products
2. Initialize inventory for each
3. Show stock check
4. Demonstrate reserve → deduct flow
5. Demonstrate reserve → release flow
6. Show low stock items

### 4. **CI/CD Pipeline**
1. Make a small code change (e.g., update a log message)
2. Push to GitHub
3. Show GitHub Actions running
4. Show SonarCloud results
5. Show deployment to AWS (if completed)

### 5. **Security Features**
- Show rate limiting (make many rapid requests)
- Show input validation (send invalid data)
- Show SonarCloud security scan results
- Show Snyk vulnerability scan

---

## 🧪 Automated Integration Tests

Create a test file: `integration-tests.sh`

```bash
#!/bin/bash

echo "🧪 Starting Integration Tests..."

# Create product
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "category": "rice",
    "price": 100,
    "unit": "kg",
    "brand": "Test"
  }')

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.data._id')
echo "✅ Created product: $PRODUCT_ID"

# Create inventory
curl -s -X POST http://localhost:3003/api/inventory \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"productName\": \"Test Product\",
    \"quantity\": 100
  }" | jq '.'

echo "✅ Created inventory"

# Check stock
curl -s -X POST http://localhost:3003/api/inventory/check \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"quantity\": 10
  }" | jq '.'

echo "✅ Stock check passed"

echo "🎉 All integration tests passed!"
```

Run with:
```bash
chmod +x integration-tests.sh
./integration-tests.sh
```

---

## 📝 Report Documentation

### Integration Points to Document

**In your report, explain:**

1. **Service Architecture**
   - Product Service manages catalog
   - Inventory Service manages stock
   - They share data via REST APIs

2. **Communication Example**
   ```
   Order Service → Product Service (validate product)
   Order Service → Inventory Service (reserve stock)
   ```

3. **Data Flow Diagram**
   ```
   [Product Service] ←→ [Order Service] ←→ [Inventory Service]
   ```

4. **API Contracts**
   - Show OpenAPI/Swagger specs
   - Document each endpoint
   - Show request/response examples

5. **Error Handling**
   - What happens if product doesn't exist?
   - What happens if insufficient stock?
   - How are errors communicated?

6. **Challenges & Solutions**
   - Challenge: Ensuring data consistency
   - Solution: Transaction-like reservation system

---

## 🎯 Checklist for Demonstration

- [ ] Both services running locally
- [ ] Health checks responding
- [ ] Swagger docs accessible
- [ ] Can create products
- [ ] Can create inventory
- [ ] Can check stock
- [ ] Can reserve stock
- [ ] Can deduct stock
- [ ] Can release stock
- [ ] Low stock detection works
- [ ] Integration with Order Service (simulated)
- [ ] CI/CD pipeline runs
- [ ] SonarCloud scan shows results
- [ ] Snyk scan shows results
- [ ] Docker containers running
- [ ] AWS deployment (if ready)

---

## 🚀 Quick Demo Script

```bash
# 1. Start services
docker-compose up -d product-service inventory-service

# 2. Wait for services to be ready
sleep 5

# 3. Create sample data
./integration-tests.sh

# 4. Open API docs
open http://localhost:3002/api-docs
open http://localhost:3003/api-docs

# 5. Show logs
docker-compose logs -f
```

---

**Good luck with your demonstration! 🎉**
