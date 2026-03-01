import { Appointment, AppointmentStatus, AppointmentType, PaymentMethod } from '../types/appointments.types';

export function formatAppointmentStatus(status: AppointmentStatus): string {
  const statusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'Programmé',
    [AppointmentStatus.CONFIRMED]: 'Confirmé',
    [AppointmentStatus.IN_PROGRESS]: 'En cours',
    [AppointmentStatus.COMPLETED]: 'Terminé',
    [AppointmentStatus.CANCELLED]: 'Annulé',
    [AppointmentStatus.NO_SHOW]: 'Non présenté',
    [AppointmentStatus.RESCHEDULED]: 'Reprogrammé',
  };

  return statusLabels[status] || status;
}

export function formatAppointmentType(type: AppointmentType): string {
  const typeLabels: Record<AppointmentType, string> = {
    [AppointmentType.ROUTINE_CONSULTATION]: 'Consultation de routine',
    [AppointmentType.EMERGENCY_CONSULTATION]: 'Consultation d\'urgence',
    [AppointmentType.FOLLOW_UP]: 'Suivi',
    [AppointmentType.SPECIALIST_CONSULTATION]: 'Consultation spécialisée',
    [AppointmentType.SURGERY]: 'Chirurgie',
    [AppointmentType.IMAGING]: 'Imagerie',
    [AppointmentType.LABORATORY]: 'Laboratoire',
    [AppointmentType.VACCINATION]: 'Vaccination',
    [AppointmentType.PREVENTIVE_CARE]: 'Soins préventifs',
  };

  return typeLabels[type] || type;
}

export function formatPaymentMethod(method: PaymentMethod): string {
  const methodLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.FREE_OF_CHARGE]: 'Gratuit',
    [PaymentMethod.INSURANCE]: 'Assurance',
    [PaymentMethod.CASH]: 'Espèces',
    [PaymentMethod.CREDIT_CARD]: 'Carte de crédit',
    [PaymentMethod.MOBILE_MONEY]: 'Mobile money',
    [PaymentMethod.BANK_TRANSFER]: 'Virement bancaire',
  };

  return methodLabels[method] || method;
}

export function getAppointmentStatusBadge(status: AppointmentStatus) {
  const statusConfig = {
    [AppointmentStatus.SCHEDULED]: { label: 'Programmé', variant: 'default' as const },
    [AppointmentStatus.CONFIRMED]: { label: 'Confirmé', variant: 'default' as const },
    [AppointmentStatus.IN_PROGRESS]: { label: 'En cours', variant: 'default' as const },
    [AppointmentStatus.COMPLETED]: { label: 'Terminé', variant: 'default' as const },
    [AppointmentStatus.CANCELLED]: { label: 'Annulé', variant: 'destructive' as const },
    [AppointmentStatus.NO_SHOW]: { label: 'Non présenté', variant: 'destructive' as const },
    [AppointmentStatus.RESCHEDULED]: { label: 'Reprogrammé', variant: 'secondary' as const },
  };

  return statusConfig[status] || { label: status, variant: 'default' as const };
}

export function getAppointmentDetailUrl(appointment: Appointment): string {
  return `/appointments/${appointment.id_}`;
}

export function formatAppointmentDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAppointmentDate(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatAppointmentTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAppointmentDuration(duration: number | null): string {
  if (!duration) return 'Non spécifiée';
  
  if (duration < 60) {
    return `${duration} min`;
  }
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h${minutes}min`;
}

export function isAppointmentUpcoming(dateTime: string): boolean {
  return new Date(dateTime) > new Date();
}

export function isAppointmentPast(dateTime: string): boolean {
  return new Date(dateTime) < new Date();
}

export function isAppointmentToday(dateTime: string): boolean {
  const today = new Date();
  const appointmentDate = new Date(dateTime);
  
  return today.toDateString() === appointmentDate.toDateString();
}
