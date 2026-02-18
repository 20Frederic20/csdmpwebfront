import { Consultation, ConsultationStatus, VitalSigns } from '../types/consultation.types';

export const getConsultationStatusLabel = (status: ConsultationStatus): string => {
  switch (status) {
    case 'scheduled':
      return 'Planifiée';
    case 'completed':
      return 'Terminée';
    case 'pending':
      return 'En attente';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};

export const getConsultationStatusOptions = () => [
  { value: 'scheduled', label: 'Planifiée' },
  { value: 'completed', label: 'Terminée' },
  { value: 'pending', label: 'En attente' },
  { value: 'cancelled', label: 'Annulée' },
];

export const getConsultationStatusBadge = (status: ConsultationStatus) => {
  switch (status) {
    case 'scheduled':
      return { variant: 'default', className: 'bg-blue-100 text-blue-800' };
    case 'completed':
      return { variant: 'default', className: 'bg-green-100 text-green-800' };
    case 'pending':
      return { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' };
    case 'cancelled':
      return { variant: 'destructive', className: 'bg-red-100 text-red-800' };
    default:
      return { variant: 'outline', className: '' };
  }
};

export const formatVitalSigns = (vitalSigns: VitalSigns | null | undefined): string => {
  if (!vitalSigns) return 'Non renseignés';
  
  const signs = [];
  if (vitalSigns.temperature) signs.push(`${vitalSigns.temperature}°C`);
  if (vitalSigns.pulse) signs.push(`${vitalSigns.pulse} bpm`);
  if (vitalSigns.systolic_bp && vitalSigns.diastolic_bp) {
    signs.push(`${vitalSigns.systolic_bp}/${vitalSigns.diastolic_bp} mmHg`);
  }
  if (vitalSigns.weight) signs.push(`${vitalSigns.weight} kg`);
  if (vitalSigns.height) signs.push(`${vitalSigns.height} cm`);
  
  return signs.length > 0 ? signs.join(' | ') : 'Non renseignés';
};

export const formatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'Non défini';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Non définie';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Non définie';
  return new Date(dateString).toLocaleString('fr-FR');
};

export const getConsultationDisplayName = (consultation: Consultation): string => {
  return consultation.chief_complaint || `Consultation du ${formatDate(consultation.follow_up_date)}`;
};

export const isConsultationActive = (consultation: Consultation): boolean => {
  return consultation.is_active && !consultation.deleted_at;
};

export const canDeleteConsultation = (consultation: Consultation): boolean => {
  return consultation.is_active && !consultation.deleted_at;
};

export const canRestoreConsultation = (consultation: Consultation): boolean => {
  return !consultation.is_active && !!consultation.deleted_at;
};

export const getConsultationFilters = () => [
  { value: 'chief_complaint', label: 'Motif principal' },
  { value: 'status', label: 'Statut' },
  { value: 'consulted_by_id', label: 'Consultant' },
  { value: 'follow_up_date', label: 'Date de suivi' },
  { value: 'created_at', label: 'Date de création' },
];

export const validateConsultationData = (data: Partial<Consultation>): string[] => {
  const errors: string[] = [];
  
  if (!data.patient_id) {
    errors.push('Le patient est requis');
  }
  
  if (!data.chief_complaint || data.chief_complaint.trim().length === 0) {
    errors.push('Le motif principal est requis');
  }
  
  if (data.chief_complaint && data.chief_complaint.length > 500) {
    errors.push('Le motif principal ne peut pas dépasser 500 caractères');
  }
  
  if (data.diagnosis && data.diagnosis.length > 2000) {
    errors.push('Le diagnostic ne peut pas dépasser 2000 caractères');
  }
  
  if (data.treatment_plan && data.treatment_plan.length > 2000) {
    errors.push('Le plan de traitement ne peut pas dépasser 2000 caractères');
  }
  
  return errors;
};
