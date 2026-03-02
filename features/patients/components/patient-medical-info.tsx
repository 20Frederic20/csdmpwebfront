"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import { AddAllergyModal } from "./add-allergy-modal";
// import { AddLifestyleModal } from "./add-lifestyle-modal";
// import { AddMedicalHistoryModal } from "./add-medical-history-modal";
// import { AddVaccinationModal } from "./add-vaccination-modal";
// import { AddFamilyHistoryModal } from "./add-family-history-modal";
import { LifestyleSection } from "./lifestyle-section";
import { MedicalHistorySection } from "./medical-history-section";

interface PatientMedicalInfoProps {
  patientId: string;
}

type MedicalSection = 'allergies' | 'vaccinations' | 'lifestyle' | 'familyHistory' | 'medicalHistory';

interface SectionData {
  title: string;
  icon: React.ReactNode;
  key: MedicalSection;
  component: React.ReactNode;
}

export function PatientMedicalInfo({ patientId }: PatientMedicalInfoProps) {
  const [activeSection, setActiveSection] = useState<MedicalSection>('allergies');
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [lifestyle, setLifestyle] = useState<PatientLifestyle[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<PatientMedicalHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const sections: SectionData[] = [
    {
      title: 'Allergies',
      icon: <AlertCircle className="h-5 w-5" />,
      key: 'allergies',
      component: (
        <PatientAllergiesCollapse 
          patientId={patientId}
        />
      )
    },
    {
      title: 'Vaccinations',
      icon: <Syringe className="h-5 w-5" />,
      key: 'vaccinations',
      component: (
        <div className="text-center py-8">
          <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Section vaccinations en cours de développement.
          </p>
        </div>
      )
    },
    {
      title: 'Style de vie',
      icon: <Heart className="h-5 w-5" />,
      key: 'lifestyle',
      component: (
        <LifestyleSection 
          lifestyle={lifestyle}
          loading={loading}
          patientId={patientId}
          onLifestyleAdded={() => loadLifestyle()}
        />
      )
    },
    {
      title: 'Antécédents médicaux',
      icon: <FileText className="h-5 w-5" />,
      key: 'medicalHistory',
      component: (
        <MedicalHistorySection 
          medicalHistory={medicalHistory}
          loading={loading}
          patientId={patientId}
          onMedicalHistoryAdded={() => loadMedicalHistory()}
        />
      )
    },
    {
      title: 'Antécédents familiaux',
      icon: <Activity className="h-5 w-5" />,
      key: 'familyHistory',
      component: (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Section antécédents familiaux en cours de développement.
          </p>
        </div>
      )
    }
  ];

  const loadAllergies = async () => {
    try {
      setLoading(true);
      const data = await AllergiesService.getPatientAllergies({ patient_id: patientId }, token || undefined);
      setAllergies(data.allergies || []);
    } catch (error) {
      console.error('Error loading allergies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLifestyle = async () => {
    try {
      setLoading(true);
      const data = await LifestyleService.getPatientLifestyle({ patient_id: patientId }, token || undefined);
      setLifestyle(data.data || []);
    } catch (error) {
      console.error('Error loading lifestyle:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalHistory = async () => {
    try {
      setLoading(true);
      const data = await MedicalHistoryService.getPatientMedicalHistory({ patient_id: patientId }, token || undefined);
      setMedicalHistory(data.data || []);
    } catch (error) {
      console.error('Error loading medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données initiales
  useState(() => {
    loadAllergies();
    loadLifestyle();
    loadMedicalHistory();
  });

  const currentSection = sections.find(section => section.key === activeSection);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {currentSection?.icon}
            Informations médicales
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Navigation par onglets */}
        <div className="flex space-x-1 mb-6 border-b">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeSection === section.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Contenu de la section active */}
        <div className="mt-6">
          {currentSection?.component}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant temporaire pour les allergies
function PatientAllergiesCollapse({ patientId }: { patientId: string }) {
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthToken();

  const loadAllergies = async () => {
    try {
      setLoading(true);
      const data = await AllergiesService.getPatientAllergies({ patient_id: patientId }, token || undefined);
      setAllergies(data.allergies || []);
    } catch (error) {
      console.error('Error loading allergies:', error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    loadAllergies();
  });

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
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto">
      {allergies.map((allergy, index) => {
        if (!allergy) return null;
        const severityBadge = getAllergySeverityBadge(allergy);
        const typeBadge = getAllergenTypeBadge(allergy.allergen_type);
        
        return (
          <div key={(allergy as any).id || index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Allergène:</span>
                  <span className="text-sm">{typeBadge.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sévérité:</span>
                  <span className="text-sm">{severityBadge.label}</span>
                </div>
                <div>
                  <span className="font-medium">Réaction:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {allergy.reaction || 'Aucune réaction'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
