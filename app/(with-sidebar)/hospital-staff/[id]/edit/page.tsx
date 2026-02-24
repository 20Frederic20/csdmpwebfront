"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HospitalStaff, UpdateHospitalStaffRequest, MedicalSpecialty, HospitalDepartment, EmploymentStatus } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff/services/hospital-staff.service";
import { 
  getEmploymentStatusOptions,
  formatSpecialty,
  formatDepartment
} from "@/features/hospital-staff/utils/hospital-staff.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";
import { ArrowLeft, Save, X } from "lucide-react";
import { HealthFacility } from "@/features/health-facilities";
import { HealthFacilityService, HealthFacilityQueryParams } from "@/features/health-facilities/services/health-facility.service";
import { User as UserType, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users/services/user.service";
import { HealthFacilitySelector } from "@/components/ui/health-facility-selector";
import { UserSelector } from "@/components/ui/user-selector";
import { StaffUpdateForm } from "@/components/hospital-staff/staff-update-form";
import CustomSelect from "@/components/ui/custom-select";

export default function EditHospitalStaffPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [staff, setStaff] = useState<HospitalStaff | null>(null);
  const [formData, setFormData] = useState<UpdateHospitalStaffRequest>({
    health_facility_id: null,
    user_id: null,
    matricule: null,
    year_of_exp: null,
    specialty: null,
    department: null,
    order_number: null,
    employment_status: null,
    is_active: null, // Gardé mais non affiché dans le formulaire
  });

  const staffId = params.id as string;

  // Charger les données du personnel
  useEffect(() => {
    const loadStaff = async () => {
      setLoadingStaff(true);
      try {
        const staffData = await HospitalStaffService.getHospitalStaffById(staffId, token || undefined);
        setStaff(staffData);
        
        // Initialiser le formulaire avec les données existantes
        setFormData({
          health_facility_id: staffData.health_facility_id,
          user_id: staffData.user_id,
          matricule: staffData.matricule,
          year_of_exp: staffData.year_of_exp,
          specialty: staffData.specialty,
          department: staffData.department,
          order_number: staffData.order_number,
          employment_status: staffData.employment_status,
          is_active: staffData.is_active,
        });
      } catch (error: any) {
        console.error('Error loading staff:', error);
        toast.error(error.message || "Erreur lors du chargement du personnel");
        router.push('/hospital-staff');
      } finally {
        setLoadingStaff(false);
      }
    };

    loadStaff();
  }, [staffId, token, router]);

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
    if (formData.matricule && !formData.matricule.trim()) {
      toast.error("Le matricule ne peut pas être vide");
      return;
    }
    if (formData.year_of_exp !== undefined && formData.year_of_exp !== null && (formData.year_of_exp < 0 || formData.year_of_exp > 70)) {
      toast.error("L'expérience doit être entre 0 et 70 ans");
      return;
    }

    setLoading(true);
    try {
      // Filtrer les valeurs null pour n'envoyer que les champs modifiés
      const updateData: UpdateHospitalStaffRequest = {};
      
      if (formData.health_facility_id !== staff?.health_facility_id) {
        updateData.health_facility_id = formData.health_facility_id;
      }
      if (formData.user_id !== staff?.user_id) {
        updateData.user_id = formData.user_id;
      }
      if (formData.matricule !== staff?.matricule) {
        updateData.matricule = formData.matricule;
      }
      if (formData.year_of_exp !== staff?.year_of_exp) {
        updateData.year_of_exp = formData.year_of_exp;
      }
      if (formData.specialty !== staff?.specialty) {
        updateData.specialty = formData.specialty;
      }
      if (formData.department !== staff?.department) {
        updateData.department = formData.department;
      }
      if (formData.order_number !== staff?.order_number) {
        updateData.order_number = formData.order_number;
      }
      if (formData.employment_status !== staff?.employment_status) {
        updateData.employment_status = formData.employment_status;
      }
      // is_active n'est pas inclus dans le formulaire, donc pas de modification
      
      await HospitalStaffService.updateHospitalStaff(staffId, updateData, token || undefined);
      toast.success("Membre du personnel mis à jour avec succès");
      
      // Rediriger vers la page de détail
      router.push(`/hospital-staff/${staffId}`);
    } catch (error: any) {
      console.error('Error updating hospital staff:', error);
      toast.error(error.message || "Erreur lors de la mise à jour du personnel");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateHospitalStaffRequest, value: string | number | boolean | null) => {
    console.log('handleInputChange:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    if (staff) {
      setFormData({
        health_facility_id: staff.health_facility_id,
        user_id: staff.user_id,
        matricule: staff.matricule,
        year_of_exp: staff.year_of_exp,
        specialty: staff.specialty,
        department: staff.department,
        order_number: staff.order_number,
        employment_status: staff.employment_status,
        is_active: staff.is_active,
      });
    }
  };

  if (loadingStaff) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Personnel non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/hospital-staff/${staffId}`)}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modifier le personnel</h1>
            <p className="text-muted-foreground">
              {staff.user_given_name} {staff.user_family_name} - {staff.matricule}
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
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un utilisateur existant. Pour créer un nouvel utilisateur, utilisez la page d'ajout.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <HealthFacilitySelector
              healthFacilities={healthFacilities}
              selectedFacility={formData.health_facility_id || ""}
              onFacilityChange={(value) => handleInputChange('health_facility_id', value)}
              isLoading={loadingFacilities}
            />

            <UserSelector
              users={users}
              selectedUser={formData.user_id || ""}
              onUserChange={(value) => handleInputChange('user_id', value)}
              isLoading={loadingUsers}
              required
              label="Utilisateur associé"
              placeholder="Sélectionner un utilisateur existant"
            />
          </CardContent>
        </Card>

        {/* Informations du personnel */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du personnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <StaffUpdateForm
              matricule={formData.matricule || ""}
              yearOfExp={formData.year_of_exp || 0}
              specialty={formData.specialty || MedicalSpecialty.GENERAL_PRACTITIONER}
              department={formData.department || HospitalDepartment.EMERGENCY}
              orderNumber={formData.order_number ? Number(formData.order_number) : null}
              employmentStatus={formData.employment_status || undefined}
              onFieldChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/hospital-staff/${staffId}`)}
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
                {loading ? "Mise à jour en cours..." : "Mettre à jour"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
