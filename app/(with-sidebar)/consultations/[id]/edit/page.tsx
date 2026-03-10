"use client";

import { useParams, useRouter } from "next/navigation";
import { ConsultationForm } from "@/features/consultations/components/consultation-form";
import { useConsultation, useUpdateConsultation } from "@/features/consultations/hooks/use-consultations";
import { UpdateConsultationRequest } from "@/features/consultations/types/consultations.types";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;

  const { data: consultation, isLoading: loading } = useConsultation(consultationId);
  const { mutateAsync: updateConsultation, isPending: saving } = useUpdateConsultation();

  const handleSubmit = async (formData: UpdateConsultationRequest) => {
    try {
      await updateConsultation({ id: consultationId, data: formData });
      toast.success("Consultation modifiée avec succès");
      router.push('/consultations');
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification de la consultation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement de la consultation...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Consultation non trouvée</h3>
          <Link href="/consultations">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Adapter les données de la consultation au format attendu par le formulaire
  const initialData = {
    ...consultation,
    follow_up_date: consultation.follow_up_date ? consultation.follow_up_date.split('T')[0] : "",
    prescriptions: consultation.prescription?.items || [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier la consultation</h1>
        <p className="text-muted-foreground">
          Patient: {consultation.patient_id} | ID: {consultation.id_}
        </p>
      </div>

      <ConsultationForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={saving}
        onCancel={() => router.push('/consultations')}
      />
    </div>
  );
}
