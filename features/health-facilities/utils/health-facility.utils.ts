import { HealthFacility } from '../types/health-facility.types';
import { Badge } from '@/components/ui/badge';

export function formatFacilityType(type: string): string {
  switch (type) {
    case 'university_hospital':
      return 'Hôpital universitaire';
    case 'departmental_hospital':
      return 'Hôpital départemental';
    case 'zone_hospital':
      return 'Hôpital de zone';
    case 'health_center':
      return 'Centre de santé';
    case 'dispensary':
      return 'Dispensaire';
    case 'private_clinic':
      return 'Clinique privée';
    default:
      return type;
  }
}

export function getFacilityTypeBadge(type: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (type) {
    case 'university_hospital':
      return { label: 'Hôpital universitaire', variant: 'default' };
    case 'departmental_hospital':
      return { label: 'Hôpital départemental', variant: 'default' };
    case 'zone_hospital':
      return { label: 'Hôpital de zone', variant: 'outline' };
    case 'health_center':
      return { label: 'Centre de santé', variant: 'secondary' };
    case 'dispensary':
      return { label: 'Dispensaire', variant: 'outline' };
    case 'private_clinic':
      return { label: 'Clinique privée', variant: 'default' };
    default:
      return { label: type, variant: 'outline' };
  }
}

export function formatHealthFacilityStatus(status: boolean): string {
  return status ? 'Actif' : 'Inactif';
}

export function getHealthFacilityStatusBadge(status: boolean): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  return status 
    ? { label: 'Actif', variant: 'default' }
    : { label: 'Inactif', variant: 'destructive' };
}

export function getFacilityTypeOptions(): { value: string; label: string }[] {
  return [
    { value: "university_hospital", label: "Hôpital universitaire" },
    { value: "departmental_hospital", label: "Hôpital départemental" },
    { value: "zone_hospital", label: "Hôpital de zone" },
    { value: "health_center", label: "Centre de santé" },
    { value: "dispensary", label: "Dispensaire" },
    { value: "private_clinic", label: "Clinique privée" },
  ];
}
