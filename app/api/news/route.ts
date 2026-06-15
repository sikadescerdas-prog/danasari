import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 10);

    const snapshot = await get(ref(db, "village/news"));

    let result: any[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();

        result.push({
          id: data.id || child.key,
          title: data.title || "",
          content: data.content || "",
          type: data.type || "berita",
          date: data.date || data.createdAt,
          createdAt: data.createdAt || 0,
          updatedAt: data.updatedAt || 0,
          image: data.image || null,
        });
      });
    }

    // ======================
    // SORT TERBARU
    // ======================
    result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // ======================
    // LIMIT
    // ======================
    const limited = result.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limited,
    });
  } catch (error) {
    console.error("GET /api/news error:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
      },
      { status: 500 }
    );
  }
}