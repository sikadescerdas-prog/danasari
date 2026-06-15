// app/dashboard/potential/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useVillagePotential } from "@/modules/dashboard/hooks/useVillagePotential";
import PotentialHeader from "@/components/dashboard/potential/PotentialHeader";
import PotentialForm from "@/components/dashboard/potential/PotentialForm";
import PotentialTable from "@/components/dashboard/potential/PotentialTable";
import type { Formpotential } from "@/modules/desa/types/villagePotential.type";

export default function PotentialPage() {
  const searchParams = useSearchParams();
  
  const editId = searchParams.get("edit");
  const isAdd = searchParams.get("add") !== null;
  
  const isFormMode = isAdd || !!editId;
  
  const { potentialList, isSaving, addPotential, updatePotential, deletePotential, reload } = useVillagePotential();
  
  const potential = editId ? potentialList.find((p) => p.id === editId) : undefined;

  const handleSave = async (form: Formpotential) => {
    if (editId) {
      await updatePotential(editId, form);
    } else {
      await addPotential(form);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/potential";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <PotentialHeader />
      
      <div className="p-8">
        {isFormMode ? (
          <PotentialForm 
            potential={potential}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <PotentialTable 
            data={potentialList}
            onEdit={(item) => window.location.href = `?edit=${item.id}`}
            onDelete={async (item) => {
              await deletePotential(item.id, item.image?.publicId);
              await reload();
            }}
          />
        )}
      </div>
    </div>
  );
}