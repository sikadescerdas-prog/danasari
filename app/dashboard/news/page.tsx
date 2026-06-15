// app/dashboard/news/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useVillageNews } from "@/modules/dashboard/hooks/useVillageNews";
import NewsHeader from "@/components/dashboard/news/NewsHeader";
import NewsForm from "@/components/dashboard/news/NewsForm";
import NewsTable from "@/components/dashboard/news/NewsTable";
import type { FormNews } from "@/modules/desa/types/villageNews.type";

export default function NewsPage() {
  const searchParams = useSearchParams();
  
  const editId = searchParams.get("edit");
  const isAdd = searchParams.get("add") !== null;
  
  const isFormMode = isAdd || !!editId;
  
  const { newsList, isSaving, addNews, updateNews, deleteNews, reload } = useVillageNews();
  
  const news = editId ? newsList.find((n) => n.id === editId) : undefined;

  const handleSave = async (form: FormNews) => {
    if (editId) {
      await updateNews(editId, form);
    } else {
      await addNews(form);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/news";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <NewsHeader />
      
      <div className="p-8">
        {isFormMode ? (
          <NewsForm 
            news={news}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <NewsTable 
            data={newsList}
            onEdit={(item) => window.location.href = `?edit=${item.id}`}
            onDelete={async (item) => {
              await deleteNews(item.id, item.image?.publicId);
              await reload();
            }}
          />
        )}
      </div>
    </div>
  );
}