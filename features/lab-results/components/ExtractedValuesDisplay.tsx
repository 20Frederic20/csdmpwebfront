import React from 'react';
import { TEST_FIELDS_CONFIG, TestField } from '@/features/lab-results/config/test-fields.config';
import { TestType } from '@/features/lab-results/types/lab-results.types';

interface ExtractedValuesDisplayProps {
  extractedValues: any;
  testType: TestType;
}

export function ExtractedValuesDisplay({ extractedValues, testType }: ExtractedValuesDisplayProps) {
  if (!extractedValues) return null;

  const configFields = TEST_FIELDS_CONFIG[testType] || [];
  
  // Parse stringified JSON values
  const parsedValues: Record<string, any> = {};
  Object.entries(extractedValues).forEach(([key, val]) => {
    if (typeof val === 'string') {
      try {
        parsedValues[key] = JSON.parse(val);
      } catch {
        parsedValues[key] = val;
      }
    } else {
      parsedValues[key] = val;
    }
  });

  return (
    <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-950">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Paramètre</th>
            <th className="px-4 py-3 font-medium">Résultat</th>
            <th className="px-4 py-3 font-medium">Valeurs de Référence</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {Object.entries(parsedValues).map(([key, val]) => {
            const fieldConfig = configFields.find((f: TestField) => f.name === key);
            const label = fieldConfig ? fieldConfig.label : key;
            const unit = fieldConfig?.unit ? ` ${fieldConfig.unit}` : '';
            
            let displayValue = '';
            let referenceRange = '-';
            let isAbnormal = false;

            if (typeof val === 'object' && val !== null) {
               // Handles format: { value: 1.5, min_ref: 1.0, max_ref: 2.0 }
               const { value, min_ref, max_ref } = val;
               displayValue = value !== null && value !== undefined && value !== "" ? `${value}${unit}` : '-';
               
               if (min_ref !== null && min_ref !== undefined || max_ref !== null && max_ref !== undefined) {
                 if (min_ref !== null && min_ref !== undefined && max_ref !== null && max_ref !== undefined) {
                   referenceRange = `${min_ref} - ${max_ref}${unit}`;
                 } else if (min_ref !== null && min_ref !== undefined) {
                   referenceRange = `> ${min_ref}${unit}`;
                 } else if (max_ref !== null && max_ref !== undefined) {
                   referenceRange = `< ${max_ref}${unit}`;
                 }

                 // Check abnormality
                 if (value !== null && value !== undefined && value !== "") {
                   const numValue = Number(value);
                   if (!isNaN(numValue)) {
                     if (min_ref !== null && min_ref !== undefined && numValue < Number(min_ref)) isAbnormal = true;
                     if (max_ref !== null && max_ref !== undefined && numValue > Number(max_ref)) isAbnormal = true;
                   }
                 }
               }
            } else {
               // Simple textual or select value or raw numeric value
               displayValue = val !== null && val !== undefined && val !== "" ? `${val}${unit}` : '-';
               
               // For raw numbers, if defaultMin/Max are set in config, we can check abnormality as well
               if (fieldConfig?.defaultMin !== undefined || fieldConfig?.defaultMax !== undefined) {
                 const min = fieldConfig.defaultMin;
                 const max = fieldConfig.defaultMax;
                 
                 if (min !== undefined && max !== undefined) {
                   referenceRange = `${min} - ${max}${unit}`;
                 } else if (min !== undefined) {
                   referenceRange = `> ${min}${unit}`;
                 } else if (max !== undefined) {
                   referenceRange = `< ${max}${unit}`;
                 }

                 if (val !== null && val !== undefined && val !== "") {
                   const numValue = Number(val);
                   if (!isNaN(numValue)) {
                     if (min !== undefined && numValue < min) isAbnormal = true;
                     if (max !== undefined && numValue > max) isAbnormal = true;
                   }
                 }
               }
            }

            return (
              <tr key={key} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <td className="px-4 py-3 font-medium">{label}</td>
                <td className={`px-4 py-3 ${isAbnormal ? 'text-red-500 font-bold' : ''}`}>
                  {displayValue}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{referenceRange}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
