import { Department, HospitalDepartment } from '../types/departments.types';

export function formatDepartmentName(department: Department): string {
  return department.name || '';
}

export function formatDepartmentCode(code: HospitalDepartment): string {
  const codeLabels: Record<HospitalDepartment, string> = {
    [HospitalDepartment.EMERGENCY]: 'Urgences',
    [HospitalDepartment.INTENSIVE_CARE]: 'Soins intensifs',
    [HospitalDepartment.SURGERY]: 'Chirurgie',
    [HospitalDepartment.PEDIATRICS]: 'Pédiatrie',
    [HospitalDepartment.OBSTETRICS_GYNECOLOGY]: 'Obstétrique-Gynécologie',
    [HospitalDepartment.CARDIOLOGY]: 'Cardiologie',
    [HospitalDepartment.NEUROLOGY]: 'Neurologie',
    [HospitalDepartment.ONCOLOGY]: 'Oncologie',
    [HospitalDepartment.RADIOLOGY]: 'Radiologie',
    [HospitalDepartment.LABORATORY]: 'Laboratoire',
    [HospitalDepartment.PHARMACY]: 'Pharmacie',
    [HospitalDepartment.OUTPATIENT]: 'Consultations externes',
    [HospitalDepartment.INPATIENT]: 'Hospitalisation',
    [HospitalDepartment.MATERNITY]: 'Maternité',
    [HospitalDepartment.NEONATAL]: 'Néonatalogie',
    [HospitalDepartment.PSYCHIATRY]: 'Psychiatrie',
    [HospitalDepartment.DENTISTRY]: 'Dentisterie',
    [HospitalDepartment.OPHTHALMOLOGY]: 'Ophtalmologie',
    [HospitalDepartment.ORTHOPEDICS]: 'Orthopédie',
    [HospitalDepartment.DERMATOLOGY]: 'Dermatologie',
    [HospitalDepartment.INFECTIOUS_DISEASES]: 'Maladies infectieuses',
    [HospitalDepartment.INTERNAL_MEDICINE]: 'Médecine interne',
    [HospitalDepartment.ANESTHESIOLOGY]: 'Anesthésiologie',
    [HospitalDepartment.PATHOLOGY]: 'Pathologie',
    [HospitalDepartment.NUTRITION]: 'Nutrition',
    [HospitalDepartment.REHABILITATION]: 'Rééducation',
    [HospitalDepartment.EMERGENCY_ROOM]: 'Salle d\'urgence',
    [HospitalDepartment.INTENSIVE_CARE_UNIT]: 'Unité de soins intensifs',
    [HospitalDepartment.PEDIATRIC_EMERGENCY]: 'Urgences pédiatriques',
    [HospitalDepartment.SURGICAL_EMERGENCY]: 'Urgences chirurgicales',
    [HospitalDepartment.OBSTETRIC_EMERGENCY]: 'Urgences obstétriques',
  };

  return codeLabels[code] || code;
}

export function getDepartmentStatusBadge(isActive: boolean, deletedAt?: string | null) {
  if (deletedAt) {
    return { label: 'Supprimé', variant: 'destructive' as const };
  }
  
  if (!isActive) {
    return { label: 'Inactif', variant: 'secondary' as const };
  }
  
  return { label: 'Actif', variant: 'default' as const };
}

export function getDepartmentInitial(department: Department): string {
  const name = formatDepartmentName(department);
  return name.charAt(0).toUpperCase();
}

export function getDepartmentAvatarColor(department: Department): string {
  if (department.deleted_at) return 'bg-gray-100 text-gray-500';
  if (!department.is_active) return 'bg-gray-100 text-gray-500';
  return 'bg-blue-100 text-blue-700';
}

export function getDepartmentDetailUrl(department: Department): string {
  return `/departments/${department.id_}`;
}
