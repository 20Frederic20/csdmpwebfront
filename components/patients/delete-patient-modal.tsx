import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Patient } from "@/features/patients/types/patients.types";
import { PatientService } from "@/features/patients/services/patients.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface DeletePatientModalProps {
  patient: Patient;
  onPatientDeleted: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DeletePatientModal({ patient, onPatientDeleted, isOpen, onClose }: DeletePatientModalProps) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await PatientService.softDeletePatient(patient.id_, token || undefined);
      toast.success(`Patient ${patient.given_name} ${patient.family_name} supprimé avec succès`);
      onPatientDeleted();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression du patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le patient <strong>{patient.given_name} {patient.family_name}</strong> ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
