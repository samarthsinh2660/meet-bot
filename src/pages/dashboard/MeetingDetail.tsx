import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecording, useDeleteRecording, useTranscript } from '@/hooks/useMeetings';
import { MEETING_STATUS_COLORS } from '@/api/types';
import {
  ArrowLeft,
  Video,
  Clock,
  Calendar,
  ExternalLink,
  Loader2,
  FileText,
  Bot,
  Download,
  Search,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Helper to format seconds to MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function RecordingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recording, isLoading } = useRecording(id || '');
  const { data: transcriptData } = useTranscript(id || '');
  const deleteRecording = useDeleteRecording();
  
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const copyRecordingId = () => {
    if (recording?.id) {
      navigator.clipboard.writeText(recording.id);
      setCopied(true);
      toast.success('Recording ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (recording?.id) {
      deleteRecording.mutate(recording.id, {
        onSuccess: () => navigate('/dashboard/meetings'),
      });
    }
  };

  // Filter transcript segments by search
  const filteredTranscript = useMemo(() => {
    if (!transcriptData?.transcript) return [];
    if (!transcriptSearch) return transcriptData.transcript;
    
    return transcriptData.transcript.filter(segment =>
      segment.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      segment.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
    );
  }, [transcriptData, transcriptSearch]);

  if (isLoading) {
    return (
      <DashboardLayout title="Recording Details">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!recording) {
    return (
      <DashboardLayout title="Recording Not Found">
        <div className="text-center py-16">
          <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Recording not found</h3>
          <p className="text-muted-foreground mb-4">
            This recording may have been deleted or doesn't exist.
          </p>
          <Link to="/dashboard/meetings">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recordings
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const status = recording.status.toLowerCase();
  const isReady = status === 'completed' || status === 'ready';
  const isProcessing = ['processing', 'pending', 'recording'].includes(status);
  const hasVideo = !!recording.video_url;
  const hasTranscript = !!(transcriptData?.transcript?.length) || !!(recording.transcript?.segments?.length);

  const displayTitle = recording.meeting_title || `Recording ${recording.id.slice(0, 8)}...`;

  return (
    <DashboardLayout
      title={displayTitle}
      description={recording.meeting_url}
    >
      <Link to="/dashboard/meetings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Recordings
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Recording Header Card */}
          <Card className="glass-card border-border/50">
            <CardHeader className="flex flex-col sm:flex-row items-start gap-4 sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl truncate">{displayTitle}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={copyRecordingId}
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <a
                    href={recording.meeting_url}
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
                  MEETING_STATUS_COLORS[recording.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {recording.status}
              </span>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {recording.duration_minutes || 0} min
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Created</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {format(new Date(recording.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                {recording.completed_at && (
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Completed</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {formatDistanceToNow(new Date(recording.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteRecording.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Recording
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Video & Transcript Section - show when ready or has video */}
          {(isReady || hasVideo) && (
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Recording & Transcript
                </CardTitle>
                <CardDescription>
                  View your meeting recording and transcript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="video" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 h-auto">
                    <TabsTrigger value="video" className="text-xs sm:text-sm py-2">
                      <Video className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Video</span>
                    </TabsTrigger>
                    <TabsTrigger value="transcript" className="text-xs sm:text-sm py-2">
                      <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Transcript</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Video Player Tab */}
                  <TabsContent value="video" className="space-y-4">
                    {hasVideo ? (
                      <>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <video
                            src={recording.video_url}
                            controls
                            className="w-full h-full"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={recording.video_url} download>
                                <Download className="w-4 h-4 mr-2" />
                                Download Video
                              </a>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Duration: {recording.duration_minutes || 0} min
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="aspect-video bg-secondary/50 rounded-lg border border-border/50 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-muted-foreground/50 mb-3 animate-spin" />
                        <p className="text-muted-foreground font-medium">Video Processing</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                          Your video is being processed and will be available soon
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Transcript Tab */}
                  <TabsContent value="transcript" className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search transcript..."
                          value={transcriptSearch}
                          onChange={(e) => setTranscriptSearch(e.target.value)}
                          className="pl-9 bg-secondary/50 border-border/50"
                        />
                      </div>
                      <Button variant="outline" size="sm" disabled={!hasTranscript}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="min-h-[300px] max-h-[500px] overflow-y-auto bg-secondary/30 rounded-lg border border-border/50 p-4">
                      {hasTranscript && filteredTranscript.length > 0 ? (
                        <div className="space-y-4">
                          {filteredTranscript.map((segment, index) => (
                            <div key={index} className="flex gap-3">
                              <span className="text-xs text-primary font-mono shrink-0">
                                {formatTime(segment.start_time)}
                              </span>
                              <div>
                                <p className="text-xs font-medium text-foreground">{segment.speaker}</p>
                                <p className="text-sm text-muted-foreground">{segment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : hasTranscript && transcriptSearch ? (
                        <div className="flex flex-col items-center justify-center h-full py-8">
                          <Search className="w-12 h-12 text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground">No matches found</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8">
                          <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground font-medium">No Transcript Available</p>
                          <p className="text-sm text-muted-foreground/70 mt-1">
                            Transcript was not generated for this recording
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
          
          {/* Processing State */}
          {isProcessing && (
            <Card className="glass-card border-border/50">
              <CardContent className="py-8">
                <div className="flex flex-col items-center text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Processing Recording</h3>
                  <p className="text-sm text-muted-foreground">
                    Your recording is being processed. Video and transcript will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recording Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Title</p>
                <p className="text-sm text-foreground break-all">
                  {recording.meeting_title || 'Untitled meeting'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Recording ID</p>
                <p className="text-sm font-mono text-foreground break-all">{recording.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Meeting URL</p>
                <p className="text-sm font-mono text-foreground break-all">{recording.meeting_url}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                <p className="text-sm text-foreground capitalize">{recording.status}</p>
              </div>
              {recording.transcript && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Transcript Status</p>
                  <p className="text-sm text-foreground capitalize">{recording.transcript.status}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50 glow-purple">
            <CardContent className="p-6 text-center">
              <Bot className="w-12 h-12 text-primary mx-auto mb-3" />
              <h4 className="font-medium text-foreground mb-2">Record another meeting?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start a new recording for your next meeting
              </p>
              <Link to="/dashboard/new-meeting">
                <Button variant="hero" size="sm" className="w-full">
                  New Recording
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
