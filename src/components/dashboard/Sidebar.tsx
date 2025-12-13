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
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300',
        'bg-card border-r border-border',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-border',
          collapsed ? 'justify-center' : 'gap-2'
        )}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-foreground tracking-tight">Skriber</span>
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
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-secondary/80',
                  isActive && 'bg-primary/10 text-primary border border-primary/20',
                  !isActive && 'text-muted-foreground hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className={cn('w-full', collapsed && 'px-2')}
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
  );
}

export default Sidebar;
