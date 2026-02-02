import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { Patient } from "@/features/patients/types/patients.types";
import { PatientsService } from "@/features/patients/services/patients.service";
import { useAuthToken } from "@/hooks/use-auth-token";

interface EditPatientModalProps {
  patient: Patient;
  onPatientUpdated: () => void;
}

export function EditPatientModal({ patient, onPatientUpdated }: EditPatientModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { token } = useAuthToken();
  const [formData, setFormData] = useState({
    given_name: "",
    family_name: "",
    birth_date: "",
    gender: "",
    location: "",
    is_active: true,
  });

  // Initialiser le formulaire avec les données du patient
  useEffect(() => {
    if (patient) {
      setFormData({
        given_name: patient.given_name,
        family_name: patient.family_name,
        birth_date: patient.birth_date,
        gender: patient.gender,
        location: patient.location || "",
        is_active: patient.is_active,
      });
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await PatientsService.updatePatient(patient.id_, formData, token || undefined);
      setOpen(false);
      onPatientUpdated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la modification du patient';
      setError(errorMessage);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      setError(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Modifier le patient</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations du patient.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_given_name">Prénom</Label>
                  <Input
                    id="edit_given_name"
                    value={formData.given_name}
                    onChange={(e) => handleInputChange("given_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_family_name">Nom</Label>
                  <Input
                    id="edit_family_name"
                    value={formData.family_name}
                    onChange={(e) => handleInputChange("family_name", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_birth_date">Date de naissance</Label>
                  <Input
                    id="edit_birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange("birth_date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_gender">Genre</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                      <SelectItem value="unknown">Inconnu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_location">Localisation</Label>
                <Input
                  id="edit_location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_is_active">Statut</Label>
                <Select value={formData.is_active.toString()} onValueChange={(value) => handleInputChange("is_active", value === "true")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Actif</SelectItem>
                    <SelectItem value="false">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* AlertDialog pour les erreurs */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erreur de modification</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
