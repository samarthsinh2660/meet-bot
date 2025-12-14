# Payment & Subscription System - Backend API Requirements

This document outlines the backend API endpoints and data structures needed to support the payment/subscription system in the Skriber frontend.

## Overview

- **Free Trial**: 5 meetings total (no time limit)
- **Pro Plan**: ₹1,085/month - 50 meetings/month, unlimited duration

---

## Required API Endpoints

### 1. Subscription Plans

#### `GET /api/v1/subscriptions/plans`
Returns list of available subscription plans.

**Response:**
```json
[
  {
    "id": "free_trial",
    "name": "Free Trial",
    "price": 0,
    "currency": "INR",
    "meetings_limit": 5,
    "duration_limit": null,
    "features": [
      "5 meetings included",
      "HD video recording",
      "Auto transcription",
      "Cloud storage",
      "Basic support"
    ]
  },
  {
    "id": "pro_monthly",
    "name": "Pro",
    "price": 1085,
    "currency": "INR",
    "meetings_limit": 50,
    "duration_limit": null,
    "features": [
      "50 meetings per month",
      "Unlimited duration",
      "HD video recording",
      "Auto transcription",
      "Priority cloud storage",
      "Priority support",
      "Advanced analytics",
      "Team collaboration"
    ]
  }
]
```

---

### 2. Current Subscription

#### `GET /api/v1/subscriptions/current`
Returns the current user's subscription details.

**Response:**
```json
{
  "id": "sub_123456",
  "user_id": "user_789",
  "plan_id": "free_trial",
  "plan_name": "Free Trial",
  "status": "trial",
  "meetings_used": 3,
  "meetings_limit": 5,
  "current_period_start": "2024-12-01T00:00:00Z",
  "current_period_end": null,
  "cancel_at_period_end": false
}
```

**Status values:**
- `trial` - Free trial active
- `active` - Paid subscription active
- `cancelled` - Subscription cancelled (still active until period end)
- `expired` - Subscription expired

---

### 3. Usage Statistics

#### `GET /api/v1/subscriptions/usage`
Returns current usage statistics for the user.

**Response:**
```json
{
  "meetings_used": 3,
  "meetings_limit": 5,
  "meetings_remaining": 2,
  "plan_name": "free",
  "is_trial": true,
  "can_record": true
}
```

**Important:** The `can_record` field should be `false` when `meetings_used >= meetings_limit` for free trial users.

---

### 4. Create Checkout Session

#### `POST /api/v1/subscriptions/checkout`
Creates a payment checkout session (e.g., Razorpay, Stripe).

**Request:**
```json
{
  "plan_id": "pro_monthly"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.razorpay.com/v1/checkout.js?key=...",
  "session_id": "sess_abc123",
  "order_id": "order_xyz789"
}
```

**Notes:**
- For Razorpay: Return `order_id` and `key_id` for client-side integration
- For Stripe: Return `checkout_url` for redirect-based checkout
- Frontend will redirect user to this URL or open payment modal

---

### 5. Payment Webhook (Backend Only)

#### `POST /api/v1/subscriptions/webhook`
Webhook endpoint for payment gateway callbacks.

**Razorpay Webhook Events:**
- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `subscription.activated` - Subscription started
- `subscription.cancelled` - Subscription cancelled

**Actions on successful payment:**
1. Update user's subscription status to `active`
2. Set `plan_id` to the purchased plan
3. Reset `meetings_used` to 0
4. Set `current_period_start` and `current_period_end`

---

### 6. Cancel Subscription

#### `POST /api/v1/subscriptions/cancel`
Cancels the user's subscription at period end.

**Response:**
```json
{
  "message": "Subscription will be cancelled at the end of your billing period",
  "cancel_at": "2025-01-14T00:00:00Z"
}
```

---

### 7. Resume Subscription

#### `POST /api/v1/subscriptions/resume`
Resumes a cancelled subscription before period end.

**Response:**
```json
{
  "message": "Subscription resumed successfully"
}
```

---

### 8. Payment History

