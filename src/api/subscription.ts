import { apiClient } from './client';

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  meetings_limit: number;
  duration_limit: number | null; // null = unlimited
  features: string[];
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  meetings_used: number;
  meetings_limit: number;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface UsageStats {
  meetings_used: number;
  meetings_limit: number;
  meetings_remaining: number;
  plan_name: string;
  is_trial: boolean;
  can_record: boolean;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
  invoice_url?: string;
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

  // Create checkout session (redirects to payment gateway)
  createCheckout: async (planId: string): Promise<CreateCheckoutResponse> => {
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
