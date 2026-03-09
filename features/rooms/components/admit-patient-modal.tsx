"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdmitPatient } from "../hooks/use-rooms";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { RoomSelect } from "./room-select";

interface AdmitPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultRoomId?: string;
}

export function AdmitPatientModal({
    isOpen,
    onClose,
    defaultRoomId,
}: AdmitPatientModalProps) {
    const { mutateAsync: admitPatient, isPending } = useAdmitPatient();
    const [formData, setFormData] = useState({
        patient_id: "",
        room_id: defaultRoomId || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patient_id || !formData.room_id) return;

        try {
            await admitPatient(formData);
            onClose();
            setFormData({ patient_id: "", room_id: defaultRoomId || "" });
        } catch (error) {
            console.error("Error admitting patient:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Admettre un patient</DialogTitle>
                    <DialogDescription>
                        Sélectionnez un patient et une chambre pour l&apos;hospitalisation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <PatientSelect
                            value={formData.patient_id}
                            onChange={(val) => setFormData((prev) => ({ ...prev, patient_id: val || "" }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <RoomSelect
                            value={formData.room_id}
                            onChange={(val) => setFormData((prev) => ({ ...prev, room_id: val || "" }))}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending || !formData.patient_id || !formData.room_id}>
                            {isPending && <span className="animate-spin mr-2">⏳</span>}
                            Admettre
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
