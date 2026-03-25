'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CustomSelect from '@/components/ui/custom-select';
import { examDefinitionSchema, ExamDefinitionFormValues } from '../schemas/lab-exam-definitions.schema';
import { useCreateExamDefinition, useUpdateExamDefinition } from '../hooks/use-lab-exam-definitions';
import { ExamDefinition } from '../types/lab-exam-definitions.types';
import { getTestTypeOptions } from '../types/lab-results.types';
import { HealthFacilitySelect } from '@/features/health-facilities/components/health-facility-select';

interface ExamDefinitionModalProps {
  definition?: ExamDefinition;
  isOpen: boolean;
  onClose: () => void;
}

export function ExamDefinitionModal({ definition, isOpen, onClose }: ExamDefinitionModalProps) {
  const isUpdate = !!definition;
  const createMutation = useCreateExamDefinition();
  const updateMutation = useUpdateExamDefinition();
  const [newCode, setNewCode] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ExamDefinitionFormValues>({
    resolver: zodResolver(examDefinitionSchema) as any,
    defaultValues: {
      test_type: undefined,
      name: '',
      parameter_codes: [],
      health_facility_id: null,
      description: '',
      is_active: true,
    },
  });

  const parameterCodes = watch('parameter_codes');

  useEffect(() => {
    if (isOpen) {
      if (definition) {
        reset({
          test_type: definition.test_type,
          name: definition.name,
          parameter_codes: definition.parameter_codes,
          health_facility_id: definition.health_facility_id,
          description: definition.description ?? '',
          is_active: definition.is_active,
        });
      } else {
        reset({ test_type: undefined, name: '', parameter_codes: [], health_facility_id: null, description: '', is_active: true });
      }
    }
  }, [isOpen, definition, reset]);

  const addCode = () => {
    const code = newCode.trim().toUpperCase();
    if (code && !parameterCodes.includes(code)) {
      setValue('parameter_codes', [...parameterCodes, code]);
    }
    setNewCode('');
  };

  const removeCode = (code: string) => {
    setValue('parameter_codes', parameterCodes.filter((c) => c !== code));
  };

  const onSubmit = async (values: ExamDefinitionFormValues) => {
    try {
      if (isUpdate && definition) {
        await updateMutation.mutateAsync({ id: definition.id_, payload: values });
      } else {
        await createMutation.mutateAsync(values as any);
      }
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  const testTypeOptions = getTestTypeOptions().map((o) => ({ value: o.value, label: o.label }));
  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Modifier la définition d'examen" : "Créer une définition d'examen"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
            <Input id="name" {...register('name')} disabled={isLoading} placeholder="Ex: NFS Standard Adulte" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Test Type */}
          <div className="space-y-2">
            <Label>Type de test <span className="text-red-500">*</span></Label>
            <Controller
              control={control}
              name="test_type"
              render={({ field }) => (
                <CustomSelect
                  options={testTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner un type"
                  isDisabled={isUpdate || isLoading}
                />
              )}
            />
            {errors.test_type && <p className="text-xs text-red-500">{errors.test_type.message}</p>}
          </div>

          {/* Health Facility */}
          <div className="space-y-2">
            <Label>Établissement (optionnel)</Label>
            <Controller
              control={control}
              name="health_facility_id"
              render={({ field }) => (
                <HealthFacilitySelect
                  value={field.value ?? ''}
                  onChange={(val) => field.onChange(val || null)}
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} disabled={isLoading} placeholder="Description optionnelle" />
          </div>

          {/* Parameter Codes */}
          <div className="space-y-2 md:col-span-2">
            <Label>Codes des paramètres <span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Ex: HGB, WBC..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCode(); } }}
                disabled={isLoading}
              />
              <Button type="button" variant="outline" onClick={addCode} disabled={isLoading || !newCode.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.parameter_codes && <p className="text-xs text-red-500">{errors.parameter_codes.message}</p>}
            <div className="flex flex-wrap gap-2 pt-1 min-h-[32px]">
              {parameterCodes.map((code) => (
                <Badge key={code} className="bg-primary/10 text-primary border border-primary/20 font-mono text-xs gap-1">
                  {code}
                  <button type="button" onClick={() => removeCode(code)} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {parameterCodes.length === 0 && (
                <span className="text-xs text-muted-foreground italic">Ajoutez au moins un code paramètre</span>
              )}
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2 md:col-span-2">
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Checkbox id="is_active" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              )}
            />
            <Label htmlFor="is_active" className="cursor-pointer">Définition active</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || (isUpdate && !isDirty)} className="bg-primary hover:bg-primary/90 font-semibold">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isUpdate ? 'Mise à jour...' : 'Création...'}</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />{isUpdate ? 'Enregistrer' : 'Créer'}</>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
