"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, User, Phone, MapPin, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import { Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { useAuthToken } from "@/hooks/use-auth-token";
import { Badge } from "@/components/ui/badge";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const { token } = useAuthToken();

  // Charger le patient
  useEffect(() => {
    const loadPatient = async () => {
      setLoading(true);
      try {
        const patientData = await PatientService.getPatientById(patientId, token || undefined);
        setPatient(patientData);
      } catch (error: any) {
        console.error('Error loading patient:', error);
        toast.error(error.message || "Erreur lors du chargement du patient");
        router.push('/patients');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      loadPatient();
    }
  }, [patientId, token, router]);

  if (loading) {
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

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Masculin';
      case 'female': return 'Féminin';
      case 'other': return 'Autre';
      case 'unknown': return 'Inconnu';
      default: return gender;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

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
            <h1 className="text-3xl font-bold tracking-tight">
              {patient.given_name} {patient.family_name}
            </h1>
            <p className="text-muted-foreground">
              Détails du patient
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push(`/patients/${patientId}/edit`)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prénom</p>
                <p className="font-medium">{patient.given_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{patient.family_name || '-'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(patient.birth_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium">{getGenderLabel(patient.gender)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Localisation</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {patient.location || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">ID Santé</p>
              <p className="font-medium">{patient.health_id || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Informations médicales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Lieu de naissance</p>
                <p className="font-medium">{patient.birth_place || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ville de résidence</p>
                <p className="font-medium">{patient.residence_city || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quartier</p>
                <p className="font-medium">{patient.neighborhood || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Groupe sanguin</p>
                <p className="font-medium">{patient.blood_group || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Numéro NPI</p>
                <p className="font-medium">{patient.npi_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <div className="flex gap-2">
                  <Badge variant={patient.is_active ? "default" : "secondary"}>
                    {patient.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                  {patient.is_main && (
                    <Badge variant="outline">Principal</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact du patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{patient.phone_number || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact d'urgence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p className="font-medium">{patient.emergency_contact_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{patient.emergency_contact_phone || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Famille */}
      <Card>
        <CardHeader>
          <CardTitle>Informations familiales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom du père</p>
              <p className="font-medium">{patient.father_full_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nom de la mère</p>
              <p className="font-medium">{patient.mother_full_name || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
