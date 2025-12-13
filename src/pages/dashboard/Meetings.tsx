import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useRecordings, useDeleteRecording } from '@/hooks/useMeetings';
import { MEETING_STATUS_COLORS } from '@/api/types';
import {
  Video,
  Search,
  PlusCircle,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  Calendar,
  X,
  Filter,
  Trash2,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, formatDistanceToNow, isWithinInterval, startOfDay, endOfDay, subDays, subMonths } from 'date-fns';

type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

export default function Meetings() {
  const { data: recordingsData, isLoading } = useRecordings();
  const deleteRecording = useDeleteRecording();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Extract recordings array from response
  const recordings = recordingsData?.recordings || [];

  // Get date range based on preset
  const getDateRange = useMemo(() => {
    const now = new Date();
    switch (datePreset) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
      case 'month':
        return { start: startOfDay(subMonths(now, 1)), end: endOfDay(now) };
      case 'custom':
        if (startDate && endDate) {
          return { start: startOfDay(new Date(startDate)), end: endOfDay(new Date(endDate)) };
        }
        return null;
      default:
        return null;
    }
  }, [datePreset, startDate, endDate]);

  // Filter recordings
  const filteredRecordings = useMemo(() => {
    if (!recordings.length) return [];
    
    return recordings.filter((recording) => {
      // Search filter (by id, URL, or title)
      const lowerSearch = search.toLowerCase();
      const matchesSearch =
        recording.id.toLowerCase().includes(lowerSearch) ||
        recording.meeting_url.toLowerCase().includes(lowerSearch) ||
        (recording.meeting_title?.toLowerCase().includes(lowerSearch) ?? false);

      // Status filter
      const matchesStatus =
        statusFilter === 'all' || recording.status.toLowerCase() === statusFilter;

      // Date filter
      let matchesDate = true;
      if (getDateRange) {
        const recordingDate = new Date(recording.created_at);
        matchesDate = isWithinInterval(recordingDate, { start: getDateRange.start, end: getDateRange.end });
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [recordings, search, statusFilter, getDateRange]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (datePreset !== 'all') count++;
    return count;
  }, [statusFilter, datePreset]);

  const clearFilters = () => {
    setStatusFilter('all');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
  };

  const isProcessing = (status: string) => {
    return ['processing', 'pending'].includes(status.toLowerCase());
  };

  return (
    <DashboardLayout
      title="Meetings"
      description="View and manage all your meeting recordings"
    >
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/50 border-border/50"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative bg-secondary/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-3 h-3 mr-1" />
                      Clear all
                    </Button>
                  )}
                </div>
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
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
                </div>
                
                {/* Date Filter */}
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={datePreset} onValueChange={(v) => setDatePreset(v as DatePreset)}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Custom Date Range */}
                {datePreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">From</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">To</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Link to="/dashboard/new-meeting">
            <Button variant="hero">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Notetaker
            </Button>
          </Link>
        </div>
        
        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="hover:text-primary/80">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {datePreset !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                <Calendar className="w-3 h-3" />
                {datePreset === 'today' && 'Today'}
                {datePreset === 'week' && 'Last 7 days'}
                {datePreset === 'month' && 'Last 30 days'}
                {datePreset === 'custom' && startDate && endDate && `${startDate} - ${endDate}`}
                <button onClick={() => { setDatePreset('all'); setStartDate(''); setEndDate(''); }} className="hover:text-primary/80">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meetings Table */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredRecordings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Recording</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Duration</TableHead>
                    <TableHead className="text-muted-foreground">Created</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecordings.map((recording) => (
                    <TableRow key={recording.id} className="border-border/50">
                      <TableCell>
                        <Link
                          to={`/dashboard/recordings/${recording.id}`}
                          className="flex items-center gap-3 hover:bg-secondary/40 rounded-md p-1 -m-1"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground truncate max-w-[180px]">
                              {recording.meeting_title || `${recording.id.slice(0, 8)}...`}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {recording.meeting_url}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border ${
                              MEETING_STATUS_COLORS[recording.status.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {recording.status}
                          </span>
                          {recording.has_transcript && (
                            <span title="Has transcript">
                              <FileText className="w-3 h-3 text-green-500" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {recording.duration_minutes || 0} min
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>
                          <p>{format(new Date(recording.created_at), 'MMM d, yyyy')}</p>
                          <p className="text-xs">
                            {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isProcessing(recording.status) && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/dashboard/recordings/${recording.id}`}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={recording.meeting_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open Meeting URL
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteRecording.mutate(recording.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Recording
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
                  : 'Deploy your first notetaker to start recording meetings'}
              </p>
              <Link to="/dashboard/new-meeting">
                <Button variant="hero">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Deploy a Notetaker
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
