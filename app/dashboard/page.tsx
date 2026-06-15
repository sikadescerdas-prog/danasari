"use client";

import { useVillageProfile } from "@/modules/dashboard/hooks/useVillageProfile";
import VillageHeader from "@/components/dashboard/profile/VillageHeader";
import VillageForm from "@/components/dashboard/profile/VillageForm";

export default function ProfilePage() {
  const { 
    formData, 
    isLoading, 
    isSaving,
    isUploading,
    isFirstTime,
    previewUrl,
    handleChange, 
    handleAddressChange,
    handleSosmedChange, 
    handleFileSelect,
    handleDeleteLogo, 
    save 
  } = useVillageProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6 pb-10">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <VillageHeader />

        <div className="p-8">
          <VillageForm 
            formData={formData}
            onChange={handleChange}
            onAddressChange={handleAddressChange}
            onSosmedChange={handleSosmedChange}
            onFileSelect={handleFileSelect}
            onDeleteLogo={handleDeleteLogo}
            isSaving={isSaving}
            onSave={save}
            isUploading={isUploading}
            isFirstTime={isFirstTime}
            previewUrl={previewUrl}
          />
        </div>
      </div>
    </form>
  );
}