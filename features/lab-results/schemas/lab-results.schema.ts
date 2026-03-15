import { z } from "zod";
import { TestType } from "../types/lab-results.types";

export const labResultSchema = z.object({
  patient_id: z.string().min(1, "Le patient est obligatoire"),
  performer_id: z.string().min(1, "Le personnel est obligatoire"),
  test_type: z.nativeEnum(TestType),
  date_performed: z.string().min(1, "La date du test est obligatoire"),
  date_reported: z.string().min(1, "La date du rapport est obligatoire"),
  issuing_facility: z.string().nullable().optional(),
  document_id: z.string().nullable().optional(),
  extracted_values: z.any().nullable().optional().refine((val) => {
    if (!val) return true;
    if (typeof val === 'string') {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }
    return typeof val === 'object';
  }, "Format JSON invalide"),
  is_active: z.boolean(),
});

export type LabResultFormValues = z.infer<typeof labResultSchema>;
