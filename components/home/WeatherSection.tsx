"use client";

import { useEffect, useState } from "react";
import {
  CloudSun,
  CloudRain,
  Cloud,
  Wind,
  Droplets,
  RefreshCw,
  Radio,
  MapPin,
  CloudLightning,
  CloudSunRain,
  Sun,
  ExternalLink,
} from "lucide-react";

import {
  calculateFloodRisk,
  calculateLandslideRisk,
} from "@/modules/weather/types/weather.type";

interface WeatherData {
  current: {
    time: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
  location?: string;
  updatedAt?: string;
}

export default function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/weather");
      const data = await res.json();
      setWeather(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const current = weather?.current;

  const floodRisk = weather
    ? calculateFloodRisk(current as any)
    : "LOW";
  const landslideRisk = weather
    ? calculateLandslideRisk(current as any)
    : "LOW";

  const getWeatherIcon = (cond: string) => {
    const c = cond?.toLowerCase() || "";
    const base =
      "h-16 w-16 drop-shadow-xl transition-all duration-500";

    // ⛈️ Petir
    if (c.includes("petir") || c.includes("badai")) {
      return (
        <div className="relative">
          <CloudLightning
            className={`${base} text-indigo-500 animate-pulse`}
          />

          <div className="absolute inset-0 bg-yellow-300/20 blur-xl animate-flash rounded-full" />
        </div>
      );
    }

    // 🌧️ Hujan
    if (c.includes("hujan")) {
      return (
        <div className="relative">
          <CloudSunRain
            className={`${base} text-blue-500 animate-weather-float`}
          />

          <span className="absolute -bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        </div>
      );
    }

    // 🌤️ Cerah Berawan
    if (
      c.includes("cerah berawan") ||
      c.includes("berawan")
    ) {
      return (
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-yellow-300/30 blur-3xl animate-pulse" />

          <div className="sun-rays" />

          <Sun className="h-14 w-14 text-yellow-500 animate-sun-spin" />

          <Cloud className="absolute bottom-0 right-0 h-8 w-8 text-white animate-cloud-float" />
        </div>
      );
    }

    // ☁️ Mendung
    if (c.includes("awan") || c.includes("mendung")) {
      return (
        <div className="animate-cloud-float">
          <Cloud className={`${base} text-gray-400`} />
        </div>
      );
    }

    // ☀️ Cerah
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-yellow-300/30 blur-3xl animate-pulse" />

        <div className="sun-rays" />

        <Sun
          className={`${base} text-yellow-500 animate-sun-spin`}
        />
      </div>
    );
  };

  // 🌈 BACKGROUND
  const bg = (() => {
    const c = (current?.condition || "").toLowerCase();

    if (c.includes("hujan")) {
      return "bg-gradient-to-br from-blue-100 via-white to-blue-50";
    }

    if (c.includes("mendung")) {
      return "bg-gradient-to-br from-gray-100 via-white to-gray-50";
    }

    return "bg-gradient-to-br from-yellow-100 via-white to-orange-50";
  })();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 shadow-xl border border-white/40 backdrop-blur-xl transition-all duration-500 ${bg}`}
    >
      {/* glow */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),transparent)]" />

      {/* 🌧️ rain effect */}
      {(current?.condition || "")
        .toLowerCase()
        .includes("hujan") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 w-[2px] h-4 bg-blue-400/40 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.6 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* HEADER */}
      <div className="relative flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-4 text-xl font-bold text-gray-900">
            <span className="flex items-center gap-2">
              🌤 Cuaca Desa
            </span>

            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              <Radio className="h-3 w-3 animate-pulse" /> LIVE
            </span>
          </h3>

          {/* LOCATION + INFO */}
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-red-500" />

            <span className="font-medium text-gray-700">
              {weather?.location || "Desa Danasari"}
            </span>
            <span className="text-gray-400">•</span>

            <span>Update {current?.time || "--:--"}</span>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex items-center gap-2">
          
          <a
            href="https://www.bmkg.go.id/cuaca/prakiraan-cuaca/33.03.17.2006"
            target="_blank"
            className="flex items-center gap-1 rounded-xl bg-blue-400 px-3 py-1.5 text-xs font-medium text-white shadow-md hover:bg-blue-700 hover:scale-105 transition"
          >
            <ExternalLink className={`h-3 w-3 ${
                loading ? "animate-spin" : ""
              }`} />
            <span className="hidden md:inline">Detail</span>
          </a>

          <button
            onClick={fetchWeather}
            disabled={loading}
            className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-green-700 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw
              className={`h-3 w-3 ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* RISK */}
      {(floodRisk !== "LOW" || landslideRisk !== "LOW") && (
        <div className="hidden relative mt-3 flex gap-2">
          {floodRisk !== "LOW" && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
              ⚠️ Banjir: {floodRisk}
            </span>
          )}

          {landslideRisk !== "LOW" && (
            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
              ⚠️ Longsor: {landslideRisk}
            </span>
          )}
        </div>
      )}

      {/* MAIN */}
      <div className="relative mt-8 flex items-center gap-5">
        {loading ? (
          <RefreshCw className="h-16 w-16 animate-spin text-gray-300" />
        ) : (
          getWeatherIcon(current?.condition || "")
        )}

        <div>
          <div className="text-5xl font-black text-gray-900 relative">
            <span className="absolute -inset-2 blur-2xl opacity-30 bg-yellow-300 rounded-full" />
            {current?.temperature ?? "--"}°C
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {current?.condition || "Memuat..."}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/70 p-4 backdrop-blur">
          <div className="flex items-center gap-1 text-gray-500">
            <Droplets className="h-4 w-4" />
            <span className="text-xs">Kelembaban</span>
          </div>
          <p className="text-lg font-bold">
            {current?.humidity ?? "--"}%
          </p>
        </div>

        <div className="rounded-xl bg-white/70 p-4 backdrop-blur">
          <div className="flex items-center gap-1 text-gray-500">
            <Wind className="h-4 w-4" />
            <span className="text-xs">Angin</span>
          </div>
          <p className="text-lg font-bold">
            {current?.windSpeed ?? "--"} km/jam
          </p>
        </div>
      </div>
    </div>
  );
}