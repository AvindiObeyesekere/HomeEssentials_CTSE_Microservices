# 🚀 HomeEssentials+ Setup Guide

Complete setup guide for local development and AWS deployment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Local Development Setup](#local-development-setup)
4. [AWS Setup](#aws-setup)
5. [CI/CD Configuration](#cicd-configuration)
6. [Testing](#testing)

---

## 1. Prerequisites

### Required Software

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org)
- **Docker Desktop**: Download from [docker.com](https://www.docker.com/products/docker-desktop/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **VS Code** (Recommended): Download from [code.visualstudio.com](https://code.visualstudio.com/)

### Required Accounts

- **GitHub Account**: [github.com](https://github.com)
- **MongoDB Atlas**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
- **AWS Account**: [aws.amazon.com/free](https://aws.amazon.com/free/)
- **SonarCloud**: [sonarcloud.io](https://sonarcloud.io/) (Free for open source)
- **Snyk**: [snyk.io](https://snyk.io/) (Free tier available)

---

## 2. MongoDB Atlas Setup

### Step 1: Create Free Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up/Login
3. Click "Create" → "Deploy a cloud database"
4. Select **FREE** tier (M0 Sandbox)
5. Choose **AWS** as cloud provider
6. Select region closest to you
7. Name your cluster: `homeessentials-cluster`
8. Click "Create Cluster"

### Step 2: Create Databases

Create 6 separate databases:
- `users_db` (User Service)
- `products_db` (Product Service)
- `inventory_db` (Inventory Service)
- `orders_db` (Order Service)
- `payments_db` (Payment Service)
- `notifications_db` (Notification Service)

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `homeessentials`
4. Password: Generate strong password (save it!)
5. Role: "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" → "Connect"
2. Select "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
   ```
   mongodb+srv://homeessentials:<password>@homeessentials-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before query params:
   ```
   mongodb+srv://homeessentials:password@cluster.mongodb.net/products_db?retryWrites=true&w=majority
   ```

---

## 3. Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/B4S1NDU/HomeEssentials_CTSE_Microservices.git
cd HomeEssentials_CTSE_Microservices
```

### Step 2: Setup Product Service

```bash
cd product-service

# Copy environment template
cp .env.example .env

# Edit .env file with your MongoDB URI
# Update: MONGODB_URI=mongodb+srv://...

# Install dependencies
npm install

# Run in development mode
npm run dev
```

Service should start on http://localhost:3002

### Step 3: Setup Inventory Service

```bash
cd ../inventory-service

# Copy environment template
cp .env.example .env

# Edit .env file
# Update MongoDB URI and service URLs

# Install dependencies
npm install

# Run in development mode
npm run dev
```

Service should start on http://localhost:3003

### Step 4: Test Services

**Product Service:**
```bash
# Health check
curl http://localhost:3002/health

# API Documentation
open http://localhost:3002/api-docs
```

**Inventory Service:**
```bash
# Health check
curl http://localhost:3003/health

# API Documentation
open http://localhost:3003/api-docs
```

### Step 5: Run with Docker Compose

```bash
# Go to root directory
cd ..

# Create .env files for each service first
# Then build and run all services

docker-compose up --build
```

**Access services:**
- Product Service: http://localhost:3002
- Inventory Service: http://localhost:3003

---

## 4. AWS Setup

### Step 1: Create IAM User

1. Go to AWS Console → IAM
2. Click "Users" → "Create user"
3. Username: `homeessentials-cicd`
4. Click "Next"
5. Attach policies:
   - `AmazonECS_FullAccess`
   - `AmazonEC2ContainerRegistryFullAccess`
   - `CloudWatchLogsFullAccess`
6. Create user
7. Create access keys:
   - Click on user → "Security credentials"
   - Click "Create access key"
   - Use case: "Application running outside AWS"
   - Save Access Key ID and Secret Access Key

### Step 2: Create ECR Repositories

```bash
aws ecr create-repository --repository-name homeessentials-product-service --region us-east-1
aws ecr create-repository --repository-name homeessentials-inventory-service --region us-east-1
```

Or via AWS Console:
1. Go to Amazon ECR
2. Click "Create repository"
3. Name: `homeessentials-product-service`
4. Visibility: Private
5. Repeat for inventory service

### Step 3: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name homeessentials-cluster --region us-east-1
```

Or via AWS Console:
1. Go to Amazon ECS
2. Click "Create Cluster"
3. Cluster name: `homeessentials-cluster`
4. Infrastructure: AWS Fargate
5. Create

### Step 4: Create Task Execution Role

1. Go to IAM → Roles → Create role
2. Select "AWS service" → "Elastic Container Service"
3. Use case: "Elastic Container Service Task"
4. Attach policies:
   - `AmazonECSTaskExecutionRolePolicy`
   - `SecretsManagerReadWrite` (for secrets)
5. Name: `ecsTaskExecutionRole`
6. Create role

### Step 5: Store Secrets in AWS Secrets Manager

```bash
# Store MongoDB URI for Product Service
aws secretsmanager create-secret \
  --name product-service/mongodb-uri \
  --secret-string "mongodb+srv://..." \
  --region us-east-1

# Store MongoDB URI for Inventory Service
aws secretsmanager create-secret \
  --name inventory-service/mongodb-uri \
  --secret-string "mongodb+srv://..." \
  --region us-east-1
```

### Step 6: Update Task Definitions

Edit `task-definition.json` files and replace:
- `YOUR_ACCOUNT_ID` with your AWS account ID
- Update ARNs for IAM roles
- Update secret ARNs

### Step 7: Create Load Balancer

1. Go to EC2 → Load Balancers
2. Create Application Load Balancer
3. Name: `homeessentials-alb`
4. Internet-facing
5. Select all availability zones
6. Create target groups:
   - `product-service-tg` (port 3002)
   - `inventory-service-tg` (port 3003)
7. Configure listeners and rules

---

## 5. CI/CD Configuration

### Step 1: GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
SONAR_TOKEN=<your-sonarcloud-token>
SNYK_TOKEN=<your-snyk-token>
```

### Step 2: SonarCloud Setup

1. Go to [sonarcloud.io](https://sonarcloud.io)
2. Login with GitHub
3. Click "+" → "Analyze new project"
4. Select your repository
5. Create organization (if needed)
6. Get your token:
   - My Account → Security → Generate Token
7. Add to GitHub Secrets as `SONAR_TOKEN`

### Step 3: Snyk Setup

1. Go to [snyk.io](https://snyk.io)
2. Login with GitHub
3. Go to Account Settings
4. Get API token
5. Add to GitHub Secrets as `SNYK_TOKEN`

### Step 4: Test CI/CD

1. Make a small code change
2. Commit and push to main branch
3. Go to GitHub → Actions
4. Watch the workflow run
5. Check for any errors

---

## 6. Testing

### Manual API Testing

**Create Product:**
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basmati Rice",
    "description": "Premium quality basmati rice from Pakistan",
    "category": "rice",
    "price": 450,
    "unit": "kg",
    "brand": "Araliya"
  }'
```

**Get All Products:**
```bash
curl http://localhost:3002/api/products
```

**Create Inventory:**
```bash
curl -X POST http://localhost:3003/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<product-id-from-above>",
    "productName": "Basmati Rice",
    "quantity": 100,
    "lowStockThreshold": 10
  }'
```

**Check Stock:**
```bash
curl -X POST http://localhost:3003/api/inventory/check \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<product-id>",
    "quantity": 5
  }'
```

### Using Postman

Import the Swagger docs as Postman collections:
1. Open Postman
2. Import → Link
3. Enter: http://localhost:3002/api-docs
4. Repeat for inventory service

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js, Docker, Git
- [ ] Create MongoDB Atlas account and cluster
- [ ] Create 6 databases
- [ ] Get MongoDB connection strings
- [ ] Clone repository
- [ ] Setup .env files
- [ ] Install dependencies (`npm install`)
- [ ] Test services locally
- [ ] Create AWS account
- [ ] Create ECR repositories
- [ ] Create ECS cluster
- [ ] Setup IAM roles
- [ ] Store secrets in Secrets Manager
- [ ] Configure GitHub secrets
- [ ] Setup SonarCloud
- [ ] Setup Snyk
- [ ] Test CI/CD pipeline
- [ ] Deploy to AWS

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Check IP whitelist in Atlas
- Verify username/password
- Check connection string format

### Docker Issues
- Clear cache: `docker system prune -a`
- Check port conflicts
- Verify .env files

### AWS Deployment Issues
- Check IAM permissions
- Verify secret ARNs
- Check CloudWatch logs
- Verify security groups

---

## 📞 Support

- Create issue on GitHub
- Check service-specific README files
- Review API documentation at `/api-docs`

---

**Good luck with your implementation! 🚀**
