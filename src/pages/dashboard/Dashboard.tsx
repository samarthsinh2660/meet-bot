import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRecordings, useRecordingStats } from '@/hooks/useMeetings';
import { useAuth } from '@/context/AuthContext';
import { MEETING_STATUS_COLORS } from '@/api/types';
import { Link } from 'react-router-dom';
import {
  Video,
  Bot,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Loader2,
  Activity,
  Crown,
  Zap,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UsageBanner } from '@/components/UsageBanner';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useUsage, useCreateCheckout } from '@/hooks/useSubscription';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: recordingsData, isLoading } = useRecordings();
  const { data: stats } = useRecordingStats();
  const { data: usage } = useUsage();
  const createCheckout = useCreateCheckout();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Extract recordings array
  const recordings = recordingsData?.recordings || [];

  // Mock usage data for UI (will be replaced by real API data)
  const currentUsage = usage?.meetings_used ?? stats?.total_recordings ?? 0;
  const maxUsage = usage?.meetings_limit ?? 5;
  const planName = usage?.plan_name ?? 'free';
  const canRecord = usage?.can_record ?? (currentUsage < maxUsage);

  const handleUpgrade = () => {
    createCheckout.mutate('pro');
  };

  // Get recent recordings (last 5)
  const recentRecordings = recordings.slice(0, 5);

  // Get processing recordings
  const processingRecordings = recordings.filter((r) =>
    ['processing', 'pending'].includes(r.status.toLowerCase())
  );

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.username || 'User'}`}
      description="Here's what's happening with your meetings"
    >
      {/* Usage Banner for Free Trial Users */}
      <UsageBanner
        currentUsage={currentUsage}
        maxUsage={maxUsage}
        planName={planName}
        onUpgrade={() => setShowUpgradeModal(true)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentUsage={currentUsage}
        maxUsage={maxUsage}
        onUpgrade={handleUpgrade}
        isLoading={createCheckout.isPending}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Meetings
            </CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.total_recordings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All time recordings</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Notetakers
            </CardTitle>
            <Bot className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{processingRecordings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently processing</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.completed_recordings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully recorded</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Minutes
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.total_duration_minutes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Minutes recorded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Notetakers */}
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Notetakers</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Currently running meeting notetakers
              </p>
            </div>
            <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : processingRecordings.length > 0 ? (
              <div className="space-y-3">
                {processingRecordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {recording.meeting_title || `${recording.id.slice(0, 12)}...`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        MEETING_STATUS_COLORS[recording.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {recording.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No active notetakers</p>
                <Link to="/dashboard/new-meeting">
                  <Button variant="outline" size="sm" className="mt-3">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Deploy a notetaker
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Meetings */}
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Meetings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your latest recorded meetings
              </p>
            </div>
            <Link to="/dashboard/meetings">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentRecordings.length > 0 ? (
              <div className="space-y-3">
                {recentRecordings.map((recording) => (
                  <Link
                    key={recording.id}
                    to={`/dashboard/recordings/${recording.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                          {recording.meeting_title || `${recording.id.slice(0, 12)}...`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        MEETING_STATUS_COLORS[recording.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {recording.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No meetings yet</p>
                <Link to="/dashboard/new-meeting">
                  <Button variant="outline" size="sm" className="mt-3">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Start your first notetaker
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Card className="mt-6 glass-card border-border/50 glow-purple">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ready to record a meeting?</h3>
              <p className="text-sm text-muted-foreground">
                Deploy a notetaker to attend and record your meeting automatically
              </p>
            </div>
          </div>
          <Link to="/dashboard/new-meeting" className="w-full sm:w-auto">
            <Button variant="hero" className="w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Notetaker
            </Button>
          </Link>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
