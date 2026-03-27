"use client";

import { PatientForm } from "@/features/patients/components/patient-form";
import { SetPageTitle } from "@/components/page-title-provider";
import { useRouter } from "next/navigation";

export default function AddPatientPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/patients');
  };

  const handleSuccess = () => {
    router.push('/patients');
  };

  return (
    <>
      <SetPageTitle title="Ajouter un patient" />
      <PatientForm
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        title="Ajouter un patient"
        submitButtonText="Créer"
        showHeader={false}
      />
    </>
  );
}
