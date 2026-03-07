"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Department } from "@/features/departments/types/departments.types";
import { useDepartmentMutations } from "@/features/departments/hooks/use-department-mutations";

interface DeleteDepartmentModalProps {
  department: Department;
  isOpen: boolean;
  onClose: () => void;
  onDepartmentDeleted: () => void;
}

export function DeleteDepartmentModal({
  department,
  isOpen,
  onClose,
  onDepartmentDeleted,
}: DeleteDepartmentModalProps) {
  const { deleteDepartment, isDeleting } = useDepartmentMutations();

  const handleDelete = async () => {
    try {
      await deleteDepartment(department.id_);
      onDepartmentDeleted();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le département{" "}
            <span className="font-semibold">{department.name}</span> ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
