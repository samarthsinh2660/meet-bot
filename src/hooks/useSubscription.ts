import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '@/api/subscription';
import { toast } from 'sonner';

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

// Create checkout session
export function useCreateCheckout() {
  return useMutation({
    mutationFn: (planId: string) => subscriptionApi.createCheckout(planId),
    onSuccess: (data) => {
      // Redirect to checkout page
      window.location.href = data.checkout_url;
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
