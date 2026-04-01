'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { useQueryClient } from "@tanstack/react-query";


export function UserAvatarDropdown() {
  const { clearToken } = useAuthToken();
  const { clearPermissionsCache, user, loading } = usePermissionsContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    // Nettoyer le cache React Query
    queryClient.clear();

    // Appeler l'API pour nettoyer les cookies HTTP-only
    await clearToken();

    // Nettoyer le cache des permissions (React Query)
    clearPermissionsCache();

    // Rediriger vers la page de login
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  if (!user) {
    return (
      <Button
        onClick={() => router.push('/login')}
        variant="outline"
        size="sm"
      >
        Se connecter
      </Button>
    );
  }

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  // Générer les initiales
  let initials = '';
  if (user.given_name || user.family_name) {
    initials = `${user.given_name?.charAt(0) || ''}${user.family_name?.charAt(0) || ''}`.toUpperCase();
  } else if (user.name) {
    const parts = user.name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      initials = `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    } else {
      initials = user.name.substring(0, 2).toUpperCase();
    }
  } else if (user.email) {
    initials = user.email.substring(0, 2).toUpperCase();
  } else {
    initials = 'U';
  }

  const displayName = user.name || `${user.given_name || ''} ${user.family_name || ''}`.trim() || user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50"
        >
          <Avatar className="h-10 w-10 border border-vital-green/20">
            <AvatarFallback className="bg-vital-green text-medical-bg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-medical-card/90 backdrop-blur-md border-white/10" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-white">
              {displayName}
            </p>
            <p className="text-xs leading-none text-medical-muted">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
          <User className="mr-2 h-4 w-4 text-vital-green" />
          <span>Voir le profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
          <Settings className="mr-2 h-4 w-4 text-vital-green" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
