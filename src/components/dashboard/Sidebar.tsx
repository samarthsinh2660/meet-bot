import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Video,
  PlusCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Meetings',
    href: '/dashboard/meetings',
    icon: Video,
  },
  {
    label: 'New Notetaker',
    href: '/dashboard/new-meeting',
    icon: PlusCircle,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen transition-all duration-300',
          'bg-card border-r border-border',
          // Desktop: show based on collapsed state
          'hidden lg:block',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          // Mobile: show/hide based on mobileOpen
          mobileOpen && 'block w-64'
        )}
      >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-border',
          collapsed && !mobileOpen ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="text-xl font-bold text-foreground tracking-tight">Skriber</span>
            )}
          </div>
          {/* Mobile close button */}
          {mobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-secondary/80',
                  isActive && 'bg-primary/10 text-primary border border-primary/20',
                  !isActive && 'text-muted-foreground hover:text-foreground',
                  collapsed && !mobileOpen && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                {(!collapsed || mobileOpen) && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => {
              handleNavClick();
              logout();
            }}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              collapsed && !mobileOpen && 'justify-center px-2'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span className="font-medium">Logout</span>}
          </button>

          {/* Collapse toggle - only on desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className={cn('w-full hidden lg:flex', collapsed && 'px-2')}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
