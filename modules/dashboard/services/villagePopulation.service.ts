import { ref, set, get, update } from "firebase/database";
import { db } from "@/lib/firebase";
import type { VillagePopulation } from "@/modules/desa/types/villagePopulation.type";

const POPULATION_REF = ref(db, "village/population");

/* ================= UTIL ================= */

const removeUndefined = (obj: any) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );

/* ================= SERVICE ================= */

export const populationService = {
  /* GET ALL */
  get: async (): Promise<VillagePopulation[]> => {
    const snapshot = await get(POPULATION_REF);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();

    return Object.entries(data).map(([year, value]: [string, any]) => ({
      ...value,
      id: year,
    }));
  },

  /* ADD */
  addPopulation: async (form: VillagePopulation) => {
    const snapshot = await get(POPULATION_REF);
    const popObj = snapshot.exists() ? snapshot.val() : {};

    if (!form.year) throw new Error("Tahun wajib diisi");
    if (popObj[form.year]) throw new Error(`Data tahun ${form.year} sudah ada`);

    const now = Date.now();

    const data = {
      year: form.year,
      totalKK: form.totalKK ?? 0,
      male: form.male ?? 0,
      female: form.female ?? 0,
      rt: form.rt ?? 0,
      rw: form.rw ?? 0,
      islam: form.islam ?? 0,
      kristen: form.kristen ?? 0,
      katolik: form.katolik ?? 0,
      hindu: form.hindu ?? 0,
      buddha: form.buddha ?? 0,
      konghucu: form.konghucu ?? 0,
      agamaLain: form.agamaLain ?? 0,
      disabilitas: form.disabilitas ?? 0,
      belumSekolah: form.belumSekolah ?? 0,
      sd: form.sd ?? 0,
      smp: form.smp ?? 0,
      sma: form.sma ?? 0,
      diploma: form.diploma ?? 0,
      sarjana: form.sarjana ?? 0,
      pascasarjana: form.pascasarjana ?? 0,
      farmer: form.farmer ?? 0,
      entrepreneur: form.entrepreneur ?? 0,
      employee: form.employee ?? 0,
      government: form.government ?? 0,
      student: form.student ?? 0,
      pekerjaanLain: form.pekerjaanLain ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    await set(ref(db, `village/population/${form.year}`), data);

    return { ...data, id: form.year };
  },

  /* UPDATE */
  updatePopulation: async (
    year: string,
    form: Partial<VillagePopulation>
  ) => {
    const snapshot = await get(POPULATION_REF);
    const popObj = snapshot.exists() ? snapshot.val() : {};

    if (!popObj[year]) {
      throw new Error(`Data tahun ${year} tidak ditemukan`);
    }

    const cleanForm = removeUndefined(form);

    const data = {
      ...cleanForm,
      updatedAt: Date.now(),
    };

    await update(ref(db, `village/population/${year}`), data);

    return {
      ...popObj[year],
      ...data,
      id: year,
    };
  },

  /* DELETE */
  deletePopulation: async (year: string) => {
    await set(ref(db, `village/population/${year}`), null);
  },
};