"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { HospitalStaff, MedicalSpecialty, HospitalDepartment } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getSpecialtyOptions, 
  getDepartmentOptions 
} from "@/features/hospital-staff";

interface EditHospitalStaffModalProps {
  staff: HospitalStaff;
  isOpen: boolean;
  onClose: () => void;
  onStaffUpdated: () => void;
}

export function EditHospitalStaffModal({ staff, isOpen, onClose, onStaffUpdated }: EditHospitalStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    matricule: staff.matricule,
    year_of_exp: staff.year_of_exp,
    specialty: staff.specialty,
    department_id: staff.department_id,
  });
  const { isAuthenticated } = useAuthToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.matricule.trim()) {
      toast.error("Le matricule est requis");
      return;
    }
    if (formData.year_of_exp < 0 || formData.year_of_exp > 70) {
      toast.error("L'expérience doit être entre 0 et 70 ans");
      return;
    }

    setLoading(true);
    try {
      await HospitalStaffService.updateHospitalStaff(staff.id_, formData);
      toast.success("Informations du personnel mises à jour avec succès");
      onClose();
      onStaffUpdated();
    } catch (error: any) {
      console.error('Error updating hospital staff:', error);
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le membre du personnel</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule *</Label>
              <Input
                id="matricule"
                value={formData.matricule}
                onChange={(e) => handleInputChange('matricule', e.target.value)}
                placeholder="Entrez le matricule"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_of_exp">Années d'expérience *</Label>
              <Input
                id="year_of_exp"
                type="number"
                min="0"
                max="70"
                value={formData.year_of_exp}
                onChange={(e) => handleInputChange('year_of_exp', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Spécialité *</Label>
              <Select 
                value={formData.specialty} 
                onValueChange={(value) => handleInputChange('specialty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {getSpecialtyOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department_id">Département *</Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => handleInputChange('department_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {getDepartmentOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
