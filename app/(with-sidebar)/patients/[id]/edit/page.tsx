"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Patient, usePatient } from "@/features/patients";
import { PatientForm } from "@/features/patients/components/patient-form";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const { data: patient, isLoading: loadingPatient, error: queryError } = usePatient(patientId);

  useEffect(() => {
    if (queryError) {
      toast.error("Erreur lors du chargement du patient");
      router.push('/patients');
    }
  }, [queryError, router]);

  const handleCancel = () => {
    router.push('/patients');
  };

  const handleSuccess = () => {
    router.push('/patients');
  };

  if (loadingPatient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg animate-pulse">Chargement du patient...</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500 font-medium">Patient non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <PatientForm
      patient={patient}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
      title="Modifier le patient"
      submitButtonText="Enregistrer les modifications"
    />
  );
}

