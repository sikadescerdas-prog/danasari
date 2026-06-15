// app/dashboard/facility/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useVillageFacility } from "@/modules/dashboard/hooks/useVillageFacility";
import FacilityHeader from "@/components/dashboard/facility/FacilityHeader";
import FacilityForm from "@/components/dashboard/facility/FacilityForm";
import FacilityTable from "@/components/dashboard/facility/FacilityTable";
import type { FormFacility } from "@/modules/desa/types/villageFacility.type";

export default function FacilityPage() {
  const searchParams = useSearchParams();
  
  const editId = searchParams.get("edit");
  const isAdd = searchParams.get("add") !== null;
  
  const isFormMode = isAdd || !!editId;
  
  const { facilityList, isSaving, addFacility, updateFacility, deleteFacility, reload } = useVillageFacility();
  
  const facility = editId ? facilityList.find((f) => f.id === editId) : undefined;

  const handleSave = async (form: FormFacility) => {
    if (editId) {
      await updateFacility(editId, form);
    } else {
      await addFacility(form);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/facility";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <FacilityHeader />
      
      <div className="p-8">
        {isFormMode ? (
          <FacilityForm 
            facility={facility}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <FacilityTable 
            data={facilityList}
            onEdit={(item) => window.location.href = `?edit=${item.id}`}
            onDelete={async (item) => {
              await deleteFacility(item.id, item.photo?.publicId);
              await reload();
            }}
          />
        )}
      </div>
    </div>
  );
}