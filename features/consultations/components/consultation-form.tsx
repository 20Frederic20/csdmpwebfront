"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Activity, Heart, Thermometer, Weight, Ruler } from "lucide-react";
import {
    ConsultationStatus,
    VitalSigns,
    CreateConsultationRequest,
    UpdateConsultationRequest,
} from "../types/consultations.types";
import CustomSelect from '@/components/ui/custom-select';
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { HospitalStaffSelect } from "@/features/hospital-staff/components/hospital-staff-select";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { PrescriptionsTable } from "./prescriptions-table";
import { usePermissionsContext } from "@/contexts/permissions-context";

export type ConsultationFormData = CreateConsultationRequest | UpdateConsultationRequest;

interface ConsultationFormProps {
    initialData?: ConsultationFormData;
    onSubmit: (data: ConsultationFormData) => Promise<void>;
    isSubmitting: boolean;
    mode: 'add' | 'edit';
    onCancel: () => void;
    showPrescriptions?: boolean;
    disableConsultedBy?: boolean;
}

export function ConsultationForm({
    initialData,
    onSubmit,
    isSubmitting,
    mode,
    onCancel,
    showPrescriptions = true,
    disableConsultedBy = false
}: ConsultationFormProps) {
    const { user } = usePermissionsContext();
    const [formData, setFormData] = useState<ConsultationFormData>(initialData || {
        patient_id: "",
        chief_complaint: "",
        health_facility_id: "",
        department_id: "",
        physical_examination: "",
        triage_by_id: undefined,
        consulted_by_id: undefined,
        parent_consultation_id: undefined,
        other_symptoms: "",
        vital_signs: {
            temperature: undefined,
            pulse: undefined,
            systolic_bp: undefined,
            diastolic_bp: undefined,
            weight: undefined,
            height: undefined,
        },
        diagnosis: "",
        treatment_plan: "",
        follow_up_notes: "",
        follow_up_date: undefined,
        status: ConsultationStatus.SCHEDULED,
        is_confidential: false,
        prescriptions: [],
    });

    const [errors, setErrors] = useState<Record<string, string | undefined>>({});

    // Sync initialData if provided (useful for edit mode when data is fetched)
    useEffect(() => {
        if (initialData) {
            // eslint-disable-next-line
            setFormData(initialData);
        }
    }, [initialData]);

    // Auto-inject health facility and medical staff for new consultations
    useEffect(() => {
        if (mode === 'add' && user && !formData.health_facility_id) {
            // eslint-disable-next-line
            setFormData((prev) => ({
                ...prev,
                health_facility_id: user.health_facility_id || "",
                consulted_by_id: user.hospital_staff_id || prev.consulted_by_id
            }));
        }
    }, [user, formData.health_facility_id, mode]);

    const handleInputChange = (field: keyof CreateConsultationRequest | keyof UpdateConsultationRequest, value: unknown) => {
        const actualValue = value === '' ? undefined : value;
        setFormData((prev) => ({
            ...prev,
            [field]: actualValue
        }));

        if (errors[field as string]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleVitalSignsChange = (field: keyof VitalSigns, value: string) => {
        const numValue = value === '' ? undefined : parseFloat(value);
        setFormData((prev) => ({
            ...prev,
            vital_signs: {
                ...prev.vital_signs,
                [field]: numValue
            }
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string | undefined> = {};
        if (!formData.patient_id) newErrors.patient_id = "Le patient est requis";
        if (!formData.chief_complaint) newErrors.chief_complaint = "Le motif est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            await onSubmit(formData);
        }
    };

    const statusOptions = [
        { value: 'SCHEDULED', label: 'Planifiée' },
        { value: 'IN_PROGRESS', label: 'En cours' },
        { value: 'COMPLETED', label: 'Terminée' },
        { value: 'CANCELLED', label: 'Annulée' },
        { value: 'NO_SHOW', label: 'Absent' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations principales */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Informations principales
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="patient_id">Patient <span className="text-red-500">*</span></Label>
                        <PatientSelect
                            value={formData.patient_id}
                            onChange={(value) => handleInputChange('patient_id', value || '')}
                            placeholder="Sélectionner un patient"
                            disabled={isSubmitting || mode === 'edit'} // Usually patient is not changed during edit
                            className={errors.patient_id ? 'border-red-500' : ''}
                        />
                        {errors.patient_id && <p className="text-xs text-red-500">{errors.patient_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="chief_complaint">Motif principal <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="chief_complaint"
                            value={formData.chief_complaint}
                            onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
                            placeholder="Décrivez le motif principal..."
                            rows={3}
                            className={errors.chief_complaint ? 'border-red-500' : ''}
                        />
                        {errors.chief_complaint && <p className="text-xs text-red-500">{errors.chief_complaint}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="other_symptoms">Autres symptômes</Label>
                        <Textarea
                            id="other_symptoms"
                            value={formData.other_symptoms || ""}
                            onChange={(e) => handleInputChange('other_symptoms', e.target.value)}
                            placeholder="Autres observations..."
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Localisation */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Localisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="health_facility_id">Établissement de santé</Label>
                            <HealthFacilitySelect
                                value={formData.health_facility_id || undefined}
                                onChange={(value) => {
                                    handleInputChange('health_facility_id', value || undefined);
                                    handleInputChange('department_id', undefined);
                                    handleInputChange('triage_by_id', undefined);
                                    handleInputChange('consulted_by_id', undefined);
                                }}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department_id">Département</Label>
                            <DepartmentSelect
                                value={formData.department_id || undefined}
                                onChange={(value) => handleInputChange('department_id', value || undefined)}
                                healthFacilityId={formData.health_facility_id || undefined}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Signes vitaux */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Signes vitaux
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="temperature" className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4" /> Temp. (°C)
                            </Label>
                            <Input
                                id="temperature"
                                type="number"
                                step="0.1"
                                value={formData.vital_signs?.temperature ?? ""}
                                onChange={(e) => handleVitalSignsChange('temperature', e.target.value)}
                                placeholder="37.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pulse">Pouls (bpm)</Label>
                            <Input
                                id="pulse"
                                type="number"
                                value={formData.vital_signs?.pulse ?? ""}
                                onChange={(e) => handleVitalSignsChange('pulse', e.target.value)}
                                placeholder="70"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="systolic_bp">Systolique</Label>
                            <Input
                                id="systolic_bp"
                                type="number"
                                value={formData.vital_signs?.systolic_bp ?? ""}
                                onChange={(e) => handleVitalSignsChange('systolic_bp', e.target.value)}
                                placeholder="120"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diastolic_bp">Diastolique</Label>
                            <Input
                                id="diastolic_bp"
                                type="number"
                                value={formData.vital_signs?.diastolic_bp ?? ""}
                                onChange={(e) => handleVitalSignsChange('diastolic_bp', e.target.value)}
                                placeholder="80"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="flex items-center gap-2">
                                <Weight className="h-4 w-4" /> Poids (kg)
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                value={formData.vital_signs?.weight ?? ""}
                                onChange={(e) => handleVitalSignsChange('weight', e.target.value)}
                                placeholder="70.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height" className="flex items-center gap-2">
                                <Ruler className="h-4 w-4" /> Taille (cm)
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                value={formData.vital_signs?.height ?? ""}
                                onChange={(e) => handleVitalSignsChange('height', e.target.value)}
                                placeholder="170"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personnel médical */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Personnel médical
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="triage_by_id">Triage par</Label>
                            <HospitalStaffSelect
                                value={formData.triage_by_id || undefined}
                                onChange={(value) => handleInputChange('triage_by_id', value || undefined)}
                                healthFacilityId={formData.health_facility_id || undefined}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="consulted_by_id">Consulté par</Label>
                            <HospitalStaffSelect
                                value={formData.consulted_by_id || undefined}
                                onChange={(value) => handleInputChange('consulted_by_id', value || undefined)}
                                healthFacilityId={formData.health_facility_id || undefined}
                                disabled={isSubmitting || disableConsultedBy}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Diagnostic et traitement */}
            <Card>
                <CardHeader>
                    <CardTitle>Diagnostic et traitement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnostic</Label>
                        <Textarea
                            id="diagnosis"
                            value={formData.diagnosis || ""}
                            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                            placeholder="Diagnostic..."
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="treatment_plan">Plan de traitement</Label>
                        <Textarea
                            id="treatment_plan"
                            value={formData.treatment_plan || ""}
                            onChange={(e) => handleInputChange('treatment_plan', e.target.value)}
                            placeholder="Traitement..."
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="follow_up_notes">Notes de suivi</Label>
                            <Textarea
                                id="follow_up_notes"
                                value={formData.follow_up_notes || ""}
                                onChange={(e) => handleInputChange('follow_up_notes', e.target.value)}
                                placeholder="Suivi..."
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="follow_up_date">Date de suivi</Label>
                            <Input
                                id="follow_up_date"
                                type="date"
                                value={formData.follow_up_date || ""}
                                onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions */}
            {showPrescriptions && (
                <PrescriptionsTable
                    prescriptions={formData.prescriptions || []}
                    onChange={(prescriptions) => handleInputChange('prescriptions', prescriptions)}
                    disabled={isSubmitting}
                />
            )}

            {/* Statut et confidentialité */}
            <Card>
                <CardHeader>
                    <CardTitle>Statut et confidentialité</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_confidential"
                                checked={formData.is_confidential || false}
                                onCheckedChange={(checked: boolean) => handleInputChange('is_confidential', checked)}
                            />
                            <Label htmlFor="is_confidential">Consultation confidentielle</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <CustomSelect
                                options={statusOptions}
                                value={formData.status}
                                onChange={(value) => handleInputChange('status', value)}
                                height="h-12"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Enregistrement..." : (mode === 'add' ? "Créer la consultation" : "Enregistrer les modifications")}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
