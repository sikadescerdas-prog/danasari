"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { populationService } from "@/modules/dashboard/services/villagePopulation.service";
import { sweet } from "@/shared/utils/sweet";

import type { VillagePopulation } from "@/modules/desa/types/villagePopulation.type";

/* ================= HOOK ================= */

export function useVillagePopulation() {
  const router = useRouter();

  const [populationList, setPopulationList] = useState<VillagePopulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPopulation();
  }, []);

  /* ================= LOAD ================= */

  const loadPopulation = async () => {
    try {
      setIsLoading(true);
      const data = await populationService.get();
      setPopulationList(data);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= YEARS ================= */

  const getYears = (): string[] => {
    return populationList
      .map((p) => p.year)
      .filter((year): year is string => !!year)
      .sort((a, b) => b.localeCompare(a));
  };

  /* ================= REDIRECT ================= */

  const redirect = () => {
    router.push("/dashboard/population");
  };

  /* ================= ADD ================= */

  const addPopulation = async (form: VillagePopulation) => {
    try {
      setIsSaving(true);

      if (!form.year) throw new Error("Tahun wajib diisi");

      await populationService.addPopulation(form);
      await loadPopulation();

      sweet.toast({ title: "Berhasil", text: "Data ditambahkan" });

      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  /* ================= UPDATE ================= */

  const updatePopulation = async (
    year: string,
    form: Partial<VillagePopulation>
  ) => {
    try {
      setIsSaving(true);

      await populationService.updatePopulation(year, form);
      await loadPopulation();

      sweet.toast({ title: "Berhasil", text: "Data diperbarui" });

      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  /* ================= DELETE (WITH SWEET ALERT) ================= */

  const deletePopulation = async (year: string) => {
  if (!year) return;

  const isConfirmed = await sweet.confirm({
    title: "Hapus Data?",
    text: `Data tahun ${year} akan dihapus permanen`,
    confirmButtonText: "Hapus",
    cancelText: "Batal",
  });

  if (!isConfirmed) return;

  try {
    setIsSaving(true);

    await populationService.deletePopulation(year);
    await loadPopulation();

    sweet.toast({
      title: "Berhasil",
      text: "Data dihapus",
      icon: "success",
    });

    setTimeout(() => {
      router.push("/dashboard/population");
    }, 800);
  } catch (err: any) {
    sweet.error({
      title: "Gagal",
      text: err.message,
    });
  } finally {
    setIsSaving(false);
  }
};

  return {
    populationList,
    isLoading,
    isSaving,
    addPopulation,
    updatePopulation,
    deletePopulation,
    reload: loadPopulation,
    getYears,
  };
}