import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi, RazorpayCheckoutResponse } from '@/api/subscription';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

// Query keys
export const subscriptionKeys = {
  all: ['subscription'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
  usage: () => [...subscriptionKeys.all, 'usage'] as const,
  payments: () => [...subscriptionKeys.all, 'payments'] as const,
};

// Get available plans
export function usePlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: subscriptionApi.getPlans,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Get current subscription
export function useSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: subscriptionApi.getSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get usage stats
export function useUsage() {
  return useQuery({
    queryKey: subscriptionKeys.usage(),
    queryFn: subscriptionApi.getUsage,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

// Load Razorpay script dynamically
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Create checkout session and open Razorpay
export function useCreateCheckout() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (planId: string) => {
      // Load Razorpay script first
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create checkout session
      const checkoutData = await subscriptionApi.createCheckout(planId);
      return checkoutData;
    },
    onSuccess: (checkoutData: RazorpayCheckoutResponse) => {
      // Open Razorpay checkout modal
      const options: RazorpayOptions = {
        key: checkoutData.key_id,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        order_id: checkoutData.order_id,
        name: 'Skriber',
        description: 'Pro Plan - ₹899/month',
        image: '/logo.png',
        handler: async (response: RazorpayResponse) => {
          // Payment successful
          console.log('Payment successful:', response);
          toast.success('Payment successful! Upgrading your account...');
          
          // Refresh subscription data
          await queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
          await queryClient.invalidateQueries({ queryKey: subscriptionKeys.usage() });
          
          // Small delay for webhook processing
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.usage() });
            toast.success('You now have Pro access! Enjoy 50 meetings/month.');
          }, 2000);
        },
        prefill: {
          email: user?.email || '',
        },
        theme: {
          color: '#8B5CF6', // Primary purple color
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create checkout session');
    },
  });
}

// Cancel subscription
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
      toast.success('Subscription cancelled. You will have access until the end of your billing period.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel subscription');
    },
  });
}

// Resume subscription
export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.resumeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
      toast.success('Subscription resumed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resume subscription');
    },
  });
}

// Get payment history
export function usePaymentHistory() {
  return useQuery({
    queryKey: subscriptionKeys.payments(),
    queryFn: subscriptionApi.getPaymentHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get customer portal URL
export function useCustomerPortal() {
  return useMutation({
    mutationFn: subscriptionApi.getPortalUrl,
    onSuccess: (data) => {
      window.location.href = data.portal_url;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to open customer portal');
    },
  });
}
