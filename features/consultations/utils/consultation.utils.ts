import { ConsultationStatus } from '../types/consultation.types';

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

export const formatVitalSigns = (vitalSigns: any) => {
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
