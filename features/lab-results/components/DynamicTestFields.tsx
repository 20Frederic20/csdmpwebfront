import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TEST_FIELDS_CONFIG } from "@/features/lab-results/config/test-fields.config";

export const DynamicTestFields = ({ testType, register }: { testType: string; register: any }) => {
  const fields = TEST_FIELDS_CONFIG[testType] || [];

  if (fields.length === 0) {
    return <div className="p-4 border rounded bg-slate-50 dark:bg-slate-900/50 italic text-muted-foreground">Saisie manuelle requise pour ce type.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          {field.type === 'number' ? (
            <div className="space-y-2 border p-3 rounded-md bg-white dark:bg-slate-950">
              <Label>{field.label} {field.unit ? `(${field.unit})` : ''}</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-normal">Valeur</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Valeur"
                    {...register(`extracted_values.${field.name}.value`, { 
                        setValueAs: (v: any) => {
                            if (v === null || v === undefined || v === '') return null;
                            if (typeof v === 'number') return v;
                            if (typeof v === 'string') {
                                const parsed = Number(v.trim().replace(',', '.'));
                                return isNaN(parsed) ? null : parsed;
                            }
                            return null;
                        }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-normal">Min</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Min"
                    defaultValue={field.defaultMin}
                    {...register(`extracted_values.${field.name}.min_ref`, { 
                        setValueAs: (v: any) => {
                            if (v === null || v === undefined || v === '') return null;
                            if (typeof v === 'number') return v;
                            if (typeof v === 'string') {
                                const parsed = Number(v.trim().replace(',', '.'));
                                return isNaN(parsed) ? null : parsed;
                            }
                            return null;
                        }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-normal">Max</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Max"
                    defaultValue={field.defaultMax}
                    {...register(`extracted_values.${field.name}.max_ref`, { 
                        setValueAs: (v: any) => {
                            if (v === null || v === undefined || v === '') return null;
                            if (typeof v === 'number') return v;
                            if (typeof v === 'string') {
                                const parsed = Number(v.trim().replace(',', '.'));
                                return isNaN(parsed) ? null : parsed;
                            }
                            return null;
                        }
                    })}
                  />
                </div>
              </div>
            </div>
          ) : field.type === 'select' ? (
            <div className="space-y-2 border p-3 rounded-md bg-white dark:bg-slate-950">
              <Label htmlFor={field.name}>{field.label} {field.unit ? `(${field.unit})` : ''}</Label>
              <select
                id={field.name}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register(`extracted_values.${field.name}`)}
              >
                <option value="">Sélectionner...</option>
                {field.options?.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2 border p-3 rounded-md bg-white dark:bg-slate-950">
              <Label htmlFor={field.name}>{field.label} {field.unit ? `(${field.unit})` : ''}</Label>
              <Input
                id={field.name}
                type="text"
                {...register(`extracted_values.${field.name}`)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
