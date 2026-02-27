"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "sonner";
import { UpdatePatientRequest, Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { User, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users";
import { useAuthToken } from "@/hooks/use-auth-token";
import { PatientInformationForm } from "@/components/patients/patient-information-form";
import { PatientOwnerSelector } from "@/components/patients/patient-owner-selector";
import { PatientAdditionalInfoForm } from "@/components/patients/patient-additional-info-form";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<UpdatePatientRequest>({
    given_name: "",
    family_name: "",
    birth_date: "",
    gender: "male",
    location: "",
    owner_id: null,
    birth_place: null,
    residence_city: null,
    neighborhood: null,
    phone_number: null,
    npi_number: null,
    blood_group: null,
    father_full_name: null,
    mother_full_name: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    is_main: false,
  });
  const { token } = useAuthToken();

  // Charger le patient
  useEffect(() => {
    const loadPatient = async () => {
      setLoadingPatient(true);
      try {
        const patientData = await PatientService.getPatientById(patientId, token || undefined);
        setPatient(patientData);
        
        // Pré-remplir le formulaire avec les données du patient
        setFormData({
          given_name: patientData.given_name || "",
          family_name: patientData.family_name || "",
          birth_date: patientData.birth_date || "",
          gender: patientData.gender || "male",
          location: patientData.location || "",
          owner_id: patientData.owner_id || null,
          birth_place: patientData.birth_place || null,
          residence_city: patientData.residence_city || null,
          neighborhood: patientData.neighborhood || null,
          phone_number: patientData.phone_number || null,
          npi_number: patientData.npi_number || null,
          blood_group: patientData.blood_group || null,
          father_full_name: patientData.father_full_name || null,
          mother_full_name: patientData.mother_full_name || null,
          emergency_contact_name: patientData.emergency_contact_name || null,
          emergency_contact_phone: patientData.emergency_contact_phone || null,
          is_main: patientData.is_main || false,
        });
      } catch (error: any) {
        console.error('Error loading patient:', error);
        toast.error(error.message || "Erreur lors du chargement du patient");
        router.push('/patients');
      } finally {
        setLoadingPatient(false);
      }
    };

    if (patientId) {
      loadPatient();
    }
  }, [patientId, token, router]);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        let allUsers: User[] = [];
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
    if (!formData.given_name?.trim()) {
      toast.error("Le prénom est requis");
      return;
    }

    if (!formData.family_name?.trim()) {
      toast.error("Le nom de famille est requis");
      return;
    }

    if (!formData.birth_date) {
      toast.error("La date de naissance est requise");
      return;
    }

    if (!formData.location?.trim()) {
      toast.error("La localisation est requise");
      return;
    }

    // Validation des champs de contact d'urgence
    if (!formData.emergency_contact_name?.trim()) {
      toast.error("Le nom du contact d'urgence est requis");
      return;
    }

    if (!formData.emergency_contact_phone?.trim()) {
      toast.error("Le téléphone du contact d'urgence est requis");
      return;
    }

    setLoading(true);
    try {
      const patientData: UpdatePatientRequest = {
        given_name: formData.given_name,
        family_name: formData.family_name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        location: formData.location || "",
        owner_id: formData.owner_id || null,
        birth_place: formData.birth_place || null,
        residence_city: formData.residence_city || null,
        neighborhood: formData.neighborhood || null,
        phone_number: formData.phone_number || null,
        npi_number: formData.npi_number || null,
        blood_group: formData.blood_group || null,
        father_full_name: formData.father_full_name || null,
        mother_full_name: formData.mother_full_name || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        is_main: formData.is_main || false,
      };

      await PatientService.updatePatient(patientId, patientData, token || undefined);
      toast.success("Patient modifié avec succès");
      
      // Rediriger vers la liste
      router.push('/patients');
    } catch (error: any) {
      console.error('Error updating patient:', error);
      toast.error(error.message || "Erreur lors de la modification du patient");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdatePatientRequest, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    if (patient) {
      setFormData({
        given_name: patient.given_name || "",
        family_name: patient.family_name || "",
        birth_date: patient.birth_date || "",
        gender: patient.gender || "male",
        location: patient.location || "",
        owner_id: patient.owner_id || null,
        birth_place: patient.birth_place || null,
        residence_city: patient.residence_city || null,
        neighborhood: patient.neighborhood || null,
        phone_number: patient.phone_number || null,
        npi_number: patient.npi_number || null,
        blood_group: patient.blood_group || null,
        father_full_name: patient.father_full_name || null,
        mother_full_name: patient.mother_full_name || null,
        emergency_contact_name: patient.emergency_contact_name || null,
        emergency_contact_phone: patient.emergency_contact_phone || null,
        is_main: patient.is_main || false,
      });
    }
  };

  if (loadingPatient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du patient...</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Patient non trouvé</div>
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
            onClick={() => router.push('/patients')}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modifier le patient</h1>
            <p className="text-muted-foreground">
              Modifiez les informations du patient : {patient.given_name} {patient.family_name}
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
        {/* Informations du patient */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PatientInformationForm
              givenName={formData.given_name || ""}
              familyName={formData.family_name || ""}
              birthDate={formData.birth_date || ""}
              gender={formData.gender || "male"}
              location={formData.location || ""}
              onFieldChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Informations additionnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations additionnelles</CardTitle>
            <p className="text-sm text-muted-foreground">
              Informations médicales et contacts d'urgence
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <PatientAdditionalInfoForm
              birthPlace={formData.birth_place}
              residenceCity={formData.residence_city}
              neighborhood={formData.neighborhood}
              phoneNumber={formData.phone_number}
              npiNumber={formData.npi_number}
              bloodGroup={formData.blood_group}
              fatherFullName={formData.father_full_name}
              motherFullName={formData.mother_full_name}
              emergencyContactName={formData.emergency_contact_name}
              emergencyContactPhone={formData.emergency_contact_phone}
              onFieldChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Propriétaire du patient */}
        <Card>
          <CardHeader>
            <CardTitle>Propriétaire du patient</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un propriétaire pour ce patient
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <PatientOwnerSelector
              users={users}
              selectedOwner={formData.owner_id || ""}
              onOwnerChange={(value) => handleInputChange('owner_id', value)}
              isLoading={loadingUsers}
              label="Propriétaire du patient"
              placeholder="Sélectionner un propriétaire"
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
                onClick={() => router.push('/patients')}
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
                {loading ? "Modification en cours..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
