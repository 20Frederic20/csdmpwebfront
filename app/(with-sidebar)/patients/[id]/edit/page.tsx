"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { PatientForm } from "@/features/patients/components/patient-form";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  // Charger le patient
  useEffect(() => {
    const loadPatient = async () => {
      setLoadingPatient(true);
      try {
        const patientData = await PatientService.getPatientById(patientId);
        setPatient(patientData);
      } catch (error: any) {
        console.error('Error loading patient:', error);
        toast.error(error.message || "Erreur lors du chargement du patient");
        router.push('/patients');
      } finally {
        setLoadingPatient(false);
      }
    };

    if (patientId) {
      loadPatient();
    }
  }, [patientId, router]);

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
          <div className="text-lg">Chargement du patient...</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Patient non trouvé</div>
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
