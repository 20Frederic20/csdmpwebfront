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
import { CheckCircle, Calendar, User } from 'lucide-react';
import { Appointment } from '../types/appointments.types';
import { useConfirmAppointment } from '../hooks/use-appointments';
import {
  confirmAppointmentSchema,
  ConfirmAppointmentValues,
} from '../schemas/appointment-action.schemas';

interface ConfirmAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

export function ConfirmAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: ConfirmAppointmentModalProps) {
  const { mutateAsync: confirm, isPending } = useConfirmAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfirmAppointmentValues>({
    resolver: zodResolver(confirmAppointmentSchema),
    defaultValues: { reason: '' },
  });

  useEffect(() => {
    if (!isOpen) reset({ reason: '' });
  }, [isOpen, reset]);

  const onSubmit = async (_data: ConfirmAppointmentValues) => {
    if (!appointment) return;
    await confirm(appointment.id_);
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
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Confirmer le rendez-vous
          </DialogTitle>
          <DialogDescription>
            Cette action confirmera définitivement le rendez-vous.
          </DialogDescription>
        </DialogHeader>

        {/* Résumé du rendez-vous */}
        <div className="rounded-lg border bg-green-50 p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-green-600" />
            <span className="font-medium">
              {appointment.patient_full_name || appointment.patient_id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-4 w-4 text-green-600" />
            <span>{formatDate(appointment.scheduled_at)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Remarque <span className="text-gray-400 text-xs">(optionnel)</span>
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Ajouter une remarque..."
              rows={3}
              disabled={isPending}
              className={errors.reason ? 'border-red-500' : ''}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Confirmation...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirmer
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
