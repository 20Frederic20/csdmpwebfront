"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { User, CreateUserRequest, UserRole } from "@/features/users/types/user.types";
import { UserService } from "@/features/users/services/user.service";
import { useAuthToken } from "@/hooks/use-auth-token";

interface AddUserModalProps {
  onUserAdded: () => void;
}

const userRoles: UserRole[] = [
  "USER",
  "PARENT", 
  "PATIENT",
  "HEALTH_PRO",
  "DOCTOR",
  "NURSE",
  "MIDWIFE",
  "LAB_TECHNICIAN",
  "PHARMACIST",
  "COMMUNITY_AGENT",
  "ADMIN",
  "SUPER_ADMIN"
];

const roleLabels: Record<UserRole, string> = {
  "USER": "Utilisateur",
  "PARENT": "Parent",
  "PATIENT": "Patient", 
  "HEALTH_PRO": "Professionnel de santé",
  "DOCTOR": "Médecin",
  "NURSE": "Infirmier",
  "MIDWIFE": "Sage-femme",
  "LAB_TECHNICIAN": "Technicien de labo",
  "PHARMACIST": "Pharmacien",
  "COMMUNITY_AGENT": "Agent communautaire",
  "ADMIN": "Administrateur",
  "SUPER_ADMIN": "Super administrateur"
};

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
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const { token } = useAuthToken();

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
        roles: selectedRoles,
      };

      await UserService.createUser(userData, token || undefined);
      toast.success("Utilisateur créé avec succès");
      
      // Réinitialiser le formulaire
      setFormData({
        given_name: "",
        family_name: "",
        health_id: "",
        password: "",
        roles: [],
      });
      setSelectedRoles([]);
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

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
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
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="given_name">Prénom *</Label>
                <Input
                  id="given_name"
                  value={formData.given_name}
                  onChange={(e) => handleInputChange('given_name', e.target.value)}
                  placeholder="Entrez le prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family_name">Nom de famille *</Label>
                <Input
                  id="family_name"
                  value={formData.family_name}
                  onChange={(e) => handleInputChange('family_name', e.target.value)}
                  placeholder="Entrez le nom de famille"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations système</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="health_id">ID Santé *</Label>
                <Input
                  id="health_id"
                  value={formData.health_id}
                  onChange={(e) => handleInputChange('health_id', e.target.value)}
                  placeholder="Entrez l'ID santé"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Entrez le mot de passe"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Rôles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rôles *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {userRoles.map((role) => (
                <div
                  key={role}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRoles.includes(role)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => toggleRole(role)}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="sr-only"
                  />
                  <span className="text-md">{roleLabels[role]}</span>
                </div>
              ))}
            </div>
            {selectedRoles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-md text-muted-foreground">Rôles sélectionnés:</span>
                {selectedRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="cursor-pointer">
                    {roleLabels[role]}
                    <X
                      className="h-3 w-3 ml-1"
                      onClick={() => toggleRole(role)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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
