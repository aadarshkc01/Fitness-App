import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AppSidebar from './AppSidebar';
import FloatingAssistant from './FloatingAssistant';

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function AppShell({ children, title, subtitle, action }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
        <main className="flex-1 p-6">{children}</main>
        <FloatingAssistant />
      </SidebarInset>
    </SidebarProvider>
  );
}
