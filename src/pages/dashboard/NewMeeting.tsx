import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLaunchMeeting, useLaunchMultipleMeetings } from '@/hooks/useMeetings';
import { Bot, Loader2, Video, Clock, Info, Plus, X, Users } from 'lucide-react';

const singleMeetingSchema = z.object({
  meeting_url: z.string().url('Please enter a valid meeting URL'),
  // Duration in minutes (will be converted to hours in API layer)
  duration: z
    .coerce
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(480, 'Duration cannot exceed 8 hours'),
  // Optional meeting title (can be empty)
  title: z.string().optional(),
});

type SingleMeetingForm = z.infer<typeof singleMeetingSchema>;

export default function NewMeeting() {
  const navigate = useNavigate();
  const launchMeeting = useLaunchMeeting();
  const launchMultipleMeetings = useLaunchMultipleMeetings();
  
  // Multi-meeting state
  const [meetingUrls, setMeetingUrls] = useState<string[]>(['']);
  const [multiDuration, setMultiDuration] = useState(60);
  const [multiError, setMultiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SingleMeetingForm>({
    resolver: zodResolver(singleMeetingSchema),
    defaultValues: {
      duration: 60,
    },
  });

  const duration = watch('duration');

  const onSubmitSingle = (data: SingleMeetingForm) => {
    launchMeeting.mutate(
      {
        meetingUrl: data.meeting_url,
        durationMinutes: data.duration,
        title: data.title || undefined,
      },
      {
        onSuccess: () => {
          navigate('/dashboard/meetings');
        },
      }
    );
  };

  // Multi-meeting handlers
  const addMeetingUrl = () => {
    setMeetingUrls([...meetingUrls, '']);
  };

  const removeMeetingUrl = (index: number) => {
    if (meetingUrls.length > 1) {
      setMeetingUrls(meetingUrls.filter((_, i) => i !== index));
    }
  };

  const updateMeetingUrl = (index: number, value: string) => {
    const updated = [...meetingUrls];
    updated[index] = value;
    setMeetingUrls(updated);
  };

  const onSubmitMultiple = () => {
    setMultiError(null);
    
    // Filter out empty URLs and validate
    const validUrls = meetingUrls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      setMultiError('Please enter at least one meeting URL');
      return;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    const invalidUrls = validUrls.filter(url => !urlPattern.test(url));
    if (invalidUrls.length > 0) {
      setMultiError('Please enter valid URLs starting with http:// or https://');
      return;
    }

    launchMultipleMeetings.mutate(
      {
        meetingUrls: validUrls,
        // Still in minutes here; API layer converts to hours
        durationMinutes: multiDuration,
      },
      {
        onSuccess: () => {
          navigate('/dashboard/meetings');
        },
      }
    );
  };

  const presetDurations = [
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
    { label: '2 hours', value: 120 },
  ];

  return (
    <DashboardLayout
      title="Deploy New Bot"
      description="Send an AI bot to attend and record your meeting"
    >
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card border-border/50 glow-purple">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Deploy Meeting Bot</CardTitle>
            <CardDescription>
              Enter your meeting URL and the bot will join automatically to record
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="single">
                  <Video className="w-4 h-4 mr-2" />
                  Single Meeting
                </TabsTrigger>
                <TabsTrigger value="multiple">
                  <Users className="w-4 h-4 mr-2" />
                  Multiple Meetings
                </TabsTrigger>
              </TabsList>

              {/* Single Meeting Tab */}
              <TabsContent value="single">
                <form onSubmit={handleSubmit(onSubmitSingle)} className="space-y-6">
                  {/* Meeting URL */}
                  <div className="space-y-2">
                    <Label htmlFor="meeting_url" className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-primary" />
                      Meeting URL
                    </Label>
                    <Input
                      id="meeting_url"
                      type="url"
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="bg-secondary/50 border-border/50 focus:border-primary h-12"
                      {...register('meeting_url')}
                    />
                    {errors.meeting_url && (
                      <p className="text-sm text-destructive">{errors.meeting_url.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Supports Google Meet, Zoom, Microsoft Teams, and more
                    </p>
                  </div>

                  {/* Optional title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (optional)</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Team Standup - Dec 12"
                      className="bg-secondary/50 border-border/50 focus:border-primary h-10"
                      {...register('title')}
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Recording Duration
                    </Label>

                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-2">
                      {presetDurations.map((preset) => (
                        <Button
                          key={preset.value}
                          type="button"
                          variant={duration === preset.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setValue('duration', preset.value)}
                          className={duration === preset.value ? 'bg-primary' : ''}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>

                    {/* Custom duration input */}
                    <div className="flex items-center gap-3">
                      <Input
                        id="duration"
                        type="number"
                        min={1}
                        max={480}
                        className="bg-secondary/50 border-border/50 focus:border-primary w-24"
                        {...register('duration')}
                      />
                      <span className="text-muted-foreground">minutes</span>
                    </div>
                    {errors.duration && (
                      <p className="text-sm text-destructive">{errors.duration.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={launchMeeting.isPending}
                  >
                    {launchMeeting.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Deploying Bot...
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5" />
                        Deploy Bot
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Multiple Meetings Tab */}
              <TabsContent value="multiple">
                <div className="space-y-6">
                  {/* Meeting URLs */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Meeting URLs ({meetingUrls.filter(u => u.trim()).length} meetings)
                    </Label>
                    
                    <div className="space-y-2">
                      {meetingUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="url"
                            placeholder={`https://meet.google.com/meeting-${index + 1}`}
                            value={url}
                            onChange={(e) => updateMeetingUrl(index, e.target.value)}
                            className="bg-secondary/50 border-border/50 focus:border-primary flex-1"
                          />
                          {meetingUrls.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMeetingUrl(index)}
                              className="shrink-0"
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMeetingUrl}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Meeting
                    </Button>

                    {multiError && (
                      <p className="text-sm text-destructive">{multiError}</p>
                    )}
                  </div>

                  {/* Duration for all */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Duration (applies to all meetings)
                    </Label>

                    <div className="flex flex-wrap gap-2">
                      {presetDurations.map((preset) => (
                        <Button
                          key={preset.value}
                          type="button"
                          variant={multiDuration === preset.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMultiDuration(preset.value)}
                          className={multiDuration === preset.value ? 'bg-primary' : ''}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={1}
                        max={480}
                        value={multiDuration}
                        onChange={(e) => setMultiDuration(Number(e.target.value))}
                        className="bg-secondary/50 border-border/50 focus:border-primary w-24"
                      />
                      <span className="text-muted-foreground">minutes</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={onSubmitMultiple}
                    disabled={launchMultipleMeetings.isPending}
                  >
                    {launchMultipleMeetings.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Deploying {meetingUrls.filter(u => u.trim()).length} Bots...
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5" />
                        Deploy {meetingUrls.filter(u => u.trim()).length || 0} Bot(s)
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Info box */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 mt-6">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">How it works</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Bot joins your meeting as "Skriber Bot"</li>
                  <li>• Records video and audio in HD quality</li>
                  <li>• Generates transcript automatically</li>
                  <li>• Files are stored securely in your account</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                You can deploy multiple bots simultaneously to attend different meetings at the same time.
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">⏰ Timing</h4>
              <p className="text-sm text-muted-foreground">
                Deploy the bot a few minutes before your meeting starts for best results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
