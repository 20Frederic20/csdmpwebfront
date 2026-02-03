import { PatientMedicalHistory } from '../types/medical-history.types';
import { Badge } from '@/components/ui/badge';

export function formatMedicalCategory(category: string): string {
  switch (category) {
    case 'medical':
      return 'Médical';
    case 'surgical':
      return 'Chirurgical';
    case 'obstetric':
      return 'Obstétrique';
    default:
      return category;
  }
}

export function formatMedicalStatus(status: string): string {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'resolved':
      return 'Résolu';
    case 'chronic':
      return 'Chronique';
    default:
      return status;
  }
}

export function formatMedicalSeverity(severity: string): string {
  switch (severity) {
    case 'mild':
      return 'Léger';
    case 'moderate':
      return 'Modéré';
    case 'severe':
      return 'Sévère';
    default:
      return severity;
  }
}

export function getMedicalCategoryBadge(category: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (category) {
    case 'medical':
      return { label: 'Médical', variant: 'default' };
    case 'surgical':
      return { label: 'Chirurgical', variant: 'outline' };
    case 'obstetric':
      return { label: 'Obstétrique', variant: 'secondary' };
    default:
      return { label: category, variant: 'outline' };
  }
}

export function getMedicalStatusBadge(status: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (status) {
    case 'active':
      return { label: 'Actif', variant: 'destructive' };
    case 'resolved':
      return { label: 'Résolu', variant: 'secondary' };
    case 'chronic':
      return { label: 'Chronique', variant: 'default' };
    default:
      return { label: status, variant: 'outline' };
  }
}

export function getMedicalSeverityBadge(severity: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (severity) {
    case 'mild':
      return { label: 'Léger', variant: 'secondary' };
    case 'moderate':
      return { label: 'Modéré', variant: 'outline' };
    case 'severe':
      return { label: 'Sévère', variant: 'destructive' };
    default:
      return { label: severity, variant: 'outline' };
  }
}

export function getMedicalHistorySummary(medicalHistory: PatientMedicalHistory): string[] {
  const summary: string[] = [];
  
  summary.push(formatMedicalCategory(medicalHistory.category));
  summary.push(formatMedicalStatus(medicalHistory.status));
  summary.push(formatMedicalSeverity(medicalHistory.severity));
  
  if (medicalHistory.code) {
    summary.push(`Code: ${medicalHistory.code}`);
  }
  
  if (medicalHistory.onset_date) {
    summary.push(`Début: ${new Date(medicalHistory.onset_date).toLocaleDateString('fr-FR')}`);
  }
  
  if (medicalHistory.resolution_date) {
    summary.push(`Résolution: ${new Date(medicalHistory.resolution_date).toLocaleDateString('fr-FR')}`);
  }
  
  return summary;
}

export function sortMedicalHistoryByDate(histories: PatientMedicalHistory[], order: 'asc' | 'desc' = 'desc'): PatientMedicalHistory[] {
  return [...histories].sort((a, b) => {
    const dateA = new Date(a.onset_date).getTime();
    const dateB = new Date(b.onset_date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function filterActiveMedicalHistory(histories: PatientMedicalHistory[]): PatientMedicalHistory[] {
  return histories.filter(history => history.is_active);
}

export function filterByCategory(histories: PatientMedicalHistory[], category: string): PatientMedicalHistory[] {
  return histories.filter(history => history.category === category);
}
