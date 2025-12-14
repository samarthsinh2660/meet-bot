import { Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UsageBannerProps {
  currentUsage: number;
  maxUsage: number;
  planName: string;
  onUpgrade?: () => void;
}

export function UsageBanner({
  currentUsage,
  maxUsage,
  planName,
  onUpgrade,
}: UsageBannerProps) {
  const usagePercent = Math.min((currentUsage / maxUsage) * 100, 100);
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = currentUsage >= maxUsage;

  if (planName !== 'free') return null;

  return (
    <div className={`glass-card rounded-xl p-4 mb-6 border ${
      isAtLimit 
        ? 'border-destructive/50 bg-destructive/5' 
        : isNearLimit 
          ? 'border-yellow-500/50 bg-yellow-500/5'
          : 'border-border/50'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${isAtLimit ? 'text-destructive' : 'text-primary'}`} />
            <span className="font-medium text-foreground">
              {isAtLimit ? 'Free trial limit reached' : 'Free Trial'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-xs">
              <Progress 
                value={usagePercent} 
                className={`h-2 ${isAtLimit ? '[&>div]:bg-destructive' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentUsage}/{maxUsage} meetings
            </span>
          </div>
          
          {isAtLimit && (
            <p className="text-sm text-muted-foreground mt-2">
              Upgrade to Pro to continue recording meetings
            </p>
          )}
        </div>

        <Button 
          variant={isAtLimit ? "hero" : "outline"} 
          size="sm"
          onClick={onUpgrade}
          className="shrink-0"
        >
          <Crown className="w-4 h-4 mr-2" />
          {isAtLimit ? 'Upgrade Now' : 'Upgrade'}
        </Button>
      </div>
    </div>
  );
}

export default UsageBanner;
