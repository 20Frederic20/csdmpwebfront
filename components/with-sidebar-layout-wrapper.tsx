'use client';

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserAvatarDropdown } from "@/components/user-avatar-dropdown"

interface WithSidebarLayoutWrapperProps {
  children: React.ReactNode;
}

export function WithSidebarLayoutWrapper({ children }: WithSidebarLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <UserAvatarDropdown />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
