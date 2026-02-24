"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateHospitalStaffRequest, EmploymentStatus, MedicalSpecialty, HospitalDepartment } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff/services/hospital-staff.service";
import { 
  getEmploymentStatusOptions
} from "@/features/hospital-staff/utils/hospital-staff.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";
import { ArrowLeft, Save, X } from "lucide-react";
import { HealthFacility } from "@/features/health-facilities";
import { HealthFacilityService, HealthFacilityQueryParams } from "@/features/health-facilities/services/health-facility.service";
import { User as UserType, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users/services/user.service";
import { CreationTypeSelector } from "@/components/hospital-staff/creation-type-selector";
import { HealthFacilitySelector } from "@/components/ui/health-facility-selector";
import { UserSelector } from "@/components/ui/user-selector";
import { UserCreationForm } from "@/components/hospital-staff/user-creation-form";
import { StaffInformationForm } from "@/components/hospital-staff/staff-information-form";
import CustomSelect from "@/components/ui/custom-select";

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
    specialty: MedicalSpecialty.GENERAL_PRACTITIONER,
    department: HospitalDepartment.EMERGENCY,
    user_id: "",
    order_number: null,
    employment_status: EmploymentStatus.STATE_PERMANENT,
    is_active: true, // Gardé par défaut mais non affiché
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
      if (!formData.user_data?.given_name?.trim()) {
        toast.error("Le prénom est requis");
        return;
      }
      if (!formData.user_data?.family_name?.trim()) {
        toast.error("Le nom de famille est requis");
        return;
      }
      if (!formData.user_data?.health_id?.trim()) {
        toast.error("L'ID santé est requis");
        return;
      }
      if (!formData.user_data?.password?.trim()) {
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
        health_facility_id: formData.health_facility_id,
        matricule: formData.matricule,
        year_of_exp: formData.year_of_exp,
        specialty: formData.specialty,
        department: formData.department,
        user_id: createUser ? null : (formData.user_id || null),
        order_number: formData.order_number,
        employment_status: formData.employment_status,
        is_active: formData.is_active,
        user_data: createUser ? {
          given_name: formData.user_data?.given_name || "",
          family_name: formData.user_data?.family_name || "",
          health_id: formData.user_data?.health_id || "",
          password: formData.user_data?.password || "",
          roles: selectedRoles,
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

  const handleUserDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      user_data: {
        ...prev.user_data!,
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      health_facility_id: "",
      matricule: "",
      year_of_exp: 0,
      specialty: MedicalSpecialty.GENERAL_PRACTITIONER,
      department: HospitalDepartment.EMERGENCY,
      user_id: "",
      order_number: null,
      employment_status: EmploymentStatus.STATE_PERMANENT,
      is_active: true,
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
            <CreationTypeSelector 
              createUser={createUser} 
              onCreateUserChange={setCreateUser} 
            />
          </CardContent>
        </Card>

        {/* Informations du personnel */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du personnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <HealthFacilitySelector
              healthFacilities={healthFacilities}
              selectedFacility={formData.health_facility_id}
              onFacilityChange={(value) => handleInputChange('health_facility_id', value)}
              isLoading={loadingFacilities}
              required
            />

            <StaffInformationForm
              matricule={formData.matricule}
              yearOfExp={formData.year_of_exp}
              specialty={formData.specialty}
              department={formData.department}
              orderNumber={formData.order_number ? Number(formData.order_number) : null}
              employmentStatus={formData.employment_status || undefined}
              onFieldChange={handleInputChange}
            />

            </CardContent>
        </Card>

        {/* Utilisateur existant */}
        {!createUser && (
          <Card>
            <CardHeader>
              <CardTitle>Utilisateur existant</CardTitle>
            </CardHeader>
            <CardContent>
              <UserSelector
                users={users}
                selectedUser={formData.user_id || ""}
                onUserChange={(value) => handleInputChange('user_id', value)}
                isLoading={loadingUsers}
                required
              />
            </CardContent>
          </Card>
        )}

        {/* Nouvel utilisateur */}
        {createUser && (
          <Card>
            <CardHeader>
              <CardTitle>Nouvel utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <UserCreationForm
                userData={formData.user_data || {}}
                selectedRoles={selectedRoles}
                onUserDataChange={handleUserDataChange}
                onRolesChange={setSelectedRoles}
              />
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
