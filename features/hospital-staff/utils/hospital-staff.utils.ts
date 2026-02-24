import { HospitalStaff, EmploymentStatus, MedicalSpecialty, HospitalDepartment } from '../types/hospital-staff.types';

export function formatEmploymentStatus(status: EmploymentStatus): string {
  switch (status) {
    case EmploymentStatus.STATE_PERMANENT:
      return 'Permanent';
    case EmploymentStatus.STATE_CONTRACTUAL:
      return 'Contractuel';
    case EmploymentStatus.HOSPITAL_CONTRACTUAL:
      return 'Contractuel hospitalier';
    case EmploymentStatus.INTERN:
      return 'Interne';
    case EmploymentStatus.VACUM_GUEST:
      return 'Invité vacataire';
    default:
      return status;
  }
}

export function getEmploymentStatusOptions(): { value: EmploymentStatus; label: string }[] {
  return [
    { value: EmploymentStatus.STATE_PERMANENT, label: "Permanent" },
    { value: EmploymentStatus.STATE_CONTRACTUAL, label: "Contractuel" },
    { value: EmploymentStatus.HOSPITAL_CONTRACTUAL, label: "Contractuel hospitalier" },
    { value: EmploymentStatus.INTERN, label: "Interne" },
    { value: EmploymentStatus.VACUM_GUEST, label: "Invité vacataire" },
  ];
}

export function formatSpecialty(specialty: MedicalSpecialty): string {
  switch (specialty) {
    case MedicalSpecialty.GENERAL_PRACTITIONER:
      return 'Médecin généraliste';
    case MedicalSpecialty.CARDIOLOGIST:
      return 'Cardiologue';
    case MedicalSpecialty.PEDIATRICIAN:
      return 'Pédiatre';
    case MedicalSpecialty.SURGEON:
      return 'Chirurgien';
    case MedicalSpecialty.GYNECOLOGIST:
      return 'Gynécologue';
    case MedicalSpecialty.ORTHOPEDIST:
      return 'Orthopédiste';
    case MedicalSpecialty.RADIOLOGIST:
      return 'Radiologue';
    case MedicalSpecialty.ANESTHESIOLOGIST:
      return 'Anesthésiste';
    case MedicalSpecialty.NEUROLOGIST:
      return 'Neurologue';
    case MedicalSpecialty.PSYCHIATRIST:
      return 'Psychiatre';
    case MedicalSpecialty.OPHTHALMOLOGIST:
      return 'Ophtalmologue';
    case MedicalSpecialty.OTOLARYNGOLOGIST:
      return 'ORL';
    case MedicalSpecialty.DERMATOLOGIST:
      return 'Dermatologue';
    case MedicalSpecialty.NURSE:
      return 'Infirmier';
    case MedicalSpecialty.MIDWIFE:
      return 'Sage-femme';
    case MedicalSpecialty.PHYSIOTHERAPIST:
      return 'Kinésithérapeute';
    case MedicalSpecialty.LABORATORY_TECHNICIAN:
      return 'Technicien de labo';
    case MedicalSpecialty.PHARMACIST:
      return 'Pharmacien';
    case MedicalSpecialty.ADMINISTRATIVE:
      return 'Administratif';
    case MedicalSpecialty.OTHER:
      return 'Autre';
    default:
      return specialty;
  }
}

export function getSpecialtyOptions(): { value: MedicalSpecialty; label: string }[] {
  return [
    { value: MedicalSpecialty.GENERAL_PRACTITIONER, label: "Médecin généraliste" },
    { value: MedicalSpecialty.CARDIOLOGIST, label: "Cardiologue" },
    { value: MedicalSpecialty.PEDIATRICIAN, label: "Pédiatre" },
    { value: MedicalSpecialty.SURGEON, label: "Chirurgien" },
    { value: MedicalSpecialty.GYNECOLOGIST, label: "Gynécologue" },
    { value: MedicalSpecialty.ORTHOPEDIST, label: "Orthopédiste" },
    { value: MedicalSpecialty.RADIOLOGIST, label: "Radiologue" },
    { value: MedicalSpecialty.ANESTHESIOLOGIST, label: "Anesthésiste" },
    { value: MedicalSpecialty.NEUROLOGIST, label: "Neurologue" },
    { value: MedicalSpecialty.PSYCHIATRIST, label: "Psychiatre" },
    { value: MedicalSpecialty.OPHTHALMOLOGIST, label: "Ophtalmologue" },
    { value: MedicalSpecialty.OTOLARYNGOLOGIST, label: "ORL" },
    { value: MedicalSpecialty.DERMATOLOGIST, label: "Dermatologue" },
    { value: MedicalSpecialty.NURSE, label: "Infirmier" },
    { value: MedicalSpecialty.MIDWIFE, label: "Sage-femme" },
    { value: MedicalSpecialty.PHYSIOTHERAPIST, label: "Kinésithérapeute" },
    { value: MedicalSpecialty.LABORATORY_TECHNICIAN, label: "Technicien de labo" },
    { value: MedicalSpecialty.PHARMACIST, label: "Pharmacien" },
    { value: MedicalSpecialty.ADMINISTRATIVE, label: "Administratif" },
    { value: MedicalSpecialty.OTHER, label: "Autre" },
  ];
}

