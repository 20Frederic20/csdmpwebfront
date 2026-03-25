import { z } from 'zod';
import { TestType } from '../types/lab-results.types';

export const examDefinitionSchema = z.object({
  test_type: z.nativeEnum(TestType, { message: 'Le type de test est obligatoire' }),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  parameter_codes: z
    .array(z.string().min(1, 'Le code paramètre ne peut pas être vide'))
    .min(1, 'Au moins un paramètre est requis'),
  health_facility_id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type ExamDefinitionFormValues = z.infer<typeof examDefinitionSchema>;
