"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { HospitalStaff } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";

interface DeleteHospitalStaffModalProps {
  staff: HospitalStaff;
  onStaffDeleted: () => void;
}

export function DeleteHospitalStaffModal({ staff, onStaffDeleted }: DeleteHospitalStaffModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await HospitalStaffService.deleteHospitalStaff(staff.id_, token || undefined);
      toast.success("Membre du personnel supprimé avec succès");
      setOpen(false);
      onStaffDeleted();
    } catch (error: any) {
      console.error('Error deleting hospital staff:', error);
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start cursor-pointer text-red-600 hover:text-red-700"
          data-hospital-staff-delete={staff.id_}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Supprimer le membre du personnel
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Veuillez confirmer que vous voulez supprimer ce membre du personnel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-red-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-md font-medium">ID Personnel:</span>
                <span className="font-mono text-md">{staff.id_}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Matricule:</span>
                <span className="font-mono text-md">{staff.matricule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Statut:</span>
                <Badge 
                  variant={staff.is_active ? "default" : "secondary"}
                  className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {staff.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
