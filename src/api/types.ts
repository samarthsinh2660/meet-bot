// ============================================
// API Types - Generated from OpenAPI spec
// ============================================

// Auth Types
export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  social_accounts: SocialAccountResponse[];
}

export interface SocialAccountResponse {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  email: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

export interface PasswordReset {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

// Meeting Types
// Internal UI contract for starting a single meeting from a URL
export interface MeetingStartRequest {
  meeting_url: string;
  duration?: number;
}

// Backend API contract for launching one or more meetings
export interface MeetingsLaunchRequest {
  meetings: string[];
  duration_min?: number | null;
}

export interface MeetingsLaunchResponse {
  created: string[];
  count: number;
}

// Normalized response the UI uses after launching a meeting
export interface MeetingResponse {
  message: string;
  meeting_id: string;
  container_id?: string | null;
  port?: number | null;
  status?: string | null;
}

export interface MeetingStatusResponse {
  id: string;
  user_id: string;
  meeting_id: string;
  meeting_url: string;
  meeting_duration?: number | null;
  actual_duration?: number | null;
  container_id?: string | null;
  port?: number | null;
  status: string;
  bot_logs?: string | null;
  meeting_created_at: string;
  meeting_started_at?: string | null;
  meeting_ended_at?: string | null;
  meeting_updated_at: string;
}

export interface K8sMeetingRequest {
  meetingId: string;
  duration?: number;
  uuid?: string | null;
  recordType?: string | null;
}

export interface BatchRequest {
  count?: number;
  baseMeetingId: string;
  duration?: number;
  recordType?: string | null;
}

// API Error
export interface APIError {
  detail: string | ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Meeting Status enum for easier handling
export type MeetingStatus = 
  | 'pending'
  | 'starting'
  | 'running'
  | 'recording'
  | 'paused'
  | 'stopping'
  | 'completed'
  | 'failed'
  | 'cancelled';

export const MEETING_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  starting: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  running: 'bg-green-500/20 text-green-400 border-green-500/30',
  recording: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  stopping: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};
