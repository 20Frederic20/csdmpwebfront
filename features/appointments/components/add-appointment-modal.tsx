"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { Save } from "lucide-react";
import { AppointmentType, AppointmentStatus } from "@/features/appointments/types/appointments.types";
import { AppointmentService } from "@/features/appointments/services/appointment.service";
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { HospitalStaffSelect } from "@/features/hospital-staff/components/hospital-staff-select";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { toast } from "sonner";

// ─── Schéma Zod ──────────────────────────────────────────────────────────────

const addAppointmentSchema = z.object({
  patient_id: z.string().min(1, "Veuillez sélectionner un patient"),
  health_facility_id: z.string().min(1, "Veuillez sélectionner un établissement"),
  department_id: z.string().min(1, "Veuillez sélectionner un département"),
  doctor_id: z.string().nullable().optional(),
  appointment_type: z.nativeEnum(AppointmentType),
  scheduled_at: z.string().min(1, "La date et l'heure sont requises"),
  estimated_duration: z.number().min(5).max(480).nullable().optional(),
  reason: z.string().nullable().optional(),
});

type AddAppointmentFormValues = z.infer<typeof addAppointmentSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated?: (appointment: any) => void;
  defaultPatientId?: string;
}

// ─── Options ──────────────────────────────────────────────────────────────────

const typeOptions = [
  { value: AppointmentType.ROUTINE_CONSULTATION, label: "Consultation de routine" },
  { value: AppointmentType.EMERGENCY_CONSULTATION, label: "Consultation d'urgence" },
  { value: AppointmentType.FOLLOW_UP, label: "Suivi" },
  { value: AppointmentType.SPECIALIST_CONSULTATION, label: "Consultation spécialisée" },
  { value: AppointmentType.SURGERY, label: "Chirurgie" },
  { value: AppointmentType.IMAGING, label: "Imagerie" },
  { value: AppointmentType.LABORATORY, label: "Laboratoire" },
  { value: AppointmentType.VACCINATION, label: "Vaccination" },
  { value: AppointmentType.PREVENTIVE_CARE, label: "Soins préventifs" },
];


// ─── Composant ────────────────────────────────────────────────────────────────

export function AddAppointmentModal({
  isOpen,
  onClose,
  onAppointmentCreated,
  defaultPatientId = "",
}: AddAppointmentModalProps) {
  const defaultValues: AddAppointmentFormValues = {
    patient_id: defaultPatientId,
    health_facility_id: "",
    department_id: "",
    doctor_id: null,
    appointment_type: AppointmentType.ROUTINE_CONSULTATION,
    scheduled_at: "",
    estimated_duration: 30,
    reason: "",
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddAppointmentFormValues>({
    resolver: zodResolver(addAppointmentSchema),
    defaultValues,
  });

  // Reset à la fermeture
  useEffect(() => {
    if (!isOpen) {
      reset({ ...defaultValues, patient_id: defaultPatientId });
    }
  }, [isOpen, defaultPatientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const healthFacilityId = watch("health_facility_id");

  const onSubmit = async (data: AddAppointmentFormValues) => {
    try {
      // Convertir datetime-local en ISO 8601 avec timezone
      const scheduledAtIso = new Date(data.scheduled_at).toISOString();

      const payload = {
        ...data,
        scheduled_at: scheduledAtIso,
        doctor_id: data.doctor_id || null,
        reason: data.reason || null,
        status: AppointmentStatus.SCHEDULED,
        is_confirmed_by_patient: false,
        is_active: true,
      };

      const newAppointment = await AppointmentService.createAppointment(payload);
      toast.success("Rendez-vous créé avec succès");
      onAppointmentCreated?.(newAppointment);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du rendez-vous");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un rendez-vous</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Patient */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="patient_id"
                render={({ field }) => (
                  <PatientSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value || "")}
                    placeholder="Sélectionner un patient"
                    disabled={isSubmitting}
                    required={true}
                  />
                )}
              />
              {errors.patient_id && (
                <p className="text-sm text-red-500">{errors.patient_id.message}</p>
              )}
            </div>

            {/* Établissement */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="health_facility_id"
                render={({ field }) => (
                  <HealthFacilitySelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Sélectionner un établissement"
                    required={true}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.health_facility_id && (
                <p className="text-sm text-red-500">{errors.health_facility_id.message}</p>
              )}
            </div>

            {/* Département */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="department_id"
                render={({ field }) => (
                  <DepartmentSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value || "")}
                    placeholder="Sélectionner un département"
                    healthFacilityId={healthFacilityId}
                    disabled={isSubmitting}
                    required={true}
                  />
                )}
              />
              {errors.department_id && (
                <p className="text-sm text-red-500">{errors.department_id.message}</p>
              )}
            </div>

            {/* Docteur */}
            <div className="space-y-2">
              <Label>Docteur</Label>
              <Controller
                control={control}
                name="doctor_id"
                render={({ field }) => (
                  <HospitalStaffSelect
                    value={field.value ?? undefined}
                    onChange={(value) => field.onChange(value || null)}
                    placeholder="Sélectionner un docteur"
                    healthFacilityId={healthFacilityId}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* Type de rendez-vous */}
            <div className="space-y-2">
              <Label>Type de rendez-vous</Label>
              <Controller
                control={control}
                name="appointment_type"
                render={({ field }) => (
                  <CustomSelect
                    options={typeOptions}
                    value={field.value}
                    onChange={(v) => field.onChange(v as AppointmentType)}
                    placeholder="Sélectionner le type"
                    height="h-10"
                    isDisabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* Date et heure */}
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">
                Date et heure <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                {...register("scheduled_at")}
                disabled={isSubmitting}
                className={errors.scheduled_at ? "border-red-500" : ""}
              />
              {errors.scheduled_at && (
                <p className="text-sm text-red-500">{errors.scheduled_at.message}</p>
              )}
            </div>

            {/* Durée estimée */}
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Durée estimée (minutes)</Label>
              <Input
                id="estimated_duration"
                type="number"
                min="5"
                max="480"
                {...register("estimated_duration", { valueAsNumber: true })}
                placeholder="30"
                disabled={isSubmitting}
              />
              {errors.estimated_duration && (
                <p className="text-sm text-red-500">{errors.estimated_duration.message}</p>
              )}
            </div>


            {/* Raison */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Raison du rendez-vous</Label>
              <Input
                id="reason"
                {...register("reason")}
                placeholder="Raison ou motif du rendez-vous"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Création...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Créer le rendez-vous
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
