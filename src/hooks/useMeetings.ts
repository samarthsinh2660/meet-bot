import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recordingsApi } from '@/api/meetings';
import type { RecordingsFilterParams, Recording, RecordingDetail } from '@/api/types';
import { toast } from 'sonner';

// Query keys
export const recordingKeys = {
  all: ['recordings'] as const,
  lists: () => [...recordingKeys.all, 'list'] as const,
  list: (filters?: RecordingsFilterParams) => [...recordingKeys.lists(), filters] as const,
  details: () => [...recordingKeys.all, 'detail'] as const,
  detail: (id: string) => [...recordingKeys.details(), id] as const,
  stats: (year?: number, month?: number) => [...recordingKeys.all, 'stats', year, month] as const,
  transcript: (id: string) => [...recordingKeys.all, 'transcript', id] as const,
};

// Get all recordings with optional filters
export function useRecordings(params?: RecordingsFilterParams) {
  return useQuery({
    queryKey: recordingKeys.list(params),
    queryFn: () => recordingsApi.getRecordings(params),
    refetchInterval: 15000, // Refetch every 15 seconds for status updates
    staleTime: 10000,
    retry: false, // Don't retry on 404
    // Return empty list if endpoint not available
    placeholderData: { total: 0, limit: 50, offset: 0, recordings: [] },
  });
}

// Get single recording by ID
export function useRecording(recordingId: string) {
  return useQuery({
    queryKey: recordingKeys.detail(recordingId),
    queryFn: () => recordingsApi.getRecording(recordingId),
    enabled: !!recordingId,
    refetchInterval: (query) => {
      // Poll more frequently if recording is still processing
      const data = query.state.data as RecordingDetail | undefined;
      if (data?.status === 'processing' || data?.status === 'pending') {
        return 10000; // 10 seconds
      }
      return false; // Stop polling when completed
    },
  });
}

// Get transcript for a recording
export function useTranscript(recordingId: string) {
  return useQuery({
    queryKey: recordingKeys.transcript(recordingId),
    queryFn: () => recordingsApi.getTranscript(recordingId),
    enabled: !!recordingId,
  });
}

// Get recording stats
export function useRecordingStats(year?: number, month?: number) {
  return useQuery({
    queryKey: recordingKeys.stats(year, month),
    queryFn: () => recordingsApi.getStats(year, month),
    retry: false, // Don't retry on 404
    // Return empty stats if endpoint not available
    placeholderData: {
      total_recordings: 0,
      total_duration_minutes: 0,
      completed_recordings: 0,
      failed_recordings: 0,
      recordings_by_month: [],
    },
  });
}

// Launch new meeting recording (single)
export function useLaunchMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingUrl, durationMin }: { meetingUrl: string; durationMin: number }) =>
      recordingsApi.launchMeeting(meetingUrl, durationMin),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recordingKeys.lists() });
      const recordingId = data.recordings?.[0]?.recording_id || data.created?.[0];
      toast.success(`Recording started! ID: ${recordingId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start recording');
    },
  });
}

// Launch multiple meeting recordings at once
export function useLaunchMultipleMeetings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingUrls, durationMin }: { meetingUrls: string[]; durationMin: number }) =>
      recordingsApi.launchMultipleMeetings(meetingUrls, durationMin),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recordingKeys.lists() });
      toast.success(`${data.count} recording(s) started!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start recordings');
    },
  });
}

// Delete recording
export function useDeleteRecording() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordingId: string) => recordingsApi.deleteRecording(recordingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordingKeys.lists() });
      toast.success('Recording deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete recording');
    },
  });
}

// Legacy aliases for backward compatibility during migration
export const useMeetings = useRecordings;
export const useMeeting = useRecording;
export const useStartMeeting = useLaunchMeeting;
export const useMeetingStats = useRecordingStats;

// Stub functions for removed features (pause/resume/stop no longer in new API)
export function usePauseMeeting() {
  return useMutation({
    mutationFn: async (_meetingId: string) => {
      toast.info('Pause feature not available in new API');
    },
  });
}

export function useResumeMeeting() {
  return useMutation({
    mutationFn: async (_meetingId: string) => {
      toast.info('Resume feature not available in new API');
    },
  });
}

export function useStopMeeting() {
  return useMutation({
    mutationFn: async (_meetingId: string) => {
      toast.info('Stop feature not available in new API');
    },
  });
}
