// app/dashboard/structure/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useVillageStructure } from "@/modules/dashboard/hooks/useVillageStructure";
import StructureHeader from "@/components/dashboard/structure/StructureHeader";
import StructureForm from "@/components/dashboard/structure/StructureForm";
import StructureTable from "@/components/dashboard/structure/StructureTable";
import type { FormStructure } from "@/modules/desa/types/villageStructure.type";

export default function StructurePage() {
  const searchParams = useSearchParams();
  
  const editId = searchParams.get("edit");
  const isAdd = searchParams.get("add") !== null;
  
  const isFormMode = isAdd || !!editId;
  
  const { structureList, isSaving, addStructure, updateStructure, deleteStructure, reload } = useVillageStructure();
  
  const structure = editId ? structureList.find((s) => s.id === editId) : undefined;

  const handleSave = async (form: FormStructure) => {
    if (editId) {
      await updateStructure(editId, form);
    } else {
      await addStructure(form);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/structure";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <StructureHeader />
      
      <div className="p-8">
        {isFormMode ? (
          <StructureForm 
            structure={structure}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <StructureTable 
            data={structureList}
            onEdit={(item) => window.location.href = `?edit=${item.id}`}
            onDelete={async (item) => {
              await deleteStructure(item.id, item.photo?.publicId);
              await reload();
            }}
          />
        )}
      </div>
    </div>
  );
}