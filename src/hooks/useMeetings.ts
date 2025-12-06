import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '@/api/meetings';
import type { MeetingStartRequest } from '@/api/types';
import { toast } from 'sonner';

// Query keys
export const meetingKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingKeys.all, 'list'] as const,
  list: (filters?: string) => [...meetingKeys.lists(), filters] as const,
  details: () => [...meetingKeys.all, 'detail'] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
};

// Get all user meetings
export function useMeetings() {
  return useQuery({
    queryKey: meetingKeys.lists(),
    queryFn: meetingsApi.getMyMeetings,
    refetchInterval: 10000, // Refetch every 10 seconds to get real-time status
    staleTime: 5000,
  });
}

// Get single meeting by ID (from cached list)
export function useMeeting(meetingId: string) {
  const { data: meetings } = useMeetings();
  
  return {
    data: meetings?.find((m) => m.id === meetingId || m.meeting_id === meetingId),
    isLoading: !meetings,
  };
}

// Start new meeting bot
export function useStartMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MeetingStartRequest) => meetingsApi.startMeeting(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      toast.success(`Bot deployed successfully! Meeting ID: ${data.meeting_id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start meeting bot');
    },
  });
}

// Pause meeting
export function usePauseMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingsApi.pauseMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      toast.success('Meeting paused');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to pause meeting');
    },
  });
}

// Resume meeting
export function useResumeMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingsApi.resumeMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      toast.success('Meeting resumed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resume meeting');
    },
  });
}

// Stop meeting
export function useStopMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingsApi.stopMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      toast.success('Meeting stopped');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to stop meeting');
    },
  });
}

// Meeting stats helper
export function useMeetingStats() {
  const { data: meetings } = useMeetings();

  if (!meetings) {
    return {
      total: 0,
      active: 0,
      completed: 0,
      totalMinutes: 0,
    };
  }

  const active = meetings.filter((m) => 
    ['running', 'recording', 'starting', 'pending'].includes(m.status.toLowerCase())
  ).length;

  const completed = meetings.filter((m) => 
    m.status.toLowerCase() === 'completed'
  ).length;

  const totalMinutes = meetings.reduce((acc, m) => {
    return acc + (m.actual_duration || m.meeting_duration || 0);
  }, 0);

  return {
    total: meetings.length,
    active,
    completed,
    totalMinutes,
  };
}
