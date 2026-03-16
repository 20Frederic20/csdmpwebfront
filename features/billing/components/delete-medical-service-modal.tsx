"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { MedicalService } from "../types/medical-service.types";
import { useDeleteMedicalService } from "../hooks/use-medical-services";

interface DeleteMedicalServiceModalProps {
  service: MedicalService;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteMedicalServiceModal({
  service,
  isOpen,
  onClose,
}: DeleteMedicalServiceModalProps) {
  const { mutateAsync: deleteService, isPending } = useDeleteMedicalService();

  const handleDelete = async () => {
    try {
      await deleteService(service.id);
      onClose();
    } catch (error) {
      // Error is handled by the hook's toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Supprimer le service médical
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le service "<strong>{service.label}</strong>" ?
            Cette action peut être annulée en restaurant le service plus tard.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Code:</span>
              <span className="font-medium">{service.code}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Catégorie:</span>
              <span className="font-medium">{service.category}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Suppression..." : "Supprimer"}
            {!isPending && <Trash2 className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
