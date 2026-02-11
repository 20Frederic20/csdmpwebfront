'use client';

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ChevronDown 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PermissionsService } from "@/features/auth/services/permissions.service";
import { useAuthToken } from "@/hooks/use-auth-token";

interface User {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  roles: any[];
  permissions: any[];
}

export function UserAvatarDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearToken } = useAuthToken();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('UserAvatarDropdown: Fetching user permissions');
        
        const userData = await PermissionsService.getUserPermissions();
        console.log('UserAvatarDropdown: User data received:', userData);
        
        // Vérifier si l'utilisateur a des données valides
        if (userData && userData.id && userData.given_name) {
          setUser(userData);
        } else {
          console.log('UserAvatarDropdown: No valid user data received');
        }
      } catch (error) {
        console.error('UserAvatarDropdown: Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // Supprimer le token du localStorage uniquement
    clearToken();
    
    // Rediriger vers la page de login
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

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

  // Générer les initiales
  const initials = `${user.given_name?.charAt(0) || ''}${user.family_name?.charAt(0) || ''}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.given_name} {user.family_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Voir le profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
