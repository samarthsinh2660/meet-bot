import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { setAccessToken, removeAccessToken, getAccessToken } from '@/api/client';
import type { UserCreate, LoginCredentials, PasswordChange, PasswordReset, PasswordResetConfirm } from '@/api/types';
import { toast } from 'sonner';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Get current user hook
export function useCurrentUser() {
  const token = getAccessToken();
  
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const token = await authApi.login(credentials);
      setAccessToken(token.access_token);
      return token;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid credentials');
    },
  });
}

// Register mutation
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UserCreate) => authApi.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/auth/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

// Logout function
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    removeAccessToken();
    queryClient.clear();
    navigate('/auth/login');
    toast.success('Logged out successfully');
  };
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChange) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: PasswordReset) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success('Password reset email sent. Check your inbox.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
}

// Reset password mutation
export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PasswordResetConfirm) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successful! Please login.');
      navigate('/auth/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}
