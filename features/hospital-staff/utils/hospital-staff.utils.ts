import { HospitalStaffSpecialty, HospitalStaffDepartment } from '../types/hospital-staff.types';

export const specialtyLabels: Record<HospitalStaffSpecialty, string> = {
  "general_practitioner": "Médecin généraliste",
  "cardiologist": "Cardiologue",
  "pediatrician": "Pédiatre",
  "surgeon": "Chirurgien",
  "gynecologist": "Gynécologue",
  "orthopedist": "Orthopédiste",
  "radiologist": "Radiologue",
  "anesthesiologist": "Anesthésiste",
  "neurologist": "Neurologue",
  "psychiatrist": "Psychiatre",
  "ophthalmologist": "Ophtalmologue",
  "otolaryngologist": "ORL",
  "dermatologist": "Dermatologue",
  "nurse": "Infirmier",
  "midwife": "Sage-femme",
  "physiotherapist": "Kinésithérapeute",
  "laboratory_technician": "Technicien de laboratoire",
  "pharmacist": "Pharmacien",
  "administrative": "Administratif",
  "other": "Autre"
};

export const departmentLabels: Record<HospitalStaffDepartment, string> = {
  "emergency": "Urgences",
  "internal_medicine": "Médecine interne",
  "cardiology": "Cardiologie",
  "pediatrics": "Pédiatrie",
  "general_surgery": "Chirurgie générale",
  "gynecology_obstetrics": "Gynécologie-Obstétrique",
  "orthopedics": "Orthopédie",
  "radiology": "Radiologie",
  "laboratory": "Laboratoire",
  "pharmacy": "Pharmacie",
  "anesthesiology": "Anesthésiologie",
  "neurology": "Neurologie",
  "psychiatry": "Psychiatrie",
  "ophthalmology": "Ophtalmologie",
  "otolaryngology": "ORL",
  "dermatology": "Dermatologie",
  "rehabilitation": "Rééducation",
  "intensive_care": "Soins intensifs",
  "administration": "Administration",
  "other": "Autre"
};

export const getSpecialtyLabel = (specialty: HospitalStaffSpecialty): string => {
  return specialtyLabels[specialty] || specialty;
};

export const getDepartmentLabel = (department: HospitalStaffDepartment): string => {
  return departmentLabels[department] || department;
};

export const getSpecialtyOptions = () => {
  return Object.entries(specialtyLabels).map(([value, label]) => ({
    value,
    label
  }));
};

export const getDepartmentOptions = () => {
  return Object.entries(departmentLabels).map(([value, label]) => ({
    value,
    label
  }));
};

export const getExperienceLabel = (years: number): string => {
  if (years === 0) return "Débutant";
  if (years === 1) return "1 an d'expérience";
  return `${years} ans d'expérience`;
};

export const formatStaffInfo = (staff: {
  matricule: string;
  specialty: HospitalStaffSpecialty;
  department: HospitalStaffDepartment;
  year_of_exp: number;
}) => {
  return {
    matricule: staff.matricule,
    specialty: getSpecialtyLabel(staff.specialty),
    department: getDepartmentLabel(staff.department),
    experience: getExperienceLabel(staff.year_of_exp)
  };
};
