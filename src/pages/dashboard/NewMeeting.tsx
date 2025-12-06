import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useStartMeeting } from '@/hooks/useMeetings';
import { Bot, Loader2, Video, Clock, Info } from 'lucide-react';

const newMeetingSchema = z.object({
  meeting_url: z.string().url('Please enter a valid meeting URL'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute').max(480, 'Duration cannot exceed 8 hours'),
});

type NewMeetingForm = z.infer<typeof newMeetingSchema>;

export default function NewMeeting() {
  const navigate = useNavigate();
  const startMeeting = useStartMeeting();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewMeetingForm>({
    resolver: zodResolver(newMeetingSchema),
    defaultValues: {
      duration: 60,
    },
  });

  const duration = watch('duration');

  const onSubmit = (data: NewMeetingForm) => {
    startMeeting.mutate({
      meeting_url: data.meeting_url,
      duration: data.duration,
    }, {
      onSuccess: () => {
        navigate('/dashboard/meetings');
      },
    });
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Info box */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
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

              {/* Submit */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={startMeeting.isPending}
              >
                {startMeeting.isPending ? (
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
