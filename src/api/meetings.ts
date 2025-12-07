import apiClient from './client';
import type {
  MeetingStartRequest,
  MeetingResponse,
  MeetingStatusResponse,
  MeetingsLaunchRequest,
  MeetingsLaunchResponse,
} from './types';

// Meeting Bot API endpoints
export const meetingsApi = {
  // Start a new meeting bot via /api/v1/meetings/launch
  startMeeting: async (data: MeetingStartRequest): Promise<MeetingResponse> => {
    const payload: MeetingsLaunchRequest = {
      meetings: [data.meeting_url],
      // Backend expects duration_min in minutes; map from UI duration if provided
      ...(data.duration !== undefined ? { duration_min: data.duration } : {}),
    };

    const response = await apiClient.post<MeetingsLaunchResponse>(
      '/api/v1/meetings/launch',
      payload
    );
    const launchedId = response.data.created?.[0] ?? '';
    return {
      message: 'Meeting launched',
      meeting_id: launchedId,
    };
  },

  // Get all user's meetings
  getMyMeetings: async (): Promise<MeetingStatusResponse[]> => {
    const response = await apiClient.get<MeetingStatusResponse[]>(
      '/api/v1/meeting-bot/my-meetings'
    );
    return response.data;
  },

  // Pause a meeting
  pauseMeeting: async (meetingId: string): Promise<void> => {
    await apiClient.post(`/api/v1/meeting-bot/meeting/${meetingId}/pause`);
  },

  // Resume a meeting
  resumeMeeting: async (meetingId: string): Promise<void> => {
    await apiClient.post(`/api/v1/meeting-bot/meeting/${meetingId}/resume`);
  },

  // Stop a meeting
  stopMeeting: async (meetingId: string): Promise<void> => {
    await apiClient.post(`/api/v1/meeting-bot/meeting/${meetingId}/stop`);
  },

  // Get meeting bots status (admin)
  getMeetingBotsStatus: async (): Promise<unknown> => {
    const response = await apiClient.get('/api/v1/meeting-bot/meeting-bots/status');
    return response.data;
  },

  // Cleanup dead meeting bot containers
  cleanupMeetingBots: async (): Promise<unknown> => {
    const response = await apiClient.post('/api/v1/meeting-bot/meeting-bots/cleanup');
    return response.data;
  },
};

export default meetingsApi;
