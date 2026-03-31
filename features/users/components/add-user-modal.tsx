"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateUserRequest } from "@/features/users/types/user.types";
import { UserService } from "@/features/users/services/user.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { UserFields } from "./UserFields";
import { RoleSelector } from "@/features/roles-permissions/components/RoleSelector";

interface AddUserModalProps {
  onUserAdded: () => void;
}

export function AddUserModal({ onUserAdded }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    given_name: "",
    family_name: "",
    health_id: "",
    password: "",
    roles: [],
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { isAuthenticated } = useAuthToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.given_name.trim()) {
      toast.error("Le prénom est requis");
      return;
    }
    if (!formData.family_name.trim()) {
      toast.error("Le nom de famille est requis");
      return;
    }
    if (!formData.health_id.trim()) {
      toast.error("L'ID santé est requis");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Le mot de passe est requis");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("Au moins un rôle doit être sélectionné");
      return;
    }

    setLoading(true);
    try {
      const userData: CreateUserRequest = {
        ...formData,
        roles: selectedRoles as any,
      };

      await UserService.createUser(userData);
      toast.success("Utilisateur créé avec succès");
      
      handleReset();
      setOpen(false);
      
      // Notifier le parent
      onUserAdded();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || "Erreur lors de la création de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      given_name: "",
      family_name: "",
      health_id: "",
      password: "",
      roles: [],
    });
    setSelectedRoles([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations utilisateur</h3>
              <UserFields 
                userData={formData} 
                onUserDataChange={handleInputChange} 
              />
            </div>

            <div className="pt-6 border-t">
              <RoleSelector
                selectedRoleIds={selectedRoles}
                onChange={setSelectedRoles}
                label="Rôles de l'utilisateur"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="cursor-pointer"
            >
              Réinitialiser
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Création en cours..." : "Créer l'utilisateur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

