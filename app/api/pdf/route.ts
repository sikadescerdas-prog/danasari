// app/api/pdf/route.ts

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  // ✅ Generate signed URL jika dari Cloudinary
  if (url.includes('cloudinary.com')) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const signature = cloudinary.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_API_SECRET!
      );
      
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}timestamp=${timestamp}&signature=${signature}&api_key=${process.env.CLOUDINARY_API_KEY}`;
      
      console.log("🔐 Signed URL generated:", url);
    } catch (e) {
      console.error("❌ Failed to generate signed URL:", e);
    }
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: `Cloudinary error: ${response.status}` }, { status: response.status });
    }

    const blob = await response.blob();
    const filename = searchParams.get("filename") || url.split("/").pop()?.split("?")[0] || "document.pdf";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}