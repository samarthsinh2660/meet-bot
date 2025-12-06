import apiClient from './client';
import type {
  MeetingStartRequest,
  MeetingResponse,
  MeetingStatusResponse,
} from './types';

// Meeting Bot API endpoints
export const meetingsApi = {
  // Start a new meeting bot
  startMeeting: async (data: MeetingStartRequest): Promise<MeetingResponse> => {
    const response = await apiClient.post<MeetingResponse>(
      '/api/v1/meeting-bot/meeting-url',
      data
    );
    return response.data;
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
