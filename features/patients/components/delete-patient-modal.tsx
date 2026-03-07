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
import { Patient, useDeletePatient } from "@/features/patients";
import { toast } from "sonner";

interface DeletePatientModalProps {
  patient: Patient;
  onPatientDeleted: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DeletePatientModal({ patient, onPatientDeleted, isOpen, onClose }: DeletePatientModalProps) {
  const { mutateAsync: deletePatient, isPending: loading } = useDeletePatient();

  const handleDelete = async () => {
    try {
      await deletePatient(patient.id_);
      onPatientDeleted();
      onClose();
    } catch (err) {
      // Erreur déjà gérée par le hook
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
