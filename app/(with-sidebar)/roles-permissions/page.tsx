'use client';

import { Shield, Key, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleForm } from '@/features/roles-permissions/components/RoleForm';
import { PermissionForm } from '@/features/roles-permissions/components/PermissionForm';
import { RolesTable } from '@/features/roles-permissions/components/RolesTable';
import { PermissionsTable } from '@/features/roles-permissions/components/PermissionsTable';
import { useState } from 'react';

export default function RolesPermissionsPage() {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-vital-green" />
            Gestion des Rôles et Permissions
          </h2>
          <p className="text-muted-foreground mt-2">
            Configurez les accès dynamiques pour les utilisateurs de la plateforme.
          </p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted p-1 rounded-xl">
            <TabsTrigger value="roles" className="rounded-lg data-[state=active]:bg-vital-green data-[state=active]:text-white transition-all">
              <Shield className="mr-2 h-4 w-4" />
              Rôles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="rounded-lg data-[state=active]:bg-vital-green data-[state=active]:text-white transition-all">
              <Key className="mr-2 h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-4">
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="vital-shadow bg-vital-green hover:bg-vital-green/90 text-white transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Rôle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau rôle</DialogTitle>
                </DialogHeader>
                <RoleForm onSuccess={() => setIsRoleDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-vital-green text-vital-green hover:bg-vital-green/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Permission
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Définir des permissions par ressource</DialogTitle>
                </DialogHeader>
                <PermissionForm onSuccess={() => setIsPermissionDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="roles" className="space-y-4">
          <RolesTable />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <PermissionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
