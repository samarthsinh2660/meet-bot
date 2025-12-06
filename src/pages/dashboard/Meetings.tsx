import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMeetings, useStopMeeting, usePauseMeeting, useResumeMeeting } from '@/hooks/useMeetings';
import { MEETING_STATUS_COLORS } from '@/api/types';
import {
  Video,
  Search,
  PlusCircle,
  Loader2,
  Play,
  Pause,
  Square,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNow } from 'date-fns';

export default function Meetings() {
  const { data: meetings, isLoading } = useMeetings();
  const stopMeeting = useStopMeeting();
  const pauseMeeting = usePauseMeeting();
  const resumeMeeting = useResumeMeeting();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter meetings
  const filteredMeetings = meetings?.filter((meeting) => {
    const matchesSearch =
      meeting.meeting_id.toLowerCase().includes(search.toLowerCase()) ||
      meeting.meeting_url.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || meeting.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const isActiveStatus = (status: string) => {
    return ['running', 'recording', 'starting', 'pending', 'paused'].includes(status.toLowerCase());
  };

  return (
    <DashboardLayout
      title="Meetings"
      description="View and manage all your meeting recordings"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="recording">Recording</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Link to="/dashboard/new-meeting">
          <Button variant="hero">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Bot
          </Button>
        </Link>
      </div>

      {/* Meetings Table */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMeetings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Meeting</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Duration</TableHead>
                    <TableHead className="text-muted-foreground">Created</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id} className="border-border/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{meeting.meeting_id}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {meeting.meeting_url}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border ${
                            MEETING_STATUS_COLORS[meeting.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {meeting.actual_duration || meeting.meeting_duration || 0} min
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>
                          <p>{format(new Date(meeting.meeting_created_at), 'MMM d, yyyy')}</p>
                          <p className="text-xs">
                            {formatDistanceToNow(new Date(meeting.meeting_created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isActiveStatus(meeting.status) && (
                            <>
                              {meeting.status.toLowerCase() === 'paused' ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => resumeMeeting.mutate(meeting.meeting_id)}
                                  disabled={resumeMeeting.isPending}
                                >
                                  <Play className="w-4 h-4 text-green-500" />
                                </Button>
                              ) : meeting.status.toLowerCase() !== 'pending' && meeting.status.toLowerCase() !== 'starting' ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => pauseMeeting.mutate(meeting.meeting_id)}
                                  disabled={pauseMeeting.isPending}
                                >
                                  <Pause className="w-4 h-4 text-orange-500" />
                                </Button>
                              ) : null}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => stopMeeting.mutate(meeting.meeting_id)}
                                disabled={stopMeeting.isPending}
                              >
                                <Square className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/dashboard/meetings/${meeting.id}`}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={meeting.meeting_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open Meeting URL
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No meetings found</h3>
              <p className="text-muted-foreground mb-4">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Deploy your first bot to start recording meetings'}
              </p>
              <Link to="/dashboard/new-meeting">
                <Button variant="hero">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Deploy a Bot
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
