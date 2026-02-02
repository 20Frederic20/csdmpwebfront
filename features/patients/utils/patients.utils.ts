import { Patient } from '../types/patients.types';

export const formatPatientName = (patient: Patient): string => {
  return `${patient.given_name} ${patient.family_name}`;
};

export const formatBirthDate = (birthDate: string): string => {
  try {
    const date = new Date(birthDate);
    return date.toLocaleDateString('fr-FR');
  } catch {
    return birthDate;
  }
};

export function formatGender(gender: string): string {
  switch (gender) {
    case 'male':
      return 'Homme';
    case 'female':
      return 'Femme';
    case 'other':
      return 'Autre';
    case 'unknown':
      return 'Inconnu';
    default:
      return gender;
  }
};

export const getPatientStatus = (patient: Patient): 'active' | 'inactive' => {
  return patient.is_active ? 'active' : 'inactive';
};

export const getPatientStatusBadge = (patient: Patient) => {
  const status = getPatientStatus(patient);
  return {
    label: status === 'active' ? 'Actif' : 'Inactif',
    variant: status === 'active' ? 'default' : 'secondary' as const,
  };
};
