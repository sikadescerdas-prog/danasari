import { NextResponse } from "next/server";

const BMKG_API =
  "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.03.17.2006";

export async function GET() {
  try {
    const res = await fetch(BMKG_API, { cache: "no-store" });

    if (!res.ok) throw new Error("BMKG error");

    const json = await res.json();

    const cuaca = json?.data?.[0]?.cuaca?.flat?.() || [];

    const now = new Date();

    const first = cuaca[0];

    const current = {
      time: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: first?.t ?? 27,
      humidity: first?.hu ?? 70,
      windSpeed: first?.ws ?? 1.5,
      condition: first?.weather_desc ?? "Cerah Berawan",
    };

    return NextResponse.json({
      current,
      location: json?.data?.[0]?.lokasi?.desa || "Danasari",
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      current: {
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: 27,
        humidity: 70,
        windSpeed: 1.5,
        condition: "Cerah Berawan",
      },
      location: "Danasari",
      error: true,
      updatedAt: new Date().toISOString(),
    });
  }
}