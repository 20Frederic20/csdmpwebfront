import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, ChevronDown, ChevronUp, Syringe, Heart, FileText, Activity } from "lucide-react";
import { PatientAllergy } from "@/features/patients/types/allergies.types";
import { AllergiesService } from "@/features/patients/services/allergies.service";
import { formatAllergenType, formatAllergySeverity, getAllergySeverityBadge, getAllergenTypeBadge } from "@/features/patients/utils/allergies.utils";
import { PatientLifestyle } from "@/features/patients/types/lifestyle.types";
import { LifestyleService } from "@/features/patients/services/lifestyle.service";
import { PatientMedicalHistory } from "@/features/patients/types/medical-history.types";
import { MedicalHistoryService } from "@/features/patients/services/medical-history.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { AddAllergyModal } from "./add-allergy-modal";
import { AddLifestyleModal } from "./add-lifestyle-modal";
import { AddMedicalHistoryModal } from "./add-medical-history-modal";
import { LifestyleSection } from "./lifestyle-section";
import { MedicalHistorySection } from "./medical-history-section";

interface PatientMedicalInfoProps {
  patientId: string;
}

type MedicalSection = 'allergies' | 'vaccinations' | 'lifestyle' | 'familyHistory' | 'medicalHistory';

interface SectionData {
  allergies: PatientAllergy[];
  vaccinations: any[];
  lifestyle: PatientLifestyle[];
  familyHistory: any[];
  medicalHistory: PatientMedicalHistory[];
}

export function PatientMedicalInfo({ patientId }: PatientMedicalInfoProps) {
  const [data, setData] = useState<SectionData>({
    allergies: [],
    vaccinations: [],
    lifestyle: [],
    familyHistory: [],
    medicalHistory: [],
  });
  const [loading, setLoading] = useState<{ [key in MedicalSection]?: boolean }>({});
  const [openSections, setOpenSections] = useState<{ [key in MedicalSection]?: boolean }>({});
  const [loadedSections, setLoadedSections] = useState<{ [key in MedicalSection]?: boolean }>({});
  const { token } = useAuthToken();

  const loadSection = async (section: MedicalSection) => {
    if (loadedSections[section] && data[section].length > 0) {
      // Si déjà chargé et on a des données, ne pas recharger
      return;
    }

    setLoading(prev => ({ ...prev, [section]: true }));

    try {
      switch (section) {
        case 'allergies':
          const allergiesData = await AllergiesService.getPatientAllergies({ patient_id: patientId }, token || undefined);
          const allergiesArray = (allergiesData as any)?.data || [];
          setData(prev => ({ ...prev, allergies: allergiesArray }));
          break;
        // TODO: Ajouter les autres sections quand les APIs seront prêtes
        case 'vaccinations':
          // const vaccinationsData = await VaccinationsService.getPatientVaccinations(patientId, token);
          setData(prev => ({ ...prev, vaccinations: [] }));
          break;
        case 'lifestyle':
          const lifestyleData = await LifestyleService.getPatientLifestyle({ patient_id: patientId }, token || undefined);
          const lifestyleArray = (lifestyleData as any)?.data || [];
          setData(prev => ({ ...prev, lifestyle: lifestyleArray }));
          break;
        case 'familyHistory':
          // const familyHistoryData = await FamilyHistoryService.getPatientFamilyHistory(patientId, token);
          setData(prev => ({ ...prev, familyHistory: [] }));
          break;
        case 'medicalHistory':
          const medicalHistoryData = await MedicalHistoryService.getPatientMedicalHistory({ patient_id: patientId }, token || undefined);
          const medicalHistoryArray = (medicalHistoryData as any)?.data || [];
          setData(prev => ({ ...prev, medicalHistory: medicalHistoryArray }));
          break;
      }
      setLoadedSections(prev => ({ ...prev, [section]: true }));
    } catch (error) {
      console.error(`Error loading ${section}:`, error);
      setData(prev => ({ ...prev, [section]: [] }));
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleToggle = (section: MedicalSection) => {
    if (!openSections[section]) {
      // On va ouvrir, charger les données si besoin
      loadSection(section);
    }
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAllergyAdded = () => {
    // Recharger les allergies quand on en ajoute une
    setLoadedSections(prev => ({ ...prev, allergies: false }));
    loadSection('allergies');
  };

  const handleLifestyleAdded = () => {
    // Recharger le style de vie quand on en ajoute un
    setLoadedSections(prev => ({ ...prev, lifestyle: false }));
    loadSection('lifestyle');
  };

  const handleMedicalHistoryAdded = () => {
    // Recharger les antécédents médicaux quand on en ajoute un
    setLoadedSections(prev => ({ ...prev, medicalHistory: false }));
    loadSection('medicalHistory');
  };

  const sections = [
    {
      key: 'allergies' as MedicalSection,
      title: 'Allergies',
      icon: AlertCircle,
      count: loadedSections.allergies ? data.allergies.length : undefined,
      component: (
        <AllergiesSection 
          allergies={data.allergies} 
          loading={loading.allergies || false}
          patientId={patientId}
          onAllergyAdded={handleAllergyAdded}
        />
      )
    },
    {
      key: 'vaccinations' as MedicalSection,
      title: 'Vaccinations',
      icon: Syringe,
      count: loadedSections.vaccinations ? data.vaccinations.length : undefined,
      component: (
        <ComingSoonSection title="Vaccinations" />
      )
    },
    {
      key: 'lifestyle' as MedicalSection,
      title: 'Style de vie',
      icon: Activity,
      count: loadedSections.lifestyle ? data.lifestyle.length : undefined,
      component: (
        <LifestyleSection 
          lifestyle={data.lifestyle} 
          loading={loading.lifestyle || false}
          patientId={patientId}
          onLifestyleAdded={handleLifestyleAdded}
        />
      )
    },
    {
      key: 'familyHistory' as MedicalSection,
      title: 'Antécédents familiaux',
      icon: Heart,
      count: loadedSections.familyHistory ? data.familyHistory.length : undefined,
      component: (
        <ComingSoonSection title="Antécédents familiaux" />
      )
    },
    {
      key: 'medicalHistory' as MedicalSection,
      title: 'Historique médical',
      icon: FileText,
      count: loadedSections.medicalHistory ? data.medicalHistory.length : undefined,
      component: (
        <MedicalHistorySection 
          medicalHistory={data.medicalHistory} 
          loading={loading.medicalHistory || false}
          patientId={patientId}
          onMedicalHistoryAdded={handleMedicalHistoryAdded}
        />
      )
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const Icon = section.icon;
        const isOpen = openSections[section.key] || false;
        
        return (
          <Card key={section.key}>
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleToggle(section.key)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="flex items-center gap-2">
                    {section.title}
                    {section.count !== undefined && `(${section.count})`}
                  </CardTitle>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            
            {isOpen && (
              <CardContent>
                {section.component}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function AllergiesSection({ allergies, loading, patientId, onAllergyAdded }: {
  allergies: PatientAllergy[];
  loading: boolean;
  patientId: string;
  onAllergyAdded: () => void;
}) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Chargement des allergies...</p>
      </div>
    );
  }

  if (!Array.isArray(allergies) || allergies.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          Aucune allergie enregistrée pour ce patient.
        </p>
        <AddAllergyModal patientId={patientId} onAllergyAdded={onAllergyAdded} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddAllergyModal patientId={patientId} onAllergyAdded={onAllergyAdded} />
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {allergies.map((allergy, index) => {
          if (!allergy) return null;
          const severityBadge = getAllergySeverityBadge(allergy);
          const typeBadge = getAllergenTypeBadge(allergy.allergen_type);
          
          return (
            <div key={(allergy as any).id_ || index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{allergy.allergen}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Réaction: {allergy.reaction}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={severityBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                    {severityBadge.label}
                  </Badge>
                  <Badge variant={typeBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                    {typeBadge.label}
                  </Badge>
                </div>
              </div>
              
              {allergy.notes && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                  <strong>Notes:</strong> {allergy.notes}
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Sévérité: {formatAllergySeverity(allergy.severity)}</span>
                <span>Type: {formatAllergenType(allergy.allergen_type)}</span>
                <span>Source: {allergy.source}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComingSoonSection({ title }: { title: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        {title} bientôt disponible...
      </p>
    </div>
  );
}
