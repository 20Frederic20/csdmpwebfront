'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TestTube2,
  CreditCard,
  FileText
} from "lucide-react";

interface BottomNavProps {
  className?: string;
}

const navItems = [
  {
    href: "/patient",
    label: "Accueil",
    icon: LayoutDashboard,
  },
  {
    href: "/patient/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/patient/analyses",
    label: "Analyses",
    icon: TestTube2,
  },
  {
    href: "/patient/factures",
    label: "Factures",
    icon: CreditCard,
  },
] as const;

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "md:hidden",
        "bg-white/90 dark:bg-[#191c1c]/90 backdrop-blur-xl",
        "border-t border-border",
        "px-4 pb-safe pt-3",
        "flex justify-around items-center",
        "rounded-t-lg",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              "px-2 py-1.5 min-w-[64px]",
              "transition-all active:scale-90",
              "gap-1",
              isActive
                ? "bg-primary/10 text-primary rounded-lg"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
