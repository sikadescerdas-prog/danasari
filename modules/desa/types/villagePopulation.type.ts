// modules/desa/types/villagePopulation.type.ts

export interface VillagePopulation {
  id?: string;
  year?: string;
  
  // KK & Penduduk
  totalKK?: number;
  male?: number;
  female?: number;
  
  // Wilayah
  rt?: number;
  rw?: number;
  
  // Agama
  islam?: number;
  kristen?: number;
  katolik?: number;
  hindu?: number;
  buddha?: number;
  konghucu?: number;
  agamaLain?: number;
  
  // Disabilitas
  disabilitas?: number;
  
  // Pendidikan
  belumSekolah?: number;
  sd?: number;
  smp?: number;
  sma?: number;
  diploma?: number;
  sarjana?: number;
  pascasarjana?: number;
  
  // Pekerjaan
  farmer?: number;
  entrepreneur?: number;
  employee?: number;
  government?: number;
  student?: number;
  pekerjaanLain?: number;
  
  createdAt?: number;
  updatedAt?: number;
}

export interface FormPopulation {
  year?: string;
  
  // KK & Penduduk
  totalKK?: number;
  male?: number;
  female?: number;
  
  // Wilayah
  rt?: number;
  rw?: number;
  
  // Agama
  islam?: number;
  kristen?: number;
  katolik?: number;
  hindu?: number;
  buddha?: number;
  konghucu?: number;
  agamaLain?: number;
  
  // Disabilitas
  disabilitas?: number;
  
  // Pendidikan
  belumSekolah?: number;
  sd?: number;
  smp?: number;
  sma?: number;
  diploma?: number;
  sarjana?: number;
  pascasarjana?: number;
  
  // Pekerjaan
  farmer?: number;
  entrepreneur?: number;
  employee?: number;
  government?: number;
  student?: number;
  pekerjaanLain?: number;
}