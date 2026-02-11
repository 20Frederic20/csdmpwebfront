import { DashboardLayoutWrapper } from "@/components/dashboard-layout-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect('/login');
//   }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}