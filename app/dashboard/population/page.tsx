"use client";

import { useSearchParams } from "next/navigation";
import { useVillagePopulation } from "@/modules/dashboard/hooks/useVillagePopulation";
import PopulationHeader from "@/components/dashboard/population/PopulationHeader";
import PopulationForm from "@/components/dashboard/population/PopulationForm";
import PopulationTable from "@/components/dashboard/population/PopulationTable";
import type { FormPopulation } from "@/modules/desa/types/villagePopulation.type";

export default function PopulationPage() {
  const searchParams = useSearchParams();
  
  const yearParam = searchParams.get("year");
  const editYear = searchParams.get("edit");
  const isAdd = searchParams.get("add") !== null;
  const isFormMode = isAdd || !!editYear;
  
  const { populationList, isSaving, addPopulation, updatePopulation, deletePopulation, getYears } = useVillagePopulation();
  
  // Data for edit
  const population = editYear ? populationList.find(p => p.year === editYear) : undefined;

  const handleSave = async (form: FormPopulation) => {
    if (editYear) {
      await updatePopulation(editYear, form);
    } else {
      await addPopulation(form);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/population";
  };

  // Get all unique years
  const years = getYears();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <PopulationHeader 
      years={getYears()}
      onDelete={deletePopulation}/>
      
      <div className="p-8">
        {isFormMode ? (
          <PopulationForm 
            population={population}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <PopulationTable 
            data={populationList}
            selectedYear={yearParam || undefined}
          />
        )}
      </div>
    </div>
  );
}