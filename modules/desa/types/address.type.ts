// modules/desa/types/address.type.ts

export type VillageAddress = {
  detailAddress?: string;
  
  rt?: string;
  rw?: string;
  
  village?: string;
  district?: string;
  regency?: string;
  province?: string;
  
  postalCode?: string;
  
  // Batas Wilayah
  north?: string;     // Utara
  south?: string;    // Selatan
  east?: string;     // Timur
  west?: string;    // Barat
};