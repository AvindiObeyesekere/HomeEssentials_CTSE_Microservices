# Notification Service

Notification Delivery Service for HomeEssentials+

## 📋 Overview

**Assigned to:** Student 4

This service handles sending notifications to users for various system events.

## 🎯 Responsibilities

- Send order confirmation notifications
- Send payment success/failure notifications
- Store notification history
- Support multiple notification channels (Email, SMS - simulated)

## 🔌 API Endpoints (To Implement)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications` | Send notification |
| GET | `/api/notifications/:userId` | Get user notifications |
| GET | `/api/notifications/:id` | Get notification details |

## 💾 Database Schema (Suggested)

```javascript
{
  notificationId: String (unique),
  userId: String,
  title: String,
  message: String,
  type: String (ORDER_CONFIRMED, PAYMENT_SUCCESS, PAYMENT_FAILED),
  channel: String (EMAIL, SMS, PUSH),
  status: String (SENT, FAILED, PENDING),
  metadata: {
    orderId: String,
    amount: Number
  },
  sentAt: Date,
  createdAt: Date
}
```

## 🔄 Notification Flow

1. Receive notification request from Payment Service
2. Format notification message
3. Simulate sending (console.log for demo)
4. Store notification record
5. Return confirmation

## 🔗 Service Communication

### Incoming
- **Payment Service**: Sends payment notifications

### Outgoing
- None (End of chain)

## 🚀 Tech Stack (Recommended)

- Node.js + Express
- MongoDB
- Notification templates

## 📝 Implementation Guide

### Notification Templates

```javascript
const templates = {
  ORDER_CONFIRMED: (data) => ({
    title: 'Order Confirmed',
    message: `Your order #${data.orderId} has been confirmed. Total: LKR ${data.amount}`
  }),
  PAYMENT_SUCCESS: (data) => ({
    title: 'Payment Successful',
    message: `Payment of LKR ${data.amount} was successful.`
  }),
  PAYMENT_FAILED: (data) => ({
    title: 'Payment Failed',
    message: `Payment failed. Please try again.`
  })
};
```

### Simulated Sending

```javascript
const sendNotification = async (notification) => {
  // Simulate email/SMS sending
  console.log('📧 Sending notification:', notification.title);
  console.log('📱 To user:', notification.userId);
  console.log('📝 Message:', notification.message);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { status: 'SENT', sentAt: new Date() };
};
```

## 🔮 Future Enhancements

- Integrate real email service (SendGrid, AWS SES)
- Integrate SMS service (Twilio)
- Add push notifications
- Add notification preferences

## Port

**Development:** 3006

---

Keep it simple for MVP. Console logging is acceptable for demo.
