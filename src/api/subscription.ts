import { apiClient } from './client';

// Subscription types
export interface SubscriptionPlan {
  id: string; // "free" or "pro"
  name: string;
  price: number; // in INR (rupees, not paise)
  currency: string;
  meetings_limit: number;
  duration_limit: number | null; // null = unlimited
  features: string[];
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string; // "free" or "pro"
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  meetings_used: number;
  meetings_limit: number;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface UsageStats {
  meetings_used: number;
  meetings_limit: number;
  meetings_remaining: number;
  plan_name: string; // "free" or "pro"
  is_trial: boolean;
  can_record: boolean;
}

// Razorpay checkout response
export interface RazorpayCheckoutResponse {
  order_id: string;
  key_id: string;
  amount: number; // in paise (108500 = ₹1,085)
  currency: string;
}

export interface PaymentHistory {
  id: string;
  amount: number; // in rupees
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
  invoice_url: string | null;
}

// Razorpay payment response (from checkout handler)
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Error response for limit exceeded
export interface LimitExceededError {
  error: string;
  message: string;
  meetings_used: number;
  meetings_limit: number;
  plan_name: string;
  upgrade_required: boolean;
}

// API functions
export const subscriptionApi = {
  // Get available plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get('/api/v1/subscriptions/plans');
    return response.data;
  },

  // Get current user's subscription
  getSubscription: async (): Promise<UserSubscription> => {
    const response = await apiClient.get('/api/v1/subscriptions/current');
    return response.data;
  },

  // Get usage stats
  getUsage: async (): Promise<UsageStats> => {
    const response = await apiClient.get('/api/v1/subscriptions/usage');
    return response.data;
  },

  // Create checkout session (returns Razorpay order details)
  createCheckout: async (planId: string): Promise<RazorpayCheckoutResponse> => {
    const response = await apiClient.post('/api/v1/subscriptions/checkout', {
      plan_id: planId,
    });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/v1/subscriptions/cancel');
    return response.data;
  },

  // Resume cancelled subscription
  resumeSubscription: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/v1/subscriptions/resume');
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    const response = await apiClient.get('/api/v1/subscriptions/payments');
    return response.data;
  },

  // Get customer portal URL (for managing payment methods, invoices)
  getPortalUrl: async (): Promise<{ portal_url: string }> => {
    const response = await apiClient.post('/api/v1/subscriptions/portal');
    return response.data;
  },
};

export default subscriptionApi;
