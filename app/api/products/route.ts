import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 10);

    const allProducts: any[] = [];

    const snapshot = await get(ref(db, "products"));

    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const productsData = snapshot.val();

    for (const storeId of Object.keys(productsData || {})) {
      const storeProducts = productsData[storeId];

      // 🔥 FIX: ambil store yang benar
      const storeSnap = await get(ref(db, `stores/${storeId}`));
      const storeData = storeSnap.val() || {};

      for (const productId of Object.keys(storeProducts || {})) {
        const product = storeProducts[productId];

        allProducts.push({
          id: productId,
          storeId,
          ...product,

          // ✅ FIX PENTING DI SINI
          storeName: storeData.nameStore || "Toko UMKM",
          storeCity: storeData.addressStore?.city || "",
        });
      }
    }

    // filter active
    const active = allProducts.filter((p) => p.isActive !== false);

    // sort terbaru
    active.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return NextResponse.json({
      success: true,
      data: active.slice(0, limit),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      data: [],
    });
  }
}