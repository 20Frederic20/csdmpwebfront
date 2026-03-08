"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import { PatientAllergiesTab } from "./patient-allergies-tab";
import { MedicalHistoryTab } from "./medical-history-tab";
import { FamilyHistoryTab } from "./family-history-tab";
import { LifestyleTab } from "./lifestyle-tab";
import { PatientResponse } from "@/features/patients/types/patient-detail.types";

interface PatientDetailTabsProps {
  patient: PatientResponse;
  patientId: string;
}

export function PatientDetailTabs({ patient, patientId }: PatientDetailTabsProps) {
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
          patientId={patientId}
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
          patientId={patientId}
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
          patientId={patientId}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="
          flex w-full
          h-auto
          p-1
          bg-slate-100/50
          overflow-x-auto
          no-scrollbar
          justify-start
          md:grid
          md:grid-cols-4
          rounded-lg
        ">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="
                flex items-center justify-center
                gap-2
                px-4 py-2.5
                min-w-max
                md:min-w-0
                transition-all
                data-[state=active]:bg-white
                data-[state=active]:text-primary
                data-[state=active]:shadow-sm
              "
            >
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="
                  inline-flex items-center justify-center
                  bg-primary text-primary-foreground
                  text-[11px] font-bold
                  min-w-[20px] h-5
                  px-1.5
                  rounded-full
                ">
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
