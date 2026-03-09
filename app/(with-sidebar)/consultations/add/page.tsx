"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCreateConsultation } from "@/features/consultations/hooks/use-consultations";
import { ConsultationForm, ConsultationFormData } from "@/features/consultations/components/consultation-form";
import { CreateConsultationRequest } from "@/features/consultations/types/consultations.types";

export default function AddConsultationPage() {
  const router = useRouter();
  const { mutateAsync: createConsultation, isPending: loading } = useCreateConsultation();

  const handleSubmit = async (data: ConsultationFormData) => {
    try {
      await createConsultation(data as CreateConsultationRequest);
      router.push('/consultations');
    } catch {
      // Handled by hook
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/consultations')}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle consultation</h1>
          <p className="text-muted-foreground">
            Créer une nouvelle consultation médicale
          </p>
        </div>
      </div>

      <ConsultationForm
        mode="add"
        onSubmit={handleSubmit}
        isSubmitting={loading}
        onCancel={() => router.push('/consultations')}
        showPrescriptions={false}
        disableConsultedBy={true}
      />
    </div>
  );
}
