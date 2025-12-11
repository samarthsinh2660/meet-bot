import apiClient from './client';
import type {
  LaunchMeetingRequest,
  LaunchMeetingResponse,
  Recording,
  RecordingsListResponse,
  RecordingDetail,
  RecordingStats,
  TranscriptResponse,
  DeleteRecordingResponse,
  RecordingsFilterParams,
} from './types';

// Recordings API endpoints (New API)
export const recordingsApi = {
  // Launch a single meeting recording
  launchMeeting: async (meetingUrl: string, durationMin: number): Promise<LaunchMeetingResponse> => {
    const payload: LaunchMeetingRequest = {
      meetings: [meetingUrl],
      duration_min: durationMin,
      record: true,
    };
    const response = await apiClient.post<LaunchMeetingResponse>(
      '/api/v1/meetings/launch',
      payload
    );
    return response.data;
  },

  // Launch multiple meeting recordings at once
  launchMultipleMeetings: async (meetingUrls: string[], durationMin: number): Promise<LaunchMeetingResponse> => {
    const payload: LaunchMeetingRequest = {
      meetings: meetingUrls,
      duration_min: durationMin,
      record: true,
    };
    const response = await apiClient.post<LaunchMeetingResponse>(
      '/api/v1/meetings/launch',
      payload
    );
    return response.data;
  },

  // Get all recordings with optional filters
  getRecordings: async (params?: RecordingsFilterParams): Promise<RecordingsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.day) queryParams.append('day', params.day.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = queryString ? `/api/v1/recordings?${queryString}` : '/api/v1/recordings';
    
    const response = await apiClient.get<RecordingsListResponse>(url);
    return response.data;
  },

  // Get a single recording with transcript
  getRecording: async (recordingId: string): Promise<RecordingDetail> => {
    const response = await apiClient.get<RecordingDetail>(
      `/api/v1/recordings/${recordingId}`
    );
    return response.data;
  },

  // Get transcript for a recording
  getTranscript: async (recordingId: string): Promise<TranscriptResponse> => {
    const response = await apiClient.get<TranscriptResponse>(
      `/api/v1/transcripts/${recordingId}`
    );
    return response.data;
  },

  // Get recording statistics
  getStats: async (year?: number, month?: number): Promise<RecordingStats> => {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (month) queryParams.append('month', month.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/api/v1/recordings/stats?${queryString}` : '/api/v1/recordings/stats';
    
    const response = await apiClient.get<RecordingStats>(url);
    return response.data;
  },

  // Delete a recording
  deleteRecording: async (recordingId: string): Promise<DeleteRecordingResponse> => {
    const response = await apiClient.delete<DeleteRecordingResponse>(
      `/api/v1/recordings/${recordingId}`
    );
    return response.data;
  },
};

export default recordingsApi;
