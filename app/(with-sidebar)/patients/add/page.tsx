"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { User, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users";
import { useAuthToken } from "@/hooks/use-auth-token";
import CustomSelect from '@/components/ui/custom-select';

export default function AddPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    given_name: "",
    family_name: "",
    birth_date: "",
    gender: "male" as "male" | "female" | "other" | "unknown",
    location: "",
    owner_id: "",
  });
  // Convertir les utilisateurs en options pour CustomSelect
  const userOptions = [
    { value: 'none', label: 'Aucun' },
    ...users.map((user) => ({
      value: user.id_,
      label: `${user.given_name} ${user.family_name} (${user.id_})`
    }))
  ];

  // Options pour le genre
  const genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' },
    { value: 'unknown', label: 'Inconnu' }
  ];
  const { token } = useAuthToken();

  // Charger tous les utilisateurs actifs au démarrage
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const params: ListUsersQueryParams = {
          limit: 50, // Plus de résultats pour la recherche
          is_active: true,
        };
        const response = await UserService.getUsers(params, token || undefined);
        setUsers(response.data || []);
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
    if (!formData.gender) {
      toast.error("Le genre est requis");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("La localisation est requise");
      return;
    }

    setLoading(true);
    try {
      await PatientService.createPatient(formData, token || undefined);
      toast.success("Patient créé avec succès");
      router.push('/patients');
    } catch (error: any) {
      console.error('Error creating patient:', error);
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[] | null) => {
    // Convertir "none" en null/undefined pour owner_id
    const actualValue = field === 'owner_id' && (value === 'none' || value === null) ? null : 
                       field === 'gender' ? value as "male" | "female" | "other" | "unknown" : 
                       value;
    setFormData(prev => ({
      ...prev,
      [field]: actualValue
    }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/patients')}
          className="cursor-pointer h-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau patient</h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau patient au système
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="given_name">Prénom *</Label>
                <Input
                  id="given_name"
                  value={formData.given_name}
                  onChange={(e) => handleInputChange('given_name', e.target.value)}
                  placeholder="Entrez le prénom du patient"
                  required
                  className="h-12"
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
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Date de naissance *</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Genre *</Label>
                <CustomSelect
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => handleInputChange('gender', value)}
                  placeholder="Sélectionner le genre"
                  className="h-12"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Entrez la localisation (adresse, ville, etc.)"
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="owner_id">ID du propriétaire</Label>
                <CustomSelect
                  options={userOptions}
                  value={formData.owner_id || "none"}
                  onChange={(value) => handleInputChange('owner_id', value)}
                  placeholder="Sélectionner un propriétaire (optionnel)"
                  isLoading={loadingUsers}
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6 flex justify-end">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/patients')}
                className="cursor-pointer h-12"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer h-12"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Création..." : "Créer le patient"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
