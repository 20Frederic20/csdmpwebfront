'use client';

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserAvatarDropdown } from "@/components/user-avatar-dropdown"
import { ModeToggle } from "@/components/mode-toggle"

interface WithSidebarLayoutWrapperProps {
  children: React.ReactNode;
}

export function WithSidebarLayoutWrapper({ children }: WithSidebarLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 relative overflow-hidden bg-white text-slate-900 dashboard-content">
        <div className="noise opacity-[0.015]" />
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-100 px-4 bg-white/70 backdrop-blur-md sticky top-0 z-40">
          <SidebarTrigger className="-ml-1 text-slate-500" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserAvatarDropdown />
          </div>
        </header>
        <main className="flex-1 p-6 relative z-10 bg-white dashboard-content">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
