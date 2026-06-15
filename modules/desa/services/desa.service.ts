// modules/desa/services/desa.service.ts
import { villageProfileService } from "@/modules/dashboard/services/villageProfile.service";
import { newsService } from "@/modules/dashboard/services/villageNews.service";
import { getAllLiterasi } from "@/modules/literasi/services/literasi.service";
import { potentialService } from "@/modules/dashboard/services/villagePotential.service";
import { populationService } from "@/modules/dashboard/services/villagePopulation.service";
import { facilityService } from "@/modules/dashboard/services/villageFacility.service";
import { storeService } from "@/modules/marketplace/services/store.service";
import { getDatabase, ref, get } from "firebase/database";

export const desaService = {
  getHomeData: async () => {
    // Ambil stores dulu
    const stores = await storeService.getAllActive();
    
    // Ambil SEMUA products dari SEMUA stores
    const db = getDatabase();
    let allProducts: any[] = [];
    
    if (stores.length > 0) {
      // Ambil products dari setiap store
      const productPromises = stores.map(async (store) => {
        const productsRef = ref(db, `products/${store.id}`);
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          return Object.values(data).filter((p: any) => p.isActive === true);
        }
        return [];
      });
      
      const productsArray = await Promise.all(productPromises);
      allProducts = productsArray.flat();
    }

    const [profile, news, literasi, potential, population, facilities] =
      await Promise.all([
        villageProfileService.get(),
        newsService.get(),
        getAllLiterasi(),
        potentialService.get(),
        populationService.get(),
        facilityService.get(),
      ]);

    return {
      profile,
      news,
      literasi,
      potential,
      population,
      facilities,
      stores,
      products: allProducts, // ← TAMBAH: SEMUA products
    };
  },
};