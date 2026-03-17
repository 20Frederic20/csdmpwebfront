import { z } from 'zod';

// ─── Confirmer un rendez-vous ────────────────────────────────────────────────
export const confirmAppointmentSchema = z.object({
  reason: z.string().optional(),
});

export type ConfirmAppointmentValues = z.infer<typeof confirmAppointmentSchema>;

// ─── Annuler un rendez-vous ──────────────────────────────────────────────────
export const cancelAppointmentSchema = z.object({
  reason: z
    .string()
    .min(5, 'La raison doit comporter au moins 5 caractères')
    .max(500, 'La raison ne peut pas dépasser 500 caractères'),
});

export type CancelAppointmentValues = z.infer<typeof cancelAppointmentSchema>;

// ─── Terminer un rendez-vous ─────────────────────────────────────────────────
export const completeAppointmentSchema = z.object({
  notes: z.string().max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères').optional(),
});

export type CompleteAppointmentValues = z.infer<typeof completeAppointmentSchema>;
