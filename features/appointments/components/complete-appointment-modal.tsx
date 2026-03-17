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
import { CheckCheck, Calendar, User } from 'lucide-react';
import { Appointment } from '../types/appointments.types';
import { useCompleteAppointment } from '../hooks/use-appointments';
import {
  completeAppointmentSchema,
  CompleteAppointmentValues,
} from '../schemas/appointment-action.schemas';

interface CompleteAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

export function CompleteAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: CompleteAppointmentModalProps) {
  const { mutateAsync: complete, isPending } = useCompleteAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompleteAppointmentValues>({
    resolver: zodResolver(completeAppointmentSchema),
    defaultValues: { notes: '' },
  });

  useEffect(() => {
    if (!isOpen) reset({ notes: '' });
  }, [isOpen, reset]);

  const onSubmit = async (_data: CompleteAppointmentValues) => {
    if (!appointment) return;
    await complete(appointment.id_);
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
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <CheckCheck className="h-5 w-5" />
            Terminer le rendez-vous
          </DialogTitle>
          <DialogDescription>
            Marquer ce rendez-vous comme terminé. Le statut passera à &quot;Terminé&quot;.
          </DialogDescription>
        </DialogHeader>

        {/* Résumé du rendez-vous */}
        <div className="rounded-lg border bg-blue-50 p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-blue-600" />
            <span className="font-medium">
              {appointment.patient_full_name || appointment.patient_id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>{formatDate(appointment.scheduled_at)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes de clôture <span className="text-gray-400 text-xs">(optionnel)</span>
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Ajouter des notes sur ce rendez-vous..."
              rows={4}
              disabled={isPending}
              className={errors.notes ? 'border-red-500' : ''}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Clôture...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCheck className="h-4 w-4" />
                  Terminer le rendez-vous
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
