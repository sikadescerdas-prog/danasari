// app/api/upload/route.ts

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    const publicIdInput = formData.get("publicId") as string;
    const cropType = (formData.get("cropType") as string) || "none";
    const resourceType = (formData.get("resourceType") as string) || "image";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    if (!folder) {
      return NextResponse.json({ error: "Missing folder" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // PDF/RAW handling
    if (resourceType === "raw") {
      let pdfPublicId = publicIdInput;
      
      if (!pdfPublicId) {
        const randomId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
        pdfPublicId = `${randomId}.pdf`;
      }
      
      if (!pdfPublicId.endsWith('.pdf')) {
        pdfPublicId = `${pdfPublicId}.pdf`;
      }

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: String(folder),
            public_id: pdfPublicId,
            overwrite: true,
            resource_type: "raw",
            type: "upload", // ✅ BUKAN "private"!
            access_mode: "public", // ✅ PASTIKAN PUBLIC!
          },
          (error, uploaded) => {
            if (error) return reject(error);
            if (!uploaded) return reject(new Error("Upload failed"));
            resolve(uploaded);
          }
        );

        stream.end(buffer);
      });

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    // Image handling
    let transformation: any[] = [];

    if (cropType === "1:1") {
      transformation = [
        { width: 1000, height: 1000, crop: "fill", gravity: "center" },
        { quality: "auto:good", fetch_format: "webp" },
      ];
    } else if (cropType === "16:9") {
      transformation = [
        { width: 1920, height: 1080, crop: "fill", gravity: "center" },
        { quality: "auto:good", fetch_format: "webp" },
      ];
    } else {
      transformation = [
        { width: 1000, crop: "limit" },
        { quality: "auto:good", fetch_format: "webp" },
      ];
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: String(folder),
          public_id: publicIdInput || undefined,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          transformation,
        },
        (error, uploaded) => {
          if (error) return reject(error);
          if (!uploaded) return reject(new Error("Upload failed"));
          resolve(uploaded);
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Upload failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}