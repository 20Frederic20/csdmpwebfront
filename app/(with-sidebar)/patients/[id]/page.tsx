"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, User, Phone, MapPin, Calendar, Heart, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Patient, usePatient } from "@/features/patients";
import { Badge } from "@/components/ui/badge";
import { PatientDetailTabs } from "@/features/patients/components/patient-detail-tabs";
import { PatientResponse } from "@/features/patients/types/patient-detail.types";
import { Activity } from "lucide-react";
import { useLabResults } from "@/features/lab-results/hooks/use-lab-results";
import { getEvolutionData } from "@/features/lab-results/utils/analytics.utils";
import { LabEvolutionChart } from "@/components/charts/LabEvolutionChart";
import { TEST_FIELDS_CONFIG } from "@/features/lab-results/config/test-fields.config";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const { data: patientData, isLoading: loading, error: queryError } = usePatient(patientId);
  const patient = patientData as PatientResponse | undefined;

  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Récupérer les examens pour l'analytique
  const { data: labResultsData, isLoading: loadingLabs, isFetching } = useLabResults(
    { patient_id: patientId, limit: 100 },
    { enabled: isAnalyticsOpen }
  );
  const labResults = labResultsData?.data || [];

  // Extraire automatiquement tous les test numériques disponibles
  const numericFields: any[] = [];
  (Object.values(TEST_FIELDS_CONFIG) as any[][]).forEach((categoryFields) => {
    categoryFields.forEach((field: any) => {
      if (field.type === 'number' && !numericFields.find(f => f.name === field.name)) {
        numericFields.push(field);
      }
    });
  });

  const availableCharts = numericFields
    .map(field => ({
      field,
      history: getEvolutionData(labResults, field.name)
    }))
    .filter(item => item.history.length > 0);

  // Gérer les erreurs de chargement
  useEffect(() => {
    if (queryError) {
      toast.error("Erreur lors du chargement du patient");
      router.push('/patients');
    }
  }, [queryError, router]);

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
                <p className="text-sm text-muted-foreground">Nom du père</p>
                <p className="font-medium">{patient.father_full_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom de la mère</p>
                <p className="font-medium">{patient.mother_full_name || '-'}</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {patient.phone_number || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localisation</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {patient.location || '-'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID Santé</p>
                <p className="font-medium">{patient.health_id || '-'}</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact d'urgence</p>
                <p className="font-medium">{patient.emergency_contact_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{patient.emergency_contact_phone || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NOUVELLE SECTION : ANALYTICS */}
      <Collapsible
        open={isAnalyticsOpen}
        onOpenChange={setIsAnalyticsOpen}
        className="w-full space-y-4 border rounded-lg p-4 bg-muted/20"
      >
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" /> Évolution des constantes
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isAnalyticsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-4 pt-4">
          {isFetching || loadingLabs ? (
            <div className="flex justify-center p-8 text-muted-foreground">Téléchargement et analyse des données...</div>
          ) : availableCharts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCharts.map(({ field, history }) => (
                <LabEvolutionChart 
                  key={field.name}
                  title={field.label} 
                  unit={field.unit || ""}
                  data={history} 
                  minRef={field.defaultMin} 
                  maxRef={field.defaultMax} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                <Activity className="h-8 w-8 mb-2 opacity-50" />
                <p>Aucune donnée numérique n'a encore été saisie pour ce patient.</p>
                <p className="text-sm">L'ajout de champs numériques (ex: Hémoglobine, Glycémie) générera des graphiques automatiquement.</p>
              </CardContent>
            </Card>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Tabs pour les informations médicales détaillées */}
      <PatientDetailTabs patient={patient} patientId={patientId} />
    </div>
  );
}
