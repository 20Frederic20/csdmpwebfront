import { TestType } from "../types/lab-results.types";

export interface TestField {
  name: string;
  label: string;
  unit: string;
  defaultMin?: number;
  defaultMax?: number;
  type: "number" | "text" | "select";
  options?: string[];
}

export const TEST_FIELDS_CONFIG: Record<string, TestField[]> = {
  [TestType.BLOOD_COUNT]: [
    { name: "rbc", label: "Globules Rouges", unit: "10⁶/µL", defaultMin: 4.5, defaultMax: 5.9, type: "number" },
    { name: "hemoglobin", label: "Hémoglobine", unit: "g/dL", defaultMin: 13.0, defaultMax: 17.0, type: "number" },
    { name: "hematocrit", label: "Hématocrite", unit: "%", defaultMin: 40, defaultMax: 52, type: "number" },
    { name: "mcv", label: "VGM", unit: "fL", defaultMin: 80, defaultMax: 100, type: "number" },
    { name: "wbc", label: "Globules Blancs", unit: "10³/µL", defaultMin: 4.0, defaultMax: 10.0, type: "number" },
    { name: "neutrophils", label: "Poly. Neutrophiles", unit: "10³/µL", defaultMin: 1.8, defaultMax: 7.5, type: "number" },
    { name: "lymphocytes", label: "Lymphocytes", unit: "10³/µL", defaultMin: 1.0, defaultMax: 4.5, type: "number" },
    { name: "platelets", label: "Plaquettes", unit: "10³/µL", defaultMin: 150, defaultMax: 450, type: "number" },
  ],
  [TestType.CHEMISTRY]: [
    // Glycémie
    { name: "glucose", label: "Glycémie à jeun", unit: "g/L", defaultMin: 0.70, defaultMax: 1.10, type: "number" },
    // Fonction Rénale
    { name: "urea", label: "Urée", unit: "g/L", defaultMin: 0.15, defaultMax: 0.45, type: "number" },
    { name: "creatinine", label: "Créatinine", unit: "mg/L", defaultMin: 7, defaultMax: 13, type: "number" },
    // Bilan Lipidique
    { name: "cholesterol_total", label: "Cholestérol Total", unit: "g/L", defaultMin: 1.50, defaultMax: 2.00, type: "number" },
    { name: "hdl", label: "Cholestérol HDL", unit: "g/L", defaultMin: 0.40, defaultMax: 0.60, type: "number" },
    { name: "ldl", label: "Cholestérol LDL", unit: "g/L", defaultMin: 0.00, defaultMax: 1.30, type: "number" },
    { name: "triglycerides", label: "Triglycérides", unit: "g/L", defaultMin: 0.35, defaultMax: 1.50, type: "number" },
    // Bilan Hépatique
    { name: "asat", label: "ASAT (GOT)", unit: "UI/L", defaultMin: 5, defaultMax: 40, type: "number" },
    { name: "alat", label: "ALAT (GPT)", unit: "UI/L", defaultMin: 5, defaultMax: 45, type: "number" },
    { name: "ggt", label: "Gamma-GT", unit: "UI/L", defaultMin: 10, defaultMax: 60, type: "number" },
    { name: "bilirubin_total", label: "Bilirubine Totale", unit: "mg/L", defaultMin: 3, defaultMax: 12, type: "number" },
  ],
  [TestType.URINALYSIS]: [
    { name: "ph", label: "pH Urinaire", unit: "unit", defaultMin: 5.0, defaultMax: 7.5, type: "number" },
    { name: "density", label: "Densité", unit: "unit", defaultMin: 1.005, defaultMax: 1.030, type: "number" },
    { name: "glucose_uri", label: "Glucose", unit: "-", type: "select", options: ["Absence", "Traces", "+", "++", "+++"] },
    { name: "protein_uri", label: "Protéines", unit: "g/L", defaultMin: 0, defaultMax: 0.15, type: "number" },
    { name: "leukocytes_uri", label: "Leucocytes", unit: "/mm³", defaultMin: 0, defaultMax: 10, type: "number" },
    { name: "nitrites", label: "Nitrites", unit: "-", type: "select", options: ["Négatif", "Positif"] },
  ],
  [TestType.IMMUNOLOGY]: [
    { name: "crp", label: "CRP (Protéine C-Réactive)", unit: "mg/L", defaultMin: 0, defaultMax: 5, type: "number" },
    { name: "vsh_1h", label: "VS (1ère heure)", unit: "mm", defaultMin: 2, defaultMax: 15, type: "number" },
    { name: "tsh", label: "TSH Ultra-sensible", unit: "µUI/mL", defaultMin: 0.35, defaultMax: 4.94, type: "number" },
  ],
  [TestType.HEMATOLOGY]: [
    { name: "prothrombin_time", label: "Taux de Prothrombine", unit: "%", defaultMin: 70, defaultMax: 100, type: "number" },
    { name: "inr", label: "INR", unit: "ratio", defaultMin: 0.8, defaultMax: 1.2, type: "number" },
    { name: "tca", label: "TCA (Patient/Témoin)", unit: "ratio", defaultMin: 0.8, defaultMax: 1.2, type: "number" },
    { name: "fibrinogen", label: "Fibrinogène", unit: "g/L", defaultMin: 2.0, defaultMax: 4.0, type: "number" },
  ],
  // Types textuels / descriptifs
  [TestType.MICROBIOLOGY]: [
    { name: "direct_exam", label: "Examen Direct", unit: "", type: "text" },
    { name: "culture", label: "Culture (48h/72h)", unit: "", type: "text" },
    { name: "antibiogram", label: "Antibiogramme", unit: "", type: "text" },
  ],
  [TestType.PATHOLOGY]: [
    { name: "clinical_info", label: "Renseignements Cliniques", unit: "", type: "text" },
    { name: "macroscopy", label: "Macroscopie", unit: "", type: "text" },
    { name: "microscopy", label: "Microscopie", unit: "", type: "text" },
    { name: "conclusion", label: "Conclusion", unit: "", type: "text" },
  ]
};