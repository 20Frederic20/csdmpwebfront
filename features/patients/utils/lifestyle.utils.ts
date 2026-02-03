import { PatientLifestyle } from '../types/lifestyle.types';
import { Badge } from '@/components/ui/badge';

export function formatTobaccoStatus(status: string): string {
  switch (status) {
    case 'never':
      return 'Jamais';
    case 'former':
      return 'Ancien fumeur';
    case 'current':
      return 'Fumeur actuel';
    default:
      return status;
  }
}

export function formatAlcoholConsumption(consumption: string): string {
  switch (consumption) {
    case 'none':
      return 'Aucune';
    case 'occasional':
      return 'Occasionnelle';
    case 'frequent':
      return 'Fréquente';
    default:
      return consumption;
  }
}

export function formatPhysicalActivity(activity: string): string {
  switch (activity) {
    case 'sedentary':
      return 'Sédentaire';
    case 'moderate':
      return 'Modérée';
    case 'active':
      return 'Active';
    default:
      return activity;
  }
}

export function getTobaccoStatusBadge(status: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (status) {
    case 'never':
      return { label: 'Jamais', variant: 'secondary' };
    case 'former':
      return { label: 'Ancien fumeur', variant: 'outline' };
    case 'current':
      return { label: 'Fumeur actuel', variant: 'destructive' };
    default:
      return { label: status, variant: 'outline' };
  }
}

export function getAlcoholConsumptionBadge(consumption: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (consumption) {
    case 'none':
      return { label: 'Aucune', variant: 'secondary' };
    case 'occasional':
      return { label: 'Occasionnelle', variant: 'outline' };
    case 'frequent':
      return { label: 'Fréquente', variant: 'default' };
    default:
      return { label: consumption, variant: 'outline' };
  }
}

export function getPhysicalActivityBadge(activity: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (activity) {
    case 'sedentary':
      return { label: 'Sédentaire', variant: 'destructive' };
    case 'moderate':
      return { label: 'Modérée', variant: 'default' };
    case 'active':
      return { label: 'Active', variant: 'default' };
    default:
      return { label: activity, variant: 'outline' };
  }
}

export function getLifestyleSummary(lifestyle: PatientLifestyle): string[] {
  const summary: string[] = [];
  
  if (lifestyle.tobacco_status !== 'never') {
    summary.push(formatTobaccoStatus(lifestyle.tobacco_status));
  }
  
  if (lifestyle.alcohol_consumption !== 'none') {
    summary.push(`Alcool: ${formatAlcoholConsumption(lifestyle.alcohol_consumption)}`);
  }
  
  summary.push(`Activité: ${formatPhysicalActivity(lifestyle.physical_activity)}`);
  
  if (lifestyle.tobacco_per_week) {
    summary.push(`${lifestyle.tobacco_per_week} cigarettes/semaine`);
  }
  
  if (lifestyle.alcohol_units_per_week) {
    summary.push(`${lifestyle.alcohol_units_per_week} unités alcool/semaine`);
  }
  
  if (lifestyle.dietary_regime) {
    summary.push(`Régime: ${lifestyle.dietary_regime}`);
  }
  
  if (lifestyle.occupational_risks) {
    summary.push(`Risques: ${lifestyle.occupational_risks}`);
  }
  
  return summary;
}