export function formatDepartment(department: HospitalDepartment): string {
  switch (department) {
    case HospitalDepartment.EMERGENCY:
      return 'Urgences';
    case HospitalDepartment.INTERNAL_MEDICINE:
      return 'Médecine interne';
    case HospitalDepartment.CARDIOLOGY:
      return 'Cardiologie';
    case HospitalDepartment.PEDIATRICS:
      return 'Pédiatrie';
    case HospitalDepartment.GENERAL_SURGERY:
      return 'Chirurgie générale';
    case HospitalDepartment.GYNECOLOGY_OBSTETRICS:
      return 'Gynécologie-obstétrique';
    case HospitalDepartment.ORTHOPEDICS:
      return 'Orthopédie';
    case HospitalDepartment.RADIOLOGY:
      return 'Radiologie';
    case HospitalDepartment.LABORATORY:
      return 'Laboratoire';
    case HospitalDepartment.PHARMACY:
      return 'Pharmacie';
    case HospitalDepartment.ANESTHESIOLOGY:
      return 'Anesthésiologie';
    case HospitalDepartment.NEUROLOGY:
      return 'Neurologie';
    case HospitalDepartment.PSYCHIATRY:
      return 'Psychiatrie';
    case HospitalDepartment.OPHTHALMOLOGY:
      return 'Ophtalmologie';
    case HospitalDepartment.OTOLARYNGOLOGY:
      return 'ORL';
    case HospitalDepartment.DERMATOLOGY:
      return 'Dermatologie';
    case HospitalDepartment.REHABILITATION:
      return 'Rééducation';
    case HospitalDepartment.INTENSIVE_CARE:
      return 'Soins intensifs';
    case HospitalDepartment.ADMINISTRATION:
      return 'Administration';
    case HospitalDepartment.OTHER:
      return 'Autre';
    default:
      return department;
  }
}

export function getDepartmentOptions(): { value: HospitalDepartment; label: string }[] {
  return [
    { value: HospitalDepartment.EMERGENCY, label: "Urgences" },
    { value: HospitalDepartment.INTERNAL_MEDICINE, label: "Médecine interne" },
    { value: HospitalDepartment.CARDIOLOGY, label: "Cardiologie" },
    { value: HospitalDepartment.PEDIATRICS, label: "Pédiatrie" },
    { value: HospitalDepartment.GENERAL_SURGERY, label: "Chirurgie générale" },
    { value: HospitalDepartment.GYNECOLOGY_OBSTETRICS, label: "Gynécologie-obstétrique" },
    { value: HospitalDepartment.ORTHOPEDICS, label: "Orthopédie" },
    { value: HospitalDepartment.RADIOLOGY, label: "Radiologie" },
    { value: HospitalDepartment.LABORATORY, label: "Laboratoire" },
    { value: HospitalDepartment.PHARMACY, label: "Pharmacie" },
    { value: HospitalDepartment.ANESTHESIOLOGY, label: "Anesthésiologie" },
    { value: HospitalDepartment.NEUROLOGY, label: "Neurologie" },
    { value: HospitalDepartment.PSYCHIATRY, label: "Psychiatrie" },
    { value: HospitalDepartment.OPHTHALMOLOGY, label: "Ophtalmologie" },
    { value: HospitalDepartment.OTOLARYNGOLOGY, label: "ORL" },
    { value: HospitalDepartment.DERMATOLOGY, label: "Dermatologie" },
    { value: HospitalDepartment.REHABILITATION, label: "Rééducation" },
    { value: HospitalDepartment.INTENSIVE_CARE, label: "Soins intensifs" },
    { value: HospitalDepartment.ADMINISTRATION, label: "Administration" },
    { value: HospitalDepartment.OTHER, label: "Autre" },
  ];
}

export function getEmploymentStatusBadge(status: EmploymentStatus): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  switch (status) {
    case EmploymentStatus.STATE_PERMANENT:
      return { label: 'Permanent', variant: 'default' };
    case EmploymentStatus.STATE_CONTRACTUAL:
      return { label: 'Contractuel', variant: 'secondary' };
    case EmploymentStatus.HOSPITAL_CONTRACTUAL:
      return { label: 'Contractuel hospitalier', variant: 'secondary' };
    case EmploymentStatus.INTERN:
      return { label: 'Interne', variant: 'outline' };
    case EmploymentStatus.VACUM_GUEST:
      return { label: 'Invité vacataire', variant: 'outline' };
    default:
      return { label: status, variant: 'outline' };
  }
}

export function canDeleteHospitalStaff(staff: HospitalStaff): boolean {
  return staff.deleted_at === null;
}

export function canRestoreHospitalStaff(staff: HospitalStaff): boolean {
  return staff.deleted_at !== null;
}
