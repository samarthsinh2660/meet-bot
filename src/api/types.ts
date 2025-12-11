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

// ============================================
// Recording & Meeting Types (New API)
// ============================================

// Launch meeting request
export interface LaunchMeetingRequest {
  meetings: string[];
  duration_min: number;
  record?: boolean;
}

// Launch meeting response
export interface LaunchMeetingResponse {
  created: string[];
  count: number;
  db_status: string;
  recordings: LaunchedRecording[];
}

export interface LaunchedRecording {
  job_name: string;
  recording_id: string;
  gcs_video_uri: string;
}

// Transcript segment
export interface TranscriptSegment {
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
}

// Transcript response
export interface TranscriptResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transcript: TranscriptSegment[];
  created_at: string;
  completed_at?: string;
}

// Recording item in list
export interface Recording {
  id: string;
  meeting_url: string;
  duration_minutes: number;
  video_url?: string;
  status: string;
  has_transcript: boolean;
  created_at: string;
  completed_at?: string;
}

// Recordings list response
export interface RecordingsListResponse {
  total: number;
  limit: number;
  offset: number;
  recordings: Recording[];
}

// Recording detail with transcript
export interface RecordingDetail {
  id: string;
  meeting_url: string;
  duration_minutes: number;
  video_url?: string;
  status: string;
  created_at: string;
  completed_at?: string;
  transcript?: {
    id: string;
    status: string;
    segments: TranscriptSegment[];
  };
}

// Recording stats
export interface RecordingStats {
  total_recordings: number;
  total_duration_minutes: number;
  completed_recordings: number;
  failed_recordings: number;
  recordings_by_month: MonthlyStats[];
}

export interface MonthlyStats {
  month: string;
  count: number;
  duration_minutes: number;
}

// Delete recording response
export interface DeleteRecordingResponse {
  message: string;
  recording_id: string;
}

// Recordings filter params
export interface RecordingsFilterParams {
  start_date?: string;
  end_date?: string;
  year?: number;
  month?: number;
  day?: number;
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
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
