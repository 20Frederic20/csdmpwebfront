'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XCircle, Calendar, User, AlertTriangle } from 'lucide-react';
import { Appointment } from '../types/appointments.types';
import { useCancelAppointment } from '../hooks/use-appointments';
import {
  cancelAppointmentSchema,
  CancelAppointmentValues,
} from '../schemas/appointment-action.schemas';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: CancelAppointmentModalProps) {
  const { mutateAsync: cancel, isPending } = useCancelAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelAppointmentValues>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: { reason: '' },
  });

  useEffect(() => {
    if (!isOpen) reset({ reason: '' });
  }, [isOpen, reset]);

  const onSubmit = async (_data: CancelAppointmentValues) => {
    if (!appointment) return;
    await cancel(appointment.id_);
    onSuccess?.();
    onClose();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="h-5 w-5" />
            Annuler le rendez-vous
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Le rendez-vous sera marqué comme annulé.
          </DialogDescription>
        </DialogHeader>

        {/* Avertissement */}
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Vous êtes sur le point d&apos;annuler le rendez-vous de{' '}
            <strong>{appointment.patient_full_name || appointment.patient_id}</strong>.
          </span>
        </div>

        {/* Résumé du rendez-vous */}
        <div className="rounded-lg border bg-gray-50 p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {appointment.patient_full_name || appointment.patient_id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{formatDate(appointment.scheduled_at)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Raison de l&apos;annulation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Expliquez la raison de l'annulation (min. 5 caractères)..."
              rows={4}
              disabled={isPending}
              className={errors.reason ? 'border-red-500' : ''}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Retour
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Annulation...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Confirmer l&apos;annulation
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
