"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, User, Phone, MapPin, Users } from "lucide-react";
import { CreateHealthFacilityRequest, AdminUser } from "@/features/health-facilities/types/health-facility.types";
import { HealthFacilityService } from "@/features/health-facilities/services/health-facility.service";
import { UserService } from "@/features/users/services/user.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";
import Link from "next/link";

export default function AddHealthFacilityPage() {
  const router = useRouter();
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [adminMode, setAdminMode] = useState<'create' | 'select'>('select');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState<CreateHealthFacilityRequest>({
    name: "",
    code: "",
    facility_type: "health_center",
    district: "",
    region: "",
    phone: null,
    admin_user_id: null,
    admin_user: null,
    is_active: true,
  });

  const [adminUserData, setAdminUserData] = useState<AdminUser>({
    given_name: "",
    family_name: "",
    health_id: "",
    password: "",
    roles: ["user"],
  });

  // Charger la liste des utilisateurs disponibles
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await UserService.getUsers({
          limit: 100,
          is_active: true
        }, token || undefined);
        setAvailableUsers(response.data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    if (token) {
      loadUsers();
    }
  }, [token]);

  const handleInputChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdminUserChange = (field: string, value: string | string[]) => {
    setAdminUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation : un admin est obligatoire
      if (adminMode === 'select' && !formData.admin_user_id) {
        toast.error("Veuillez sélectionner un administrateur existant");
        setLoading(false);
        return;
      }

      if (adminMode === 'create' && !adminUserData.given_name && !adminUserData.family_name) {
        toast.error("Veuillez remplir les informations de l'administrateur");
        setLoading(false);
        return;
      }

      const submitData: CreateHealthFacilityRequest = {
        ...formData,
        admin_user: adminMode === 'create' ? adminUserData : null,
        admin_user_id: adminMode === 'select' ? formData.admin_user_id : null,
      };

      await HealthFacilityService.createHealthFacility(submitData, token || undefined);
      toast.success("Établissement de santé créé avec succès");
      router.push("/health-facilities");
    } catch (error) {
      console.error('Error creating health facility:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de l\'établissement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/health-facilities">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Ajouter un établissement de santé</h1>
          <p className="text-muted-foreground">
            Créez un nouvel hôpital, centre de santé ou dispensaire
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'établissement <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Hôpital Central de..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="HC001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facility_type">Type d'établissement <span className="text-red-500">*</span></Label>
                <Select value={formData.facility_type} onValueChange={(value) => handleInputChange("facility_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university_hospital">Hôpital universitaire</SelectItem>
                    <SelectItem value="departmental_hospital">Hôpital départemental</SelectItem>
                    <SelectItem value="zone_hospital">Hôpital de zone</SelectItem>
                    <SelectItem value="health_center">Centre de santé</SelectItem>
                    <SelectItem value="dispensary">Dispensaire</SelectItem>
                    <SelectItem value="private_clinic">Clinique privée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value || null)}
                  placeholder="+228 00 00 00 00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District <span className="text-red-500">*</span></Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  placeholder="Lomé"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Région <span className="text-red-500">*</span></Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Maritime"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange("is_active", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">Établissement actif</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Administrateur de l'établissement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Choix de l'administrateur <span className="text-red-500">*</span></Label>
              
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adminMode"
                    checked={adminMode === 'select'}
                    onChange={() => setAdminMode('select')}
                    className="text-blue-600"
                  />
                  <span>Sélectionner un utilisateur existant</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adminMode"
                    checked={adminMode === 'create'}
                    onChange={() => setAdminMode('create')}
                    className="text-blue-600"
                  />
                  <span>Créer un nouvel administrateur</span>
                </label>
              </div>
            </div>

            {adminMode === 'select' && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="admin_user_id">Utilisateur existant <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.admin_user_id || ""} 
                    onValueChange={(value) => handleInputChange("admin_user_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id_} value={user.id_}>
                          {user.given_name} {user.family_name} ({user.health_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {adminMode === 'create' && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin_given_name">Prénom de l'administrateur <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_given_name"
                      value={adminUserData.given_name}
                      onChange={(e) => handleAdminUserChange("given_name", e.target.value)}
                      placeholder="Jean"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin_family_name">Nom de l'administrateur <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_family_name"
                      value={adminUserData.family_name}
                      onChange={(e) => handleAdminUserChange("family_name", e.target.value)}
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin_health_id">ID Santé <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_health_id"
                      value={adminUserData.health_id}
                      onChange={(e) => handleAdminUserChange("health_id", e.target.value)}
                      placeholder="TG123456"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin_password">Mot de passe <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_password"
                      type="password"
                      value={adminUserData.password}
                      onChange={(e) => handleAdminUserChange("password", e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/health-facilities">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Création en cours..." : "Créer l'établissement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
