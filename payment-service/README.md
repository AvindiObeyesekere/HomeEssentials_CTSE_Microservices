# Payment Service

Payment Processing Service for HomeEssentials+

## 📋 Overview

**Assigned to:** Student 3

This service handles payment processing for orders.

## 🎯 Responsibilities

- Process payment requests
- Simulate payment gateway
- Store payment records
- Send payment confirmation to Notification Service

## 🔌 API Endpoints (To Implement)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Process payment |
| GET | `/api/payments/:id` | Get payment details |
| GET | `/api/payments/order/:orderId` | Get payment by order |

## 💾 Database Schema (Suggested)

```javascript
{
  paymentId: String (unique),
  orderId: String,
  userId: String,
  amount: Number,
  paymentMethod: String (Card/Cash/Online),
  cardNumber: String (last 4 digits only),
  status: String (SUCCESS/FAILED),
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Payment Flow

1. Receive payment request from Order Service
2. Simulate payment processing (random success/failure for demo)
3. Store payment record
4. Return payment result to Order Service
5. If SUCCESS → Call Notification Service

## 🔗 Service Communication

### Incoming
- **Order Service**: Sends payment requests

### Outgoing
- **Notification Service**: Sends payment success notification

## 🚀 Tech Stack (Recommended)

- Node.js + Express
- MongoDB
- Payment simulation logic

## 📝 Implementation Guide

### Payment Simulation

```javascript
// Simple simulation
const processPayment = (amount, method) => {
  // 80% success rate for demo
  const success = Math.random() > 0.2;
  
  return {
    status: success ? 'SUCCESS' : 'FAILED',
    transactionId: generateTransactionId(),
    message: success ? 'Payment successful' : 'Payment failed'
  };
};
```

## 🔐 Security Notes

- NEVER store full card numbers
- Store only last 4 digits
- Hash sensitive data
- Use HTTPS in production

## Port

**Development:** 3005

---

For real production, integrate with Stripe, PayPal, or local payment gateway.
