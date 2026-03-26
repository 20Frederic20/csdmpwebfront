'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ParameterNormInfo } from '@/features/lab-results/types/lab-exam-definitions.types';
import { Loader2 } from 'lucide-react';

interface DynamicTestFieldsProps {
  parameters: ParameterNormInfo[];
  register: any;
  isLoading?: boolean;
}

export const DynamicTestFields = ({ parameters, register, isLoading }: DynamicTestFieldsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 border rounded-lg bg-slate-50 dark:bg-slate-900/50 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Chargement des paramètres...</span>
      </div>
    );
  }

  if (!parameters || parameters.length === 0) {
    return (
      <div className="p-4 border rounded bg-slate-50 dark:bg-slate-900/50 italic text-muted-foreground text-sm">
        Aucun paramètre disponible pour ce type de test et cet établissement.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
      {parameters.map((param) => (
        <div key={param.parameter_code} className="space-y-2">
          <div className="space-y-2 border p-3 rounded-md bg-white dark:bg-slate-950">
            <Label>
              {param.display_name}{' '}
              {param.unit ? (
                <span className="text-xs font-normal text-muted-foreground">({param.unit})</span>
              ) : null}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Valeur</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Valeur"
                  {...register(`extracted_values.${param.parameter_code}.value`, {
                    setValueAs: (v: any) => {
                      if (v === null || v === undefined || v === '') return null;
                      if (typeof v === 'number') return v;
                      if (typeof v === 'string') {
                        const parsed = Number(v.trim().replace(',', '.'));
                        return isNaN(parsed) ? null : parsed;
                      }
                      return null;
                    },
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Min</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Min"
                  defaultValue={param.min_value}
                  {...register(`extracted_values.${param.parameter_code}.min_ref`, {
                    setValueAs: (v: any) => {
                      if (v === null || v === undefined || v === '') return null;
                      if (typeof v === 'number') return v;
                      if (typeof v === 'string') {
                        const parsed = Number(v.trim().replace(',', '.'));
                        return isNaN(parsed) ? null : parsed;
                      }
                      return null;
                    },
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-normal">Max</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Max"
                  defaultValue={param.max_value}
                  {...register(`extracted_values.${param.parameter_code}.max_ref`, {
                    setValueAs: (v: any) => {
                      if (v === null || v === undefined || v === '') return null;
                      if (typeof v === 'number') return v;
                      if (typeof v === 'string') {
                        const parsed = Number(v.trim().replace(',', '.'));
                        return isNaN(parsed) ? null : parsed;
                      }
                      return null;
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
