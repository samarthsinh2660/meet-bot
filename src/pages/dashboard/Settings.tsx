import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useChangePassword } from '@/hooks/useAuth';
import { useSubscription, useUsage, useCreateCheckout, useCancelSubscription, useCustomerPortal } from '@/hooks/useSubscription';
import { User, Lock, Bell, Shield, Loader2, Eye, EyeOff, Check, Crown, Zap, CreditCard, Calendar, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import type { BillingCycle } from '@/api/subscription';

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user } = useAuth();
  const changePassword = useChangePassword();
  const { data: subscription } = useSubscription();
  const { data: usage } = useUsage();
  const createCheckout = useCreateCheckout();
  const cancelSubscription = useCancelSubscription();
  const customerPortal = useCustomerPortal();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Subscription data
  const isPro = subscription?.plan_id === 'pro' && subscription?.status === 'active';
  const isTeam = subscription?.plan_id === 'team' && subscription?.status === 'active';
  const isPaid = isPro || isTeam;
  const isTrial = subscription?.status === 'trial' || usage?.is_trial;
  const isCancelled = subscription?.cancel_at_period_end;
  const meetingsUsed = usage?.meetings_used ?? 0;
  const meetingsLimit = usage?.meetings_limit ?? 5;
  const usagePercent = Math.min((meetingsUsed / meetingsLimit) * 100, 100);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  // Plan display info
  const getPlanInfo = () => {
    if (isTeam) return { name: 'Team Plan', price: '₹2,699/year', meetings: '600 meetings/month', icon: Users };
    if (isPro) return { name: 'Pro Plan', price: '₹899/year', meetings: '120 meetings/month', icon: Crown };
    return { name: 'Free Trial', price: 'Free', meetings: '5 meetings total', icon: Zap };
  };
  const planInfo = getPlanInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  const onPasswordSubmit = (data: PasswordForm) => {
    changePassword.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <DashboardLayout
      title="Settings"
      description="Manage your account settings and preferences"
    >
      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{user?.username}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={user?.username || ''}
                  disabled
                  className="bg-secondary/30 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-secondary/30 border-border/50"
                />
              </div>
            </div>

            {user?.social_accounts && user.social_accounts.length > 0 && (
              <div>
                <Label className="mb-2 block">Connected Accounts</Label>
                <div className="flex flex-wrap gap-2">
                  {user.social_accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 border border-border/50"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm capitalize">{account.provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card className={`glass-card border-border/50 ${isPro ? 'glow-purple' : ''}`}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <CardTitle>Subscription</CardTitle>
            </div>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Plan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPaid ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <planInfo.icon className={`w-6 h-6 ${isPaid ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{planInfo.name}</h4>
                    {isCancelled && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">Cancelling</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {planInfo.price} • {planInfo.meetings}
                  </p>
                </div>
              </div>
              {!isPaid ? (
                <Button 
                  variant="hero" 
                  onClick={() => createCheckout.mutate({ planId: 'pro', billingCycle })}
                  disabled={createCheckout.isPending}
                  className="w-full sm:w-auto"
                >
                  {createCheckout.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => customerPortal.mutate()}
                  disabled={customerPortal.isPending}
                  className="w-full sm:w-auto"
                >
                  Manage Billing
                </Button>
              )}
            </div>

            {/* Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Meetings used this {isPaid ? 'month' : 'trial'}</span>
                <span className="text-sm font-medium text-foreground">{meetingsUsed} / {meetingsLimit}</span>
              </div>
              <Progress value={usagePercent} className="h-2" />
              {isPaid && subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground mt-2">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Resets on {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                </p>
              )}
            </div>

            {/* Cancel/Resume Subscription */}
            {isPaid && (
              <>
                <Separator className="bg-border/50" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {isCancelled ? 'Resume Subscription' : 'Cancel Subscription'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isCancelled 
                        ? 'Your subscription will end at the current period. Resume to continue.' 
                        : 'You can cancel anytime. Access continues until period end.'}
                    </p>
                  </div>
                  {isCancelled ? (
                    <Button 
                      variant="outline"
                      onClick={() => cancelSubscription.mutate()}
                      disabled={cancelSubscription.isPending}
                      className="w-full sm:w-auto"
                    >
                      Resume
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive w-full sm:w-auto"
                      onClick={() => cancelSubscription.mutate()}
                      disabled={cancelSubscription.isPending}
                    >
                      Cancel Plan
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="bg-secondary/50 border-border/50 pr-10"
                    {...register('current_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.current_password && (
                  <p className="text-sm text-destructive">{errors.current_password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    className="bg-secondary/50 border-border/50 pr-10"
                    {...register('new_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                </p>
                {errors.new_password && (
                  <p className="text-sm text-destructive">{errors.new_password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  className="bg-secondary/50 border-border/50"
                  {...register('confirm_password')}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
                )}
              </div>

              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email when recordings complete</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Meeting Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified before scheduled meetings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notetaker Status Updates</p>
                <p className="text-sm text-muted-foreground">Notifications when notetaker joins or leaves</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
