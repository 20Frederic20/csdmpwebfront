"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "sonner";
import { CreatePatientRequest, Patient, useCreatePatient, useUpdatePatient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { User, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users";
import { useAuthToken } from "@/hooks/use-auth-token";
import { PatientInformationForm } from "./patient-information-form";
import { PatientOwnerSelector } from "./patient-owner-selector";
import { PatientAdditionalInfoForm } from "./patient-additional-info-form";
import { CreationTypeSelector } from "./creation-type-selector";
import { PatientUserCreationForm } from "./patient-user-creation-form";
import { UserRole } from "@/features/users/types/user.types";
import LocationService from "@/features/location/services/location.service";
import { getCityOptions } from "@/features/location/utils/location.utils";
import { City } from "@/features/location/types/location.types";

// Fonction utilitaire pour trouver une ville par son nom
function findCityByName(cities: City[], cityName: string | null | undefined): City | undefined {
  return cities.find(city => city.name === cityName);
}

interface PatientFormProps {
  patient?: Patient; // Pour la modification
  onCancel: () => void;
  onSuccess: () => void;
  title?: string;
  submitButtonText?: string;
}

export function PatientForm({
  patient,
  onCancel,
  onSuccess,
  title = patient ? "Modifier le patient" : "Ajouter un patient",
  submitButtonText = patient ? "Modifier" : "Créer"
}: PatientFormProps) {
  const router = useRouter();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [createUser, setCreateUser] = useState(true);
  const [userData, setUserData] = useState({
    given_name: "",
    family_name: "",
    health_id: "",
    password: "",
  });
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['PATIENT']);

  // État pour la gestion des villes
  const [cities, setCities] = useState<City[]>([]);

  const [formData, setFormData] = useState<CreatePatientRequest>({
    given_name: patient?.given_name || "",
    family_name: patient?.family_name || "",
    birth_date: patient?.birth_date || "",
    gender: patient?.gender || "male",
    location: patient?.location || "",
    owner_id: patient?.owner_id || null,
    birth_place: patient?.birth_place || null,
    residence_city: patient?.residence_city || null,
    neighborhood: patient?.neighborhood || null,
    phone_number: patient?.phone_number || null,
    npi_number: patient?.npi_number || null,
    blood_group: patient?.blood_group || null,
    father_full_name: patient?.father_full_name || null,
    mother_full_name: patient?.mother_full_name || null,
    emergency_contact_name: patient?.emergency_contact_name || null,
    emergency_contact_phone: patient?.emergency_contact_phone || null,
    is_main: patient?.is_main || false,
  });
  const { token } = useAuthToken();

  // Charger les villes
  useEffect(() => {
    const loadCities = async () => {
      // Charger les villes (Bénin par défaut)
      try {
        const locationData = await LocationService.fetchLocationData('BJ');
        setCities(locationData.cities);
      } catch (error) {
        console.error('Error loading cities:', error);
        toast.error('Erreur lors du chargement des villes');
      }
    };

    loadCities();
  }, []);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      // Ne charger que si on a besoin de sélectionner un utilisateur existant
      // (soit on n'est pas en création de nouvel utilisateur, soit on modifie un patient)
      if (createUser) return;
      if (users.length > 0) return;

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
  }, [token, createUser, users.length]);

  // Si on est en mode modification, on ne propose pas de créer un utilisateur
  useEffect(() => {
    if (patient) {
      setCreateUser(false);
    } else {
      // En mode création, initialiser la synchronisation avec les valeurs du formulaire patient
      setUserData(prev => ({
        ...prev,
        given_name: formData.given_name,
        family_name: formData.family_name,
      }));
    }
  }, [patient, formData.given_name, formData.family_name]);

  useEffect(() => {
    if (cities.length > 0 && patient) {
      const residenceCitySelected = findCityByName(cities, patient.residence_city);
      const birthPlaceSelected = findCityByName(cities, patient.birth_place);

      setFormData(prev => ({
        ...prev,
        residence_city: residenceCitySelected?.code || "",
        birth_place: birthPlaceSelected?.code || "",
      }));
    }
  }, [cities, patient]);

  useEffect(() => {
    if (users.length > 0 && patient?.owner_id) {
      setFormData(prev => ({
        ...prev,
        owner_id: patient.owner_id,
      }));
    }
  }, [users, patient]);

  const { mutateAsync: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutateAsync: updatePatient, isPending: isUpdating } = useUpdatePatient();

  const loading = isCreating || isUpdating;

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

    if (!formData.birth_date) {
      toast.error("La date de naissance est requise");
      return;
    }

    if (!formData.location?.trim()) {
      toast.error("La localisation est requise");
      return;
    }

    // Validation spécifique selon le type de création
    if (createUser && !patient) {
      if (!userData.given_name.trim()) {
        toast.error("Le prénom de l'utilisateur est requis");
        return;
      }
      if (!userData.family_name.trim()) {
        toast.error("Le nom de famille de l'utilisateur est requis");
        return;
      }
      if (!userData.health_id.trim()) {
        toast.error("L'ID santé de l'utilisateur est requis");
        return;
      }
      if (!userData.password.trim()) {
        toast.error("Le mot de passe de l'utilisateur est requis");
        return;
      }
      if (selectedRoles.length === 0) {
        toast.error("Au moins un rôle est requis pour l'utilisateur");
        return;
      }
    } else if (!patient) {
      if (!formData.owner_id) {
        toast.error("L'utilisateur existant est requis");
        return;
      }
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

    try {
      let patientData: CreatePatientRequest;

      if (createUser && !patient) {

        patientData = {
          given_name: userData.given_name || formData.given_name,
          family_name: userData.family_name || formData.family_name,
          birth_date: formData.birth_date,
          gender: formData.gender,
          location: formData.location || "",
          owner_id: null, // Sera mis à jour après création de l'utilisateur
          birth_place: formData.birth_place || null,
          residence_city: formData.residence_city, // Utiliser le code de la ville au lieu du nom
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
      } else {
        // Récupérer le code de la ville depuis le nom (label)

        patientData = {
          given_name: formData.given_name,
          family_name: formData.family_name,
          birth_date: formData.birth_date,
          gender: formData.gender,
          location: formData.location || "",
          owner_id: formData.owner_id || null,
          birth_place: formData.birth_place,
          residence_city: formData.residence_city,
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
      }

      if (patient) {
        await updatePatient({ id: patient.id_, data: patientData });
      } else {
        if (createUser && !patient) {

          (patientData as any).main_user = {
            given_name: userData.given_name,
            family_name: userData.family_name,
            health_id: userData.health_id,
            password: userData.password,
            roles: selectedRoles,
          };

          patientData.is_main = true;
        }

        await createPatient(patientData);
      }

      onSuccess();
    } catch (error) {
      // L'erreur est déjà gérée par le hook via toast
      console.error('Error saving patient:', error);
    }
  };

  const handleInputChange = (field: keyof CreatePatientRequest, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Synchronisation automatique avec les champs utilisateur si on est en mode création
    if (createUser && !patient) {
      if (field === 'given_name') {
        setUserData(prev => ({
          ...prev,
          given_name: value || ""
        }));
      } else if (field === 'family_name') {
        setUserData(prev => ({
          ...prev,
          family_name: value || ""
        }));
      }
    }
  };

  const handleRolesChange = (roles: UserRole[]) => {
    setSelectedRoles(roles);
  };

  const handleUserDataChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));

    // Synchronisation automatique avec les champs patient si on est en mode création
    if (createUser && !patient) {
      if (field === 'given_name') {
        setFormData(prev => ({
          ...prev,
          given_name: value
        }));
      } else if (field === 'family_name') {
        setFormData(prev => ({
          ...prev,
          family_name: value
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      given_name: patient?.given_name || "",
      family_name: patient?.family_name || "",
      birth_date: patient?.birth_date || "",
      gender: patient?.gender || "male",
      location: patient?.location || "",
      owner_id: patient?.owner_id || null,
      birth_place: patient?.birth_place || null,
      residence_city: patient?.residence_city || null,
      neighborhood: patient?.neighborhood || null,
      phone_number: patient?.phone_number || null,
      npi_number: patient?.npi_number || null,
      blood_group: patient?.blood_group || null,
      father_full_name: patient?.father_full_name || null,
      mother_full_name: patient?.mother_full_name || null,
      emergency_contact_name: patient?.emergency_contact_name || null,
      emergency_contact_phone: patient?.emergency_contact_phone || null,
      is_main: patient?.is_main || false,
    });

    // Réinitialiser les données utilisateur en gardant la synchronisation
    const resetUserData = {
      given_name: "",
      family_name: "",
      health_id: "",
      password: "",
    };

    // Si on est en mode création, synchroniser avec les valeurs patient actuelles
    if (createUser && !patient) {
      resetUserData.given_name = formData.given_name;
      resetUserData.family_name = formData.family_name;
    }

    setUserData(resetUserData);
    setSelectedRoles(['PATIENT']);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">
              {patient ? "Modifiez les informations du patient" : "Remplissez les informations du nouveau patient"}
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
        {/* Type de création - seulement pour l'ajout */}
        {!patient && (
          <Card>
            <CardHeader>
              <CardTitle>Type de création</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choisissez de créer un nouvel utilisateur ou d'utiliser un utilisateur existant
              </p>
            </CardHeader>
            <CardContent>
              <CreationTypeSelector
                createUser={createUser}
                onCreateUserChange={setCreateUser}
              />
            </CardContent>
          </Card>
        )}

        {/* Création d'utilisateur - seulement pour l'ajout */}
        {createUser && !patient && (
          <Card>
            <CardHeader>
              <CardTitle>Création de l'utilisateur</CardTitle>
              <p className="text-sm text-muted-foreground">
                Créez un nouvel utilisateur qui sera associé à ce patient
              </p>
            </CardHeader>
            <CardContent>
              <PatientUserCreationForm
                userData={userData}
                selectedRoles={selectedRoles}
                onUserDataChange={handleUserDataChange}
                onRolesChange={handleRolesChange}
              />
            </CardContent>
          </Card>
        )}

        {/* Sélection d'utilisateur existant - seulement pour l'ajout */}
        {!createUser && !patient && (
          <Card>
            <CardHeader>
              <CardTitle>Sélection de l'utilisateur</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sélectionnez un utilisateur existant à associer à ce patient
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <PatientOwnerSelector
                users={users}
                selectedOwner={formData.owner_id || ""}
                onOwnerChange={(value) => handleInputChange('owner_id', value)}
                isLoading={loadingUsers}
                label="Utilisateur existant"
                placeholder="Sélectionner un utilisateur existant"
                showSelector={true}
                required={true}
              />
            </CardContent>
          </Card>
        )}

        {/* Informations du patient */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PatientInformationForm
              givenName={formData.given_name}
              familyName={formData.family_name}
              birthDate={formData.birth_date}
              gender={formData.gender}
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
              Informations médicales et contacts d'urgence (optionnel)
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

        {/* Propriétaire du patient - seulement pour la modification */}
        {patient && (
          <Card>
            <CardHeader>
              <CardTitle>Propriétaire du patient</CardTitle>
              <p className="text-sm text-muted-foreground">
                Modifiez le propriétaire pour ce patient (optionnel)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <PatientOwnerSelector
                users={users}
                selectedOwner={formData.owner_id || ""}
                onOwnerChange={(value) => handleInputChange('owner_id', value)}
                isLoading={loadingUsers}
                label="Propriétaire du patient"
                placeholder="Sélectionner un propriétaire (optionnel)"
                showSelector={true}
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
                onClick={onCancel}
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
                {loading ? `${submitButtonText} en cours...` : submitButtonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
