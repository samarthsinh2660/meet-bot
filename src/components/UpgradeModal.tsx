import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Crown, Check, Zap, Users, Loader2 } from 'lucide-react';
import type { BillingCycle } from '@/api/subscription';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsage?: number;
  maxUsage?: number;
  onUpgrade?: (planId: string, billingCycle: BillingCycle) => void;
  isLoading?: boolean;
}

const upgradePlans = [
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 1099,
    priceYearly: 899,
    features: [
      '60 hours per month',
      '120 meetings per month',
      'HD recording',
      'Advanced transcription',
      'Priority support',
    ],
    icon: Crown,
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    priceMonthly: 2999,
    priceYearly: 2699,
    features: [
      '300 hours per month',
      '600 meetings per month',
      'Team collaboration',
      'Custom branding',
      'API access',
    ],
    icon: Users,
    popular: false,
  },
];

export function UpgradeModal({
  open,
  onOpenChange,
  currentUsage = 5,
  maxUsage = 5,
  onUpgrade,
  isLoading = false,
}: UpgradeModalProps) {
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const getSavings = (plan: (typeof upgradePlans)[number]) => {
    const monthlyAnnual = plan.priceMonthly * 12;
    const yearlyAnnual = plan.priceYearly * 12;
    const savingsAnnual = monthlyAnnual - yearlyAnnual;
    const discountPercent = monthlyAnnual > 0 ? Math.round((savingsAnnual / monthlyAnnual) * 100) : 0;
    return { monthlyAnnual, yearlyAnnual, savingsAnnual, discountPercent };
  };

  const selectedPlanData = upgradePlans.find((p) => p.id === selectedPlan) ?? upgradePlans[0];
  const selectedPlanSavings = getSavings(selectedPlanData);

  const handleUpgrade = () => {
    if (onUpgrade) {
      const billingCycle: BillingCycle = isYearly ? 'yearly' : 'monthly';
      onUpgrade(selectedPlan, billingCycle);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-border/50 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
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

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="bg-green-500/20 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">
              Save {selectedPlanSavings.discountPercent}%
            </span>
          )}
        </div>

        {/* Plan options */}
        <div className="space-y-3">
          {upgradePlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-primary/50 glow-purple'
                  : 'border-border/30 hover:border-border/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <plan.icon className={`w-5 h-5 ${selectedPlan === plan.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-semibold text-foreground">{plan.name} Plan</span>
                  {plan.popular && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(isYearly ? plan.priceYearly : plan.priceMonthly)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /mo
                  </span>
                </div>
              </div>

              {isYearly && (
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Billed {formatPrice(plan.priceYearly * 12)}/year</span>
                  <span className="text-green-500">
                    Save {formatPrice(getSavings(plan).savingsAnnual)}/year ({getSavings(plan).discountPercent}% off)
                  </span>
                </div>
              )}

              <ul className="grid grid-cols-2 gap-1">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={handleUpgrade}
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
                Upgrade to {upgradePlans.find(p => p.id === selectedPlan)?.name}
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
