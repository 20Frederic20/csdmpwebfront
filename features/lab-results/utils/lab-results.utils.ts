import { LabResult, TestType } from '../types/lab-results.types';

export const getTestTypeOptions = () => [
  { value: TestType.BLOOD_COUNT, label: 'Numération globulaire' },
  { value: TestType.CHEMISTRY, label: 'Chimie' },
  { value: TestType.HEMATOLOGY, label: 'Hématologie' },
  { value: TestType.MICROBIOLOGY, label: 'Microbiologie' },
  { value: TestType.PATHOLOGY, label: 'Pathologie' },
  { value: TestType.IMMUNOLOGY, label: 'Immunologie' },
  { value: TestType.GENETICS, label: 'Génétique' },
  { value: TestType.TOXICOLOGY, label: 'Toxicologie' },
  { value: TestType.ENDOCRINOLOGY, label: 'Endocrinologie' },
  { value: TestType.CARDIOLOGY, label: 'Cardiologie' },
  { value: TestType.URINALYSIS, label: 'Analyse d\'urine' },
  { value: TestType.STOOL_ANALYSIS, label: 'Analyse de selles' },
  { value: TestType.IMAGING, label: 'Imagerie' },
  { value: TestType.OTHER, label: 'Autre' }
];

export const canDeleteLabResult = (labResult: LabResult): boolean => {
  return labResult.is_active && !labResult.deleted_at;
};

export const canRestoreLabResult = (labResult: LabResult): boolean => {
  return !!labResult.deleted_at;
};

export const formatTestType = (testType: TestType): string => {
  const option = getTestTypeOptions().find(opt => opt.value === testType);
  return option?.label || testType;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};
