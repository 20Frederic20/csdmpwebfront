import { PatientLifestyle } from '../types/lifestyle.types';
import { Badge } from '@/components/ui/badge';

export function formatSmokingStatus(status: string): string {
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
    case 'regular':
      return 'Régulière';
    case 'heavy':
      return 'Importante';
    default:
      return consumption;
  }
}

export function formatPhysicalActivity(activity: string): string {
  switch (activity) {
    case 'sedentary':
      return 'Sédentaire';
    case 'light':
      return 'Légère';
    case 'moderate':
      return 'Modérée';
    case 'intense':
      return 'Intense';
    default:
      return activity;
  }
}

export function formatDietType(diet: string): string {
  switch (diet) {
    case 'omnivore':
      return 'Omnivore';
    case 'vegetarian':
      return 'Végétarien';
    case 'vegan':
      return 'Végétalien';
    case 'pescatarian':
      return 'Pescétarien';
    case 'gluten_free':
      return 'Sans gluten';
    case 'other':
      return 'Autre';
    default:
      return diet;
  }
}

export function formatStressLevel(level: string): string {
  switch (level) {
    case 'low':
      return 'Faible';
    case 'moderate':
      return 'Modéré';
    case 'high':
      return 'Élevé';
    default:
      return level;
  }
}

export function getSmokingStatusBadge(status: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
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
    case 'regular':
      return { label: 'Régulière', variant: 'default' };
    case 'heavy':
      return { label: 'Importante', variant: 'destructive' };
    default:
      return { label: consumption, variant: 'outline' };
  }
}

export function getPhysicalActivityBadge(activity: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (activity) {
    case 'sedentary':
      return { label: 'Sédentaire', variant: 'destructive' };
    case 'light':
      return { label: 'Légère', variant: 'outline' };
    case 'moderate':
      return { label: 'Modérée', variant: 'default' };
    case 'intense':
      return { label: 'Intense', variant: 'default' };
    default:
      return { label: activity, variant: 'outline' };
  }
}

export function getStressLevelBadge(level: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (level) {
    case 'low':
      return { label: 'Faible', variant: 'secondary' };
    case 'moderate':
      return { label: 'Modéré', variant: 'outline' };
    case 'high':
      return { label: 'Élevé', variant: 'destructive' };
    default:
      return { label: level, variant: 'outline' };
  }
}

export function getLifestyleSummary(lifestyle: PatientLifestyle): string[] {
  const summary: string[] = [];
  
  if (lifestyle.smoking_status !== 'never') {
    summary.push(formatSmokingStatus(lifestyle.smoking_status));
  }
  
  if (lifestyle.alcohol_consumption !== 'none') {
    summary.push(`Alcool: ${formatAlcoholConsumption(lifestyle.alcohol_consumption)}`);
  }
  
  summary.push(`Activité: ${formatPhysicalActivity(lifestyle.physical_activity)}`);
  summary.push(`Régime: ${formatDietType(lifestyle.diet_type)}`);
  summary.push(`Stress: ${formatStressLevel(lifestyle.stress_level)}`);
  
  return summary;
}
