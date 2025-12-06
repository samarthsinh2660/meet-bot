import apiClient from './client';
import type {
  UserCreate,
  UserResponse,
  Token,
  LoginCredentials,
  PasswordChange,
  PasswordReset,
  PasswordResetConfirm,
} from './types';

// Auth API endpoints
export const authApi = {
  // Register new user
  register: async (data: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  // Login with username/email and password
  login: async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<Token>('/api/v1/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/api/v1/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<Token> => {
    const response = await apiClient.post<Token>('/api/v1/auth/refresh');
    return response.data;
  },

  // Change password
  changePassword: async (data: PasswordChange): Promise<void> => {
    await apiClient.post('/api/v1/auth/change-password', data);
  },

  // Forgot password - request reset token
  forgotPassword: async (data: PasswordReset): Promise<void> => {
    await apiClient.post('/api/v1/auth/forgot-password', data);
  },

  // Reset password with token
  resetPassword: async (data: PasswordResetConfirm): Promise<void> => {
    await apiClient.post('/api/v1/auth/reset-password', data);
  },

  // Google OAuth login URL
  getGoogleLoginUrl: (): string => {
    return `${apiClient.defaults.baseURL}/api/v1/auth/google/login`;
  },
};

export default authApi;
