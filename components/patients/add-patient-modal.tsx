import { useState } from "react";
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
import { Plus } from "lucide-react";
import { Patient } from "@/features/patients/types/patients.types";
import { PatientsService } from "@/features/patients/services/patients.service";
import { useAuthToken } from "@/hooks/use-auth-token";

interface AddPatientModalProps {
  onPatientAdded: () => void;
}

export function AddPatientModal({ onPatientAdded }: AddPatientModalProps) {
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await PatientsService.createPatient(formData as Omit<Patient, 'id_' | 'owner_id'>, token || undefined);
      setOpen(false);
      setFormData({
        given_name: "",
        family_name: "",
        birth_date: "",
        gender: "",
        location: "",
      });
      onPatientAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la création du patient';
      setError(errorMessage);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur modifie le formulaire
    if (error) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un patient</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="given_name">Prénom</Label>
                <Input
                  id="given_name"
                  value={formData.given_name}
                  onChange={(e) => handleInputChange("given_name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family_name">Nom</Label>
                <Input
                  id="family_name"
                  value={formData.family_name}
                  onChange={(e) => handleInputChange("family_name", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">Date de naissance</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange("birth_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Genre</Label>
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
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      {/* AlertDialog pour les erreurs */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erreur de création</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
