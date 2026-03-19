import { LabResult } from "../types/lab-results.types";

export const getEvolutionData = (labResults: LabResult[], testKey: string) => {
  if (!labResults || !Array.isArray(labResults)) return [];
  
  return labResults
    .map(res => {
      let extracted = res.extracted_values;
      
      // Sécurité si tout le bloc extracted_values est encodé en string
      if (typeof extracted === 'string') {
        try {
            extracted = JSON.parse(extracted);
        } catch(e) {
            return null;
        }
      }

      if (!extracted || typeof extracted !== 'object') return null;
      
      const val = (extracted as Record<string, any>)[testKey];
      if (val === undefined || val === null) return null;

      let parsedVal = val;
      if (typeof val === 'string') {
        try {
          parsedVal = JSON.parse(val);
        } catch {
          // Si c'est un nombre sous forme de string
          parsedVal = { value: Number(val) };
        }
      }

      if (parsedVal && typeof parsedVal === 'object' && parsedVal.value !== null && parsedVal.value !== undefined && parsedVal.value !== "") {
        return {
          date: new Date(res.date_performed).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          value: Number(parsedVal.value),
          fullDate: res.date_performed
        };
      } else if (parsedVal !== null && parsedVal !== undefined && parsedVal !== "" && !isNaN(Number(parsedVal))) {
        return {
          date: new Date(res.date_performed).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          value: Number(parsedVal),
          fullDate: res.date_performed
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
};
