"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreatePrescriptionRequest, 
  CreatePrescriptionResponse 
} from "@/features/prescriptions/types/prescriptions.types";
import { PrescriptionService } from "@/features/prescriptions/services/prescriptions.service";
import { toast } from "sonner";
import { useAuthToken } from "@/hooks/use-auth-token";
import { PrescriptionForm } from "@/features/prescriptions/components/prescription-form";
import { usePermissions } from "@/hooks/use-permissions";

export default function AddPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePrescriptionRequest>({
    consultation_id: "",
    medication_name: "",
    dosage_instructions: "",
    form: [],
    strength: "",
    duration_days: 0,
    special_instructions: "",
    is_confidential: false,
    is_active: true,
  });

  const { token } = useAuthToken();
  const { canAccess } = usePermissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await PrescriptionService.createPrescription(formData, token || undefined);
      toast.success('Prescription créée avec succès');
      router.push('/prescriptions');
    } catch (error: any) {
      console.error('Error creating prescription:', error);
      toast.error(error.message || "Erreur lors de la création de la prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof CreatePrescriptionRequest, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter une Prescription</h1>
          <p className="text-muted-foreground">
            Créer une nouvelle prescription médicale.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/prescriptions')}>
          Retour à la liste
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PrescriptionForm
              consultationId={formData.consultation_id}
              medicationName={formData.medication_name}
              dosageInstructions={formData.dosage_instructions}
              form={formData.form}
              strength={formData.strength}
              durationDays={formData.duration_days}
              specialInstructions={formData.special_instructions}
              isConfidential={formData.is_confidential}
              isActive={formData.is_active}
              onFieldChange={handleFieldChange}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer la prescription'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
