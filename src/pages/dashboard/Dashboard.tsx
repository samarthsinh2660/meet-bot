import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMeetings, useMeetingStats } from '@/hooks/useMeetings';
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
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: meetings, isLoading } = useMeetings();
  const stats = useMeetingStats();

  // Get recent meetings (last 5)
  const recentMeetings = meetings?.slice(0, 5) || [];

  // Get active meetings
  const activeMeetings = meetings?.filter((m) =>
    ['running', 'recording', 'starting', 'pending'].includes(m.status.toLowerCase())
  ) || [];

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.username || 'User'}`}
      description="Here's what's happening with your meetings"
    >
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
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time meetings recorded</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bots
            </CardTitle>
            <Bot className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently recording</p>
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
            <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
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
            <div className="text-3xl font-bold text-foreground">{stats.totalMinutes}</div>
            <p className="text-xs text-muted-foreground mt-1">Minutes recorded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Bots */}
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Bots</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Currently running meeting bots
              </p>
            </div>
            <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : activeMeetings.length > 0 ? (
              <div className="space-y-3">
                {activeMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {meeting.meeting_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started {formatDistanceToNow(new Date(meeting.meeting_created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        MEETING_STATUS_COLORS[meeting.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No active bots</p>
                <Link to="/dashboard/new-meeting">
                  <Button variant="outline" size="sm" className="mt-3">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Deploy a bot
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
            ) : recentMeetings.length > 0 ? (
              <div className="space-y-3">
                {recentMeetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    to={`/dashboard/meetings/${meeting.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                          {meeting.meeting_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(meeting.meeting_created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        MEETING_STATUS_COLORS[meeting.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {meeting.status}
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
                    Start your first bot
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Card className="mt-6 glass-card border-border/50 glow-purple">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ready to record a meeting?</h3>
              <p className="text-sm text-muted-foreground">
                Deploy a bot to attend and record your meeting automatically
              </p>
            </div>
          </div>
          <Link to="/dashboard/new-meeting">
            <Button variant="hero">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Bot
            </Button>
          </Link>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
