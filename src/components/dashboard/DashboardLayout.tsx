import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/SidebarContext';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main content - offset by sidebar width on desktop, full width on mobile */}
      <div className={cn(
        'transition-all duration-300',
        // No left padding on mobile, sidebar padding on desktop
        'pl-0 lg:pl-64',
        collapsed && 'lg:pl-16'
      )}>
        <DashboardHeader title={title} description={description} />
        
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
