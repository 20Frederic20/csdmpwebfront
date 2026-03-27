"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard, Button } from "@/components/UI";
import { ArrowLeft, Save, X, Activity, Users, FileText } from "lucide-react";
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
  showHeader?: boolean; // Pour afficher/masquer le header intégré
}

export function PatientForm({
  patient,
  onCancel,
  onSuccess,
  title = patient ? "Modifier le patient" : "Ajouter un patient",
  submitButtonText = patient ? "Modifier" : "Créer",
  showHeader = true
}: PatientFormProps & { showHeader?: boolean }) {
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
    <div className="min-h-screen bg-white pb-32">
      {/* Top Navigation Bar - seulement si showHeader est true */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-5xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="p-2 rounded-xl hover:bg-surface-container"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg tracking-tight">{title}</h1>
            <div className="w-10" />
          </div>
        </header>
      )}

      <main className={`${showHeader ? 'pt-20' : 'pt-6'} px-4 sm:px-6 w-full space-y-8 max-w-5xl mx-auto`}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type de création - seulement pour l'ajout */}
          {!patient && (
            <div className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold">Type de création</h2>
                <p className="text-sm text-muted-foreground">
                  Choisissez de créer un nouvel utilisateur ou d'utiliser un utilisateur existant
                </p>
              </div>
              <CreationTypeSelector
                createUser={createUser}
                onCreateUserChange={setCreateUser}
              />
            </div>
          )}

          {/* Création d'utilisateur - seulement pour l'ajout */}
          {createUser && !patient && (
            <div className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold">Création de l'utilisateur</h2>
                <p className="text-sm text-muted-foreground">
                  Créez un nouvel utilisateur qui sera associé à ce patient
                </p>
              </div>
              <PatientUserCreationForm
                userData={userData}
                selectedRoles={selectedRoles}
                onUserDataChange={handleUserDataChange}
                onRolesChange={handleRolesChange}
              />
            </div>
          )}

          {/* Sélection d'utilisateur existant - seulement pour l'ajout */}
          {!createUser && !patient && (
            <div className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold">Sélection de l'utilisateur</h2>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez un utilisateur existant à associer à ce patient
                </p>
              </div>
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
            </div>
          )}

          {/* Informations du patient */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <PatientInformationForm
              givenName={formData.given_name}
              familyName={formData.family_name}
              birthDate={formData.birth_date}
              gender={formData.gender}
              location={formData.location || ""}
              onFieldChange={handleInputChange}
            />
          </div>

          {/* Informations additionnelles */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
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
          </div>

          {/* Propriétaire du patient - seulement pour la modification */}
          {patient && (
            <div className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold">Propriétaire du patient</h2>
                <p className="text-sm text-muted-foreground">
                  Modifiez le propriétaire pour ce patient (optionnel)
                </p>
              </div>
              <PatientOwnerSelector
                users={users}
                selectedOwner={formData.owner_id || ""}
                onOwnerChange={(value) => handleInputChange('owner_id', value)}
                isLoading={loadingUsers}
                label="Propriétaire du patient"
                placeholder="Sélectionner un propriétaire (optionnel)"
                showSelector={true}
              />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6 pb-12 space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? `${submitButtonText} en cours...` : submitButtonText}
            </Button>
            <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">
              Confidentialité médicale garantie • CSDMP
            </p>
          </div>
        </form>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pt-3 pb-6 bg-background/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-surface-container-highest md:hidden">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-muted-foreground/60 px-3 py-2 hover:text-primary active:scale-90 transition-all flex-1 min-w-0">
          <Activity className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-tight truncate w-full text-center">Accueil</span>
        </Link>
        <Link href="/patients" className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-2xl px-3 py-2 active:scale-90 transition-all flex-1 min-w-0 mx-1">
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-tight truncate w-full text-center">Patients</span>
        </Link>
        <Link href="/lab-results" className="flex flex-col items-center justify-center text-muted-foreground/60 px-3 py-2 hover:text-primary active:scale-90 transition-all flex-1 min-w-0">
          <Activity className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-tight truncate w-full text-center">Analyses</span>
        </Link>
        <Link href="/billing" className="flex flex-col items-center justify-center text-muted-foreground/60 px-3 py-2 hover:text-primary active:scale-90 transition-all flex-1 min-w-0">
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-tight truncate w-full text-center">Factures</span>
        </Link>
      </nav>
    </div>
  );
}
