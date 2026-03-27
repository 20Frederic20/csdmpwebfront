'use client';

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserAvatarDropdown } from "@/components/user-avatar-dropdown"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { PageTitleProvider, usePageTitle } from "@/components/page-title-provider"

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { pageTitle } = usePageTitle();

  return (
    <SidebarInset className="flex-1 relative overflow-hidden bg-white text-foreground">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        {pageTitle && (
          <h1 className="font-bold text-lg tracking-tight text-foreground">{pageTitle}</h1>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <ModeToggle />
          <UserAvatarDropdown />
        </div>
      </header>
      <main className="flex-1 p-0 relative z-10 overflow-y-auto">
        {children}
      </main>
    </SidebarInset>
  );
}

interface WithSidebarLayoutWrapperProps {
  children: React.ReactNode;
}

export function WithSidebarLayoutWrapper({ children }: WithSidebarLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <PageTitleProvider>
        <SidebarLayout>{children}</SidebarLayout>
      </PageTitleProvider>
    </SidebarProvider>
  );
}
