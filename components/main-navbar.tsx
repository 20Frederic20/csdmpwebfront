"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  LogOut, 
  User,
  Home,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Building
} from "lucide-react";
import { AuthClientService } from "@/features/core/auth/services/auth-client.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { clearPermissionsCache } = usePermissions();
  const { isLoading } = useAuthRefresh();

  const handleLogout = () => {
    // Nettoyer le cache des permissions avant la déconnexion
    clearPermissionsCache();
    
    // Utiliser le service de déconnexion existant
    AuthClientService.logout();
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  const navigationItems = [
    {
      title: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      title: "Rendez-vous",
      href: "/appointments",
      icon: Calendar,
    },
    {
      title: "Consultations",
      href: "/consultations",
      icon: FileText,
    },
    {
      title: "Personnel",
      href: "/hospital-staff",
      icon: Stethoscope,
    },
    {
      title: "Établissements",
      href: "/facilities",
      icon: Building,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Authentification...</span>
              </div>
            )}

            {/* Menu utilisateur desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Utilisateur</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-3 ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 text-sm">Utilisateur</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
