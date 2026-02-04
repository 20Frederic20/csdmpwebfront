"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X, User, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  CreateHospitalStaffRequest, 
  HospitalStaffSpecialty, 
  HospitalStaffDepartment,
  CreateUserRequest 
} from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getSpecialtyOptions, 
  getDepartmentOptions 
} from "@/features/hospital-staff";
import { HealthFacility } from "@/features/health-facilities";
import { HealthFacilityService, HealthFacilityQueryParams } from "@/features/health-facilities/services/health-facility.service";
import { User as UserType, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users/services/user.service";

const userRoles = [
  { value: "health_pro", label: "Professionnel de santé" },
  { value: "doctor", label: "Médecin" },
  { value: "nurse", label: "Infirmier" },
  { value: "midwife", label: "Sage-femme" },
  { value: "lab_technician", label: "Technicien de labo" },
  { value: "pharmacist", label: "Pharmacien" },
  { value: "community_agent", label: "Agent communautaire" },
];

export default function AddHospitalStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createUser, setCreateUser] = useState(true);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState<CreateHospitalStaffRequest>({
    health_facility_id: "",
    matricule: "",
    year_of_exp: 0,
    specialty: "general_practitioner",
    department: "internal_medicine",
    user_id: null,
    user_data: {
      given_name: "",
      family_name: "",
      health_id: "",
      password: "",
      roles: [],
    },
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { token } = useAuthToken();

  // Charger les établissements de santé
  useEffect(() => {
    const loadHealthFacilities = async () => {
      setLoadingFacilities(true);
      try {
        let allFacilities: HealthFacility[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const params: HealthFacilityQueryParams = {
            limit,
            offset,
          };
          const response = await HealthFacilityService.getHealthFacilities(params, token || undefined);
          allFacilities = [...allFacilities, ...(response.data || [])];
          
          if (response.data && response.data.length < limit) {
            hasMore = false;
          } else {
            offset += limit;
          }
        }
        
        setHealthFacilities(allFacilities);
        console.log('Health facilities loaded:', allFacilities.length);
      } catch (error) {
        console.error('Error loading health facilities:', error);
        toast.error('Erreur lors du chargement des établissements');
      } finally {
        setLoadingFacilities(false);
      }
    };

    loadHealthFacilities();
  }, [token]);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        let allUsers: UserType[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const params: ListUsersQueryParams = {
            limit,
            offset,
            is_active: true,
          };
          const response = await UserService.getUsers(params, token || undefined);
          allUsers = [...allUsers, ...(response.data || [])];
          
          if (response.data && response.data.length < limit) {
            hasMore = false;
          } else {
            offset += limit;
          }
        }
        
        setUsers(allUsers);
        console.log('Users loaded:', allUsers.length);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.health_facility_id.trim()) {
      toast.error("L'établissement de santé est requis");
      return;
    }
    if (!formData.matricule.trim()) {
      toast.error("Le matricule est requis");
      return;
    }
    if (formData.year_of_exp < 0 || formData.year_of_exp > 70) {
      toast.error("L'expérience doit être entre 0 et 70 ans");
      return;
    }
    
    if (createUser) {
      if (!formData.user_data?.given_name.trim()) {
        toast.error("Le prénom est requis");
        return;
      }
      if (!formData.user_data?.family_name.trim()) {
        toast.error("Le nom de famille est requis");
        return;
      }
      if (!formData.user_data?.health_id.trim()) {
        toast.error("L'ID santé est requis");
        return;
      }
      if (!formData.user_data?.password.trim()) {
        toast.error("Le mot de passe est requis");
        return;
      }
      if (formData.user_data.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      if (selectedRoles.length === 0) {
        toast.error("Au moins un rôle doit être sélectionné");
        return;
      }
    } else if (!formData.user_id?.trim()) {
      toast.error("L'utilisateur est requis");
      return;
    }

    setLoading(true);
    try {
      const staffData: CreateHospitalStaffRequest = {
        ...formData,
        user_data: createUser ? {
          ...formData.user_data!,
          roles: selectedRoles,
          is_active: true,
        } : null,
      };

      await HospitalStaffService.createHospitalStaff(staffData, token || undefined);
      toast.success("Membre du personnel créé avec succès");
      
      // Rediriger vers la liste
      router.push('/hospital-staff');
    } catch (error: any) {
      console.error('Error creating hospital staff:', error);
      toast.error(error.message || "Erreur lors de la création du personnel");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateHospitalStaffRequest, value: string | number) => {
    console.log('handleInputChange:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUserDataChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      user_data: {
        ...prev.user_data!,
        [field]: value
      }
    }));
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const resetForm = () => {
    setFormData({
      health_facility_id: "",
      matricule: "",
      year_of_exp: 0,
      specialty: "general_practitioner",
      department: "internal_medicine",
      user_id: null,
      user_data: {
        given_name: "",
        family_name: "",
        health_id: "",
        password: "",
        roles: [],
      },
    });
    setSelectedRoles([]);
    setCreateUser(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/hospital-staff')}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajouter un membre du personnel</h1>
            <p className="text-muted-foreground">
              Créer un nouveau membre du personnel hospitalier
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={resetForm}
            className="cursor-pointer"
          >
            <X className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de création */}
        <Card>
          <CardHeader>
            <CardTitle>Type de création</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={createUser ? "default" : "outline"}
                onClick={() => setCreateUser(true)}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Créer un nouvel utilisateur
              </Button>
              <Button
                type="button"
                variant={!createUser ? "default" : "outline"}
                onClick={() => setCreateUser(false)}
                className="cursor-pointer"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Utiliser un utilisateur existant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations du personnel */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="health_facility_id">Établissement de santé *</Label>
                <Select 
                  value={formData.health_facility_id || ""} 
                  onValueChange={(value) => {
                    console.log('Selected facility:', value);
                    handleInputChange('health_facility_id', value);
                  }}
                  disabled={loadingFacilities}
                >
                  <SelectTrigger>
                    {loadingFacilities ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Sélectionner un établissement" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {healthFacilities.length === 0 ? (
                      <SelectItem value="" disabled>
                        Aucun établissement disponible
                      </SelectItem>
                    ) : (
                      healthFacilities.map((facility) => (
                        <SelectItem key={facility.id_} value={facility.id_}>
                          {facility.name} ({facility.id_})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {healthFacilities.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {healthFacilities.length} établissements chargés
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Valeur actuelle: {formData.health_facility_id || 'vide'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule *</Label>
                <Input
                  id="matricule"
                  value={formData.matricule}
                  onChange={(e) => handleInputChange('matricule', e.target.value)}
                  placeholder="Entrez le matricule"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year_of_exp">Années d'expérience *</Label>
                <Input
                  id="year_of_exp"
                  type="number"
                  min="0"
                  max="70"
                  value={formData.year_of_exp}
                  onChange={(e) => handleInputChange('year_of_exp', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Spécialité *</Label>
                <Select 
                  value={formData.specialty} 
                  onValueChange={(value) => handleInputChange('specialty', value as HospitalStaffSpecialty)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSpecialtyOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="department">Département *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value as HospitalStaffDepartment)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDepartmentOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utilisateur existant */}
        {!createUser && (
          <Card>
            <CardHeader>
              <CardTitle>Utilisateur existant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="user_id">Utilisateur *</Label>
                <Select 
                  value={formData.user_id || ""} 
                  onValueChange={(value) => {
                    console.log('Selected user:', value);
                    handleInputChange('user_id', value);
                  }}
                  disabled={loadingUsers}
                >
                  <SelectTrigger>
                    {loadingUsers ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {users.length === 0 ? (
                      <SelectItem value="" disabled>
                        Aucun utilisateur disponible
                      </SelectItem>
                    ) : (
                      users.map((user) => (
                        <SelectItem key={user.id_} value={user.id_}>
                          {user.given_name} {user.family_name} ({user.id_})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {users.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {users.length} utilisateurs chargés
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nouvel utilisateur */}
        {createUser && (
          <Card>
            <CardHeader>
              <CardTitle>Nouvel utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="given_name">Prénom *</Label>
                  <Input
                    id="given_name"
                    value={formData.user_data?.given_name || ""}
                    onChange={(e) => handleUserDataChange('given_name', e.target.value)}
                    placeholder="Entrez le prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family_name">Nom de famille *</Label>
                  <Input
                    id="family_name"
                    value={formData.user_data?.family_name || ""}
                    onChange={(e) => handleUserDataChange('family_name', e.target.value)}
                    placeholder="Entrez le nom de famille"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health_id">ID Santé *</Label>
                  <Input
                    id="health_id"
                    value={formData.user_data?.health_id || ""}
                    onChange={(e) => handleUserDataChange('health_id', e.target.value)}
                    placeholder="Entrez l'ID santé"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.user_data?.password || ""}
                    onChange={(e) => handleUserDataChange('password', e.target.value)}
                    placeholder="Entrez le mot de passe"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Rôles */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Rôles *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {userRoles.map((role) => (
                    <div
                      key={role.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoles.includes(role.value)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => toggleRole(role.value)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.value)}
                        onChange={() => toggleRole(role.value)}
                        className="sr-only"
                      />
                      <span className="text-md">{role.label}</span>
                    </div>
                  ))}
                </div>
                {selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-md text-muted-foreground">Rôles sélectionnés:</span>
                    {selectedRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="cursor-pointer">
                        {userRoles.find(r => r.value === role)?.label || role}
                        <X
                          className="h-3 w-3 ml-1"
                          onClick={() => toggleRole(role)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/hospital-staff')}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Création en cours..." : "Créer le membre"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
