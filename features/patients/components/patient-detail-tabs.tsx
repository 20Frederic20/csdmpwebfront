"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientAllergiesTab } from "./patient-allergies-tab";
import { MedicalHistoryTab } from "./medical-history-tab";
import { FamilyHistoryTab } from "./family-history-tab";
import { LifestyleTab } from "./lifestyle-tab";
import { PatientResponse } from "@/features/patients/types/patient-detail.types";

interface PatientDetailTabsProps {
  patient: PatientResponse;
}

export function PatientDetailTabs({ patient }: PatientDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("allergies");

  const handleAddAllergy = () => {
    console.log("Ajouter une allergie");
    // TODO: Implémenter la logique d'ajout d'allergie
  };

  const handleAddMedicalHistory = () => {
    console.log("Ajouter un antécédent médical");
    // TODO: Implémenter la logique d'ajout d'antécédent médical
  };

  const handleAddFamilyHistory = () => {
    console.log("Ajouter un antécédent familial");
    // TODO: Implémenter la logique d'ajout d'antécédent familial
  };

  const handleEditLifestyle = () => {
    console.log("Modifier le style de vie");
    // TODO: Implémenter la logique de modification du style de vie
  };

  const tabs = [
    {
      value: "allergies",
      label: "Allergies",
      count: patient.patient_allergies?.length || 0,
      component: (
        <PatientAllergiesTab 
          allergies={patient.patient_allergies}
          loading={false}
          onAdd={handleAddAllergy}
        />
      ),
    },
    {
      value: "medical-history",
      label: "Historique médical",
      count: patient.medical_histories?.length || 0,
      component: (
        <MedicalHistoryTab 
          medicalHistory={patient.medical_histories?.map(h => ({
            ...h,
            condition: h.description || h.category
          }))}
          loading={false}
          onAdd={handleAddMedicalHistory}
        />
      ),
    },
    {
      value: "family-history",
      label: "Historique familial",
      count: patient.family_histories?.length || 0,
      component: (
        <FamilyHistoryTab 
          familyHistory={patient.family_histories}
          loading={false}
          onAdd={handleAddFamilyHistory}
        />
      ),
    },
    {
      value: "lifestyle",
      label: "Style de vie",
      count: patient.lifestyles?.length || 0,
      component: (
        <LifestyleTab 
          lifestyle={patient.lifestyles}
          loading={false}
          onEdit={handleEditLifestyle}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="relative"
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
