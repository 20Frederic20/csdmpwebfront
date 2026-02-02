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
import { PatientsService } from "@/features/patients/services/patients.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface DeletePatientModalProps {
  patient: Patient;
  onPatientDeleted: () => void;
}

export function DeletePatientModal({ patient, onPatientDeleted }: DeletePatientModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await PatientsService.deletePatient(patient.id_, token || undefined);
      setOpen(false);
      toast.success(`Patient ${patient.given_name} ${patient.family_name} supprimé avec succès`);
      onPatientDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression du patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le patient <strong>{patient.given_name} {patient.family_name}</strong> ? 
            Cette action est irréversible et toutes les données associées seront perdues.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
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
