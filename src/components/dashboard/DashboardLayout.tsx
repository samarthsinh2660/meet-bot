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
      
      {/* Main content - offset by sidebar width */}
      <div className={cn(
        'transition-all duration-300',
        collapsed ? 'pl-16' : 'pl-64'
      )}>
        <DashboardHeader title={title} description={description} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
