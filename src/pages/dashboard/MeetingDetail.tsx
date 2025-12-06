import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMeeting, useStopMeeting, usePauseMeeting, useResumeMeeting } from '@/hooks/useMeetings';
import { MEETING_STATUS_COLORS } from '@/api/types';
import {
  ArrowLeft,
  Video,
  Clock,
  Calendar,
  ExternalLink,
  Play,
  Pause,
  Square,
  Loader2,
  FileText,
  Bot,
  Activity,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: meeting, isLoading } = useMeeting(id || '');
  const stopMeeting = useStopMeeting();
  const pauseMeeting = usePauseMeeting();
  const resumeMeeting = useResumeMeeting();

  if (isLoading) {
    return (
      <DashboardLayout title="Meeting Details">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!meeting) {
    return (
      <DashboardLayout title="Meeting Not Found">
        <div className="text-center py-16">
          <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Meeting not found</h3>
          <p className="text-muted-foreground mb-4">
            This meeting may have been deleted or doesn't exist.
          </p>
          <Link to="/dashboard/meetings">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Meetings
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isActive = ['running', 'recording', 'starting', 'pending', 'paused'].includes(
    meeting.status.toLowerCase()
  );
  const isPaused = meeting.status.toLowerCase() === 'paused';
  const isCompleted = meeting.status.toLowerCase() === 'completed';

  const handleStop = () => {
    stopMeeting.mutate(meeting.meeting_id, {
      onSuccess: () => navigate('/dashboard/meetings'),
    });
  };

  return (
    <DashboardLayout
      title="Meeting Details"
      description={`Meeting ID: ${meeting.meeting_id}`}
    >
      <Link to="/dashboard/meetings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Meetings
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Video className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{meeting.meeting_id}</CardTitle>
                  <a
                    href={meeting.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                  >
                    Open meeting link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <span
                className={`text-sm px-3 py-1.5 rounded-full border ${
                  MEETING_STATUS_COLORS[meeting.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {meeting.status}
              </span>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {meeting.actual_duration || meeting.meeting_duration || 0} min
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Created</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {format(new Date(meeting.meeting_created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs">Last Updated</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDistanceToNow(new Date(meeting.meeting_updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {meeting.meeting_started_at && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Started:</span>{' '}
                    {format(new Date(meeting.meeting_started_at), 'PPpp')}
                  </p>
                  {meeting.meeting_ended_at && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">Ended:</span>{' '}
                      {format(new Date(meeting.meeting_ended_at), 'PPpp')}
                    </p>
                  )}
                </div>
              )}

              {isActive && (
                <div className="flex items-center gap-3">
                  {isPaused ? (
                    <Button
                      onClick={() => resumeMeeting.mutate(meeting.meeting_id)}
                      disabled={resumeMeeting.isPending}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resume Recording
                    </Button>
                  ) : meeting.status.toLowerCase() === 'running' || meeting.status.toLowerCase() === 'recording' ? (
                    <Button
                      variant="outline"
                      onClick={() => pauseMeeting.mutate(meeting.meeting_id)}
                      disabled={pauseMeeting.isPending}
                      className="flex-1"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : null}
                  <Button
                    variant="destructive"
                    onClick={handleStop}
                    disabled={stopMeeting.isPending}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Bot
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {isCompleted && (
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recording & Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Recording and transcript files will appear here once processing is complete.</p>
                  <p className="text-sm mt-2">Files are stored securely in your S3 bucket.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.bot_logs && (
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Bot Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-muted-foreground bg-secondary/50 p-4 rounded-lg overflow-x-auto max-h-64 overflow-y-auto">
                  {meeting.bot_logs}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Meeting Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Meeting ID</p>
                <p className="text-sm font-mono text-foreground break-all">{meeting.meeting_id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Record ID</p>
                <p className="text-sm font-mono text-foreground break-all">{meeting.id}</p>
              </div>
              {meeting.container_id && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Container</p>
                  <p className="text-sm font-mono text-foreground break-all">{meeting.container_id.slice(0, 12)}</p>
                </div>
              )}
              {meeting.port && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Port</p>
                  <p className="text-sm font-mono text-foreground">{meeting.port}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50 glow-purple">
            <CardContent className="p-6 text-center">
              <Bot className="w-12 h-12 text-primary mx-auto mb-3" />
              <h4 className="font-medium text-foreground mb-2">Need another bot?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Deploy a new bot to record another meeting
              </p>
              <Link to="/dashboard/new-meeting">
                <Button variant="hero" size="sm" className="w-full">
                  Deploy New Bot
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
