import { WithSidebarLayoutWrapper } from "@/components/with-sidebar-layout-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithSidebarLayoutWrapper>{children}</WithSidebarLayoutWrapper>;
}