#### `GET /api/v1/subscriptions/payments`
Returns user's payment history.

**Response:**
```json
[
  {
    "id": "pay_123",
    "amount": 1085,
    "currency": "INR",
    "status": "succeeded",
    "created_at": "2024-12-14T10:30:00Z",
    "invoice_url": "https://..."
  }
]
```

---

### 9. Customer Portal

#### `POST /api/v1/subscriptions/portal`
Returns URL to customer portal for managing payment methods.

**Response:**
```json
{
  "portal_url": "https://billing.razorpay.com/portal/..."
}
```

---

## Database Schema Suggestions

### `subscriptions` table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'trial',
  meetings_used INTEGER DEFAULT 0,
  meetings_limit INTEGER DEFAULT 5,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_provider VARCHAR(50),
  provider_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `payments` table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL,
  provider_payment_id VARCHAR(255),
  invoice_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `plans` table
```sql
CREATE TABLE plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  meetings_limit INTEGER,
  duration_limit INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Business Logic Requirements

### 1. Meeting Recording Check
Before allowing a user to start a new recording, check:
```python
def can_user_record(user_id):
    subscription = get_user_subscription(user_id)
    
    if subscription.status == 'active':
        # Pro users: check monthly limit
        return subscription.meetings_used < subscription.meetings_limit
    elif subscription.status == 'trial':
        # Free trial: check total limit
        return subscription.meetings_used < 5
    else:
        return False
```

### 2. Increment Usage
After a meeting recording is completed:
```python
def increment_meeting_usage(user_id):
    subscription = get_user_subscription(user_id)
    subscription.meetings_used += 1
    subscription.save()
```

### 3. Monthly Reset (for Pro users)
Run a cron job to reset `meetings_used` at the start of each billing period:
```python
def reset_monthly_usage():
    # For all active subscriptions where current_period_end has passed
    subscriptions = Subscription.query.filter(
        Subscription.status == 'active',
        Subscription.current_period_end <= datetime.now()
    ).all()
    
    for sub in subscriptions:
        sub.meetings_used = 0
        sub.current_period_start = datetime.now()
        sub.current_period_end = datetime.now() + timedelta(days=30)
        sub.save()
```

---

## Payment Gateway Integration (Razorpay Recommended for INR)

### Razorpay Setup
1. Create Razorpay account at https://razorpay.com
2. Get API keys (Key ID and Key Secret)
3. Set up webhook URL: `https://api.skriber.in/api/v1/subscriptions/webhook`

### Environment Variables
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

### Creating an Order (Backend)
```python
import razorpay

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def create_checkout(user_id, plan_id):
    plan = get_plan(plan_id)
    
    order = client.order.create({
        'amount': plan.price * 100,  # Amount in paise
        'currency': 'INR',
        'receipt': f'order_{user_id}_{plan_id}',
        'notes': {
            'user_id': user_id,
            'plan_id': plan_id
        }
    })
    
    return {
        'order_id': order['id'],
        'key_id': RAZORPAY_KEY_ID,
        'amount': order['amount'],
        'currency': order['currency']
    }
```

---

## Frontend Integration Points

The frontend has been set up with:

1. **`src/api/subscription.ts`** - API client functions
2. **`src/hooks/useSubscription.ts`** - React Query hooks
3. **`src/components/Pricing.tsx`** - Landing page pricing section
4. **`src/components/UpgradeModal.tsx`** - Upgrade popup when limit reached
5. **`src/components/UsageBanner.tsx`** - Dashboard usage indicator

The frontend will call these APIs and handle the UI accordingly. Backend just needs to implement the endpoints as specified above.

---

## Testing Checklist

- [ ] User can see their current plan and usage
- [ ] Free trial users see upgrade prompt after 5 meetings
- [ ] Checkout flow redirects to payment gateway
- [ ] Webhook updates subscription status on successful payment
- [ ] Pro users can record up to 50 meetings/month
- [ ] Usage resets monthly for Pro users
- [ ] Users can cancel and resume subscriptions
- [ ] Payment history is accessible
