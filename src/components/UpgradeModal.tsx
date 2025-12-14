import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Zap, Loader2 } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsage?: number;
  maxUsage?: number;
  onUpgrade?: () => void;
  isLoading?: boolean;
}

export function UpgradeModal({
  open,
  onOpenChange,
  currentUsage = 5,
  maxUsage = 5,
  onUpgrade,
  isLoading = false,
}: UpgradeModalProps) {
  const features = [
    "50 meetings per month",
    "Unlimited duration",
    "HD video recording",
    "Auto transcription",
    "Priority support",
    "Advanced analytics",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-base">
            You've used all {maxUsage} free meetings. Upgrade to continue recording.
          </DialogDescription>
        </DialogHeader>

        {/* Usage indicator */}
        <div className="my-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Meetings used</span>
            <span className="font-medium text-foreground">{currentUsage}/{maxUsage}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min((currentUsage / maxUsage) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Pro plan highlight */}
        <div className="glass-card rounded-xl p-4 border-primary/30 glow-purple">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Pro Plan</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">₹1,085</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={onUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground"
          >
            Maybe later
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Secure payment • Cancel anytime • Instant access
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default UpgradeModal;
