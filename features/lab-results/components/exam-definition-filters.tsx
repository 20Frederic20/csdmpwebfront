'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/custom-select';
import { getTestTypeOptions } from '@/features/lab-results/types/lab-results.types';
import { X } from 'lucide-react';

interface ExamDefinitionFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function ExamDefinitionFilters({ filters, onFiltersChange, onReset }: ExamDefinitionFiltersProps) {
  const testTypeOptions = [
    { value: '', label: 'Tous les types' },
    ...getTestTypeOptions().map((o) => ({ value: o.value, label: o.label })),
  ];

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="min-w-[200px]">
        <CustomSelect
          options={testTypeOptions}
          value={filters.test_type || ''}
          onChange={(val) => onFiltersChange({ ...filters, test_type: val || undefined })}
          placeholder="Filtrer par type de test"
        />
      </div>
      <div className="min-w-[220px]">
        <Input
          placeholder="Rechercher par nom..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
        />
      </div>
      <Button variant="outline" size="sm" onClick={onReset} className="gap-1">
        <X className="h-3 w-3" />
        Réinitialiser
      </Button>
    </div>
  );
}
