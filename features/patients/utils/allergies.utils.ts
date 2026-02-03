import { PatientAllergy } from '../types/allergies.types';

export function formatAllergenType(type: string): string {
  switch (type) {
    case 'food':
      return 'Alimentaire';
    case 'medication':
      return 'Médicamenteuse';
    case 'environmental':
      return 'Environnementale';
    case 'other':
      return 'Autre';
    default:
      return type;
  }
}

export function formatAllergySeverity(severity: string): string {
  switch (severity) {
    case 'mild':
      return 'Légère';
    case 'moderate':
      return 'Modérée';
    case 'severe':
      return 'Sévère';
    case 'absolutely_contraindicated':
      return 'Contre-indiquée';
    default:
      return severity;
  }
}

export function formatAllergySource(source: string): string {
  switch (source) {
    case 'manual':
      return 'Manuelle';
    case 'ocr':
      return 'OCR';
    case 'prev_cons':
      return 'Consultation précédente';
    default:
      return source;
  }
}

export const getAllergySeverityBadge = (allergy: PatientAllergy) => {
  switch (allergy.severity) {
    case 'mild':
      return { label: 'Légère', variant: 'secondary' as const };
    case 'moderate':
      return { label: 'Modérée', variant: 'default' as const };
    case 'severe':
      return { label: 'Sévère', variant: 'destructive' as const };
    case 'absolutely_contraindicated':
      return { label: 'Contre-indiquée', variant: 'destructive' as const };
    default:
      return { label: allergy.severity, variant: 'outline' as const };
  }
};

export const getAllergenTypeBadge = (type: string) => {
  switch (type) {
    case 'food':
      return { label: 'Alimentaire', variant: 'secondary' as const };
    case 'medication':
      return { label: 'Médicamenteuse', variant: 'default' as const };
    case 'environmental':
      return { label: 'Environnementale', variant: 'outline' as const };
    case 'other':
      return { label: 'Autre', variant: 'secondary' as const };
    default:
      return { label: type, variant: 'outline' as const };
  }
};
