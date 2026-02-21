import { HealthFacility, FacilityType, HealthcareLevel } from '../types/health-facility.types';

export function formatFacilityType(type: FacilityType): string {
  switch (type) {
    case FacilityType.UNIVERSITY_HOSPITAL:
      return 'Hôpital universitaire';
    case FacilityType.DEPARTMENTAL_HOSPITAL:
      return 'Hôpital départemental';
    case FacilityType.ZONE_HOSPITAL:
      return 'Hôpital de zone';
    case FacilityType.HEALTH_CENTER:
      return 'Centre de santé';
    case FacilityType.DISPENSARY:
      return 'Dispensaire';
    case FacilityType.PRIVATE_CLINIC:
      return 'Clinique privée';
    case FacilityType.MATERNITY_CLINIC:
      return 'Clinique de maternité';
    case FacilityType.MEDICAL_OFFICE:
      return 'Cabinet médical';
    case FacilityType.CONFESSIONAL_CENTER:
      return 'Centre confessionnel';
    default:
      return type;
  }
}

export function getFacilityTypeOptions(): { value: FacilityType; label: string }[] {
  return [
    { value: FacilityType.UNIVERSITY_HOSPITAL, label: "Hôpital universitaire" },
    { value: FacilityType.DEPARTMENTAL_HOSPITAL, label: "Hôpital départemental" },
    { value: FacilityType.ZONE_HOSPITAL, label: "Hôpital de zone" },
    { value: FacilityType.HEALTH_CENTER, label: "Centre de santé" },
    { value: FacilityType.DISPENSARY, label: "Dispensaire" },
    { value: FacilityType.PRIVATE_CLINIC, label: "Clinique privée" },
    { value: FacilityType.MATERNITY_CLINIC, label: "Clinique de maternité" },
    { value: FacilityType.MEDICAL_OFFICE, label: "Cabinet médical" },
    { value: FacilityType.CONFESSIONAL_CENTER, label: "Centre confessionnel" },
  ];
}

export function getHealthcareLevelOptions(): { value: HealthcareLevel; label: string }[] {
  return [
    { value: HealthcareLevel.NATIONAL, label: "National" },
    { value: HealthcareLevel.DEPARTMENTAL, label: "Départemental" },
    { value: HealthcareLevel.ZONAL, label: "Zonal" },
    { value: HealthcareLevel.COMMUNAL, label: "Communal" },
    { value: HealthcareLevel.PRIMARY, label: "Primaire" },
    { value: HealthcareLevel.PRIVATE, label: "Privé" },
  ];
}

export function getFacilityTypeBadge(type: FacilityType): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (type) {
    case FacilityType.UNIVERSITY_HOSPITAL:
      return { label: 'Hôpital universitaire', variant: 'default' };
    case FacilityType.DEPARTMENTAL_HOSPITAL:
      return { label: 'Hôpital départemental', variant: 'default' };
    case FacilityType.ZONE_HOSPITAL:
      return { label: 'Hôpital de zone', variant: 'outline' };
    case FacilityType.HEALTH_CENTER:
      return { label: 'Centre de santé', variant: 'secondary' };
    case FacilityType.DISPENSARY:
      return { label: 'Dispensaire', variant: 'outline' };
    case FacilityType.PRIVATE_CLINIC:
      return { label: 'Clinique privée', variant: 'default' };
    case FacilityType.MATERNITY_CLINIC:
      return { label: 'Clinique de maternité', variant: 'outline' };
    case FacilityType.MEDICAL_OFFICE:
      return { label: 'Cabinet médical', variant: 'secondary' };
    case FacilityType.CONFESSIONAL_CENTER:
      return { label: 'Centre confessionnel', variant: 'outline' };
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

export function canDeleteHealthFacility(facility: HealthFacility): boolean {
  return facility.deleted_at === null;
}

export function canRestoreHealthFacility(facility: HealthFacility): boolean {
  return facility.deleted_at !== null;
}
