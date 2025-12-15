import { useState } from "react";
import { Check, Zap, Crown, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { isAuthenticated } from "@/api/client";
import { useCreateCheckout } from "@/hooks/useSubscription";
import type { BillingCycle } from "@/api/subscription";

const plans = [
  {
    id: "free",
    name: "Free Trial",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfect for trying out Skriber",
    features: [
      "2 hours per month",
      "5 meetings per month",
      "Basic recording",
      "Email support",
    ],
    limitations: [
      "Limited to 5 meetings",
    ],
    cta: "Start Free",
    ctaLink: "/auth/register",
    popular: false,
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 1099,
    priceYearly: 899,
    description: "For professionals",
    features: [
      "60 hours per month",
      "120 meetings per month",
      "HD recording",
      "Advanced transcription",
      "Calendar integration",
      "Priority support",
      "Export recordings",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    ctaLink: "/auth/register",
    popular: true,
    icon: Crown,
  },
  {
    id: "team",
    name: "Team",
    priceMonthly: 2999,
    priceYearly: 2699,
    description: "For growing teams",
    features: [
      "300 hours per month",
      "600 meetings per month",
      "HD recording",
      "Advanced transcription",
      "Calendar integration",
      "Priority support",
      "Export recordings",
      "Team collaboration",
      "Custom branding",
      "API access",
    ],
    limitations: [],
    cta: "Upgrade to Team",
    ctaLink: "/auth/register",
    popular: false,
    icon: Users,
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  const createCheckout = useCreateCheckout();
  const authenticated = isAuthenticated();

  const handleUpgrade = (planId: string) => {
    if (planId !== "free") {
      const billingCycle: BillingCycle = isYearly ? "yearly" : "monthly";
      createCheckout.mutate({ planId, billingCycle });
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getSavings = (plan: (typeof plans)[number]) => {
    if (plan.id === 'free') return null;
    const monthlyAnnual = plan.priceMonthly * 12;
    const yearlyAnnual = plan.priceYearly * 12;
    const savingsAnnual = monthlyAnnual - yearlyAnnual;
    const discountPercent = monthlyAnnual > 0 ? Math.round((savingsAnnual / monthlyAnnual) * 100) : 0;
    return { monthlyAnnual, yearlyAnnual, savingsAnnual, discountPercent };
  };

  const maxDiscountPercent = Math.max(
    0,
    ...plans
      .filter((p) => p.id !== 'free')
      .map((p) => getSavings(p)?.discountPercent ?? 0)
  );
  return (
    <section id="pricing" className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Pricing</span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            <span className="text-foreground">Simple, </span>
            <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-green-500/20 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">
                Save up to {maxDiscountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`glass-card rounded-2xl p-6 sm:p-8 relative animate-slide-in flex flex-col ${
                plan.popular 
                  ? 'border-primary/50 glow-purple' 
                  : 'border-border/50'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-primary/20' : 'bg-secondary'
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {formatPrice(isYearly ? plan.priceYearly : plan.priceMonthly)}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.id === "free" ? "" : "/mo"}
                  </span>
                </div>
                {plan.id !== "free" && isYearly && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed {formatPrice(plan.priceYearly * 12)}/year
                  </p>
                )}
                {plan.id !== "free" && isYearly && getSavings(plan) && (
                  <p className="text-xs text-green-500 mt-1">
                    Save {formatPrice(getSavings(plan)!.savingsAnnual)}/year ({getSavings(plan)!.discountPercent}% off)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-primary/20' : 'bg-secondary'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-center gap-3 opacity-60">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-secondary">
                      <span className="w-2 h-0.5 bg-muted-foreground rounded" />
                    </div>
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {authenticated && plan.id !== "free" ? (
                  <Button 
                    variant={plan.popular ? "hero" : "outline"}
                    className="w-full"
                    size="lg"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={createCheckout.isPending}
                  >
                    {createCheckout.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                ) : (
                  <Link to={plan.ctaLink} className="block">
                    <Button 
                      variant={plan.popular ? "hero" : "outline"} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Trusted payment processing</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-xs">Secure</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span className="text-xs">Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span className="text-xs">Protected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
