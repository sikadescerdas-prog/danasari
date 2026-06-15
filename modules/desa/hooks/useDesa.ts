// modules/desa/hooks/useDesa.ts

"use client";

import { useEffect, useState } from "react";
import { desaService } from "../services/desa.service";

export function useDesa() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [literasi, setLiterasi] = useState<any[]>([]);
  const [potential, setPotential] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const data = await desaService.getHomeData();

        setProfile(data.profile);
        setNews(data.news);
        setLiterasi(data.literasi);
        setPotential(data.potential);
        setFacilities(data.facilities);
        setStores(data.stores);
      } catch (err) {
        console.error("useDesa error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    profile,
    news,
    literasi,
    potential,
    facilities,
    stores,
  };
}