// app/api/upload/delete/route.ts

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: Request) {
  try {
    const { publicId, folder, resourceType } = await req.json();

    // ✅ Accept BOTH publicId AND folder
    if (!publicId && !folder) {
      return NextResponse.json({ error: "publicId atau folder diperlukan" }, { status: 400 });
    }

    // ✅ Delete by publicId - with resourceType for PDF
    if (publicId) {
      console.log("🗑️ Deleting publicId:", publicId, "resourceType:", resourceType);
      
      // ✅ Pass resource_type untuk raw files (PDF)
      const result = await new Promise<any>((resolve, reject) => {
        const options = resourceType === "raw" ? { resource_type: "raw" } : {};
        
        cloudinary.uploader.destroy(publicId, options, (error: any, result: any) => {
          if (error) {
            console.error("❌ Cloudinary error:", error);
            return reject(error);
          }
          console.log("✅ Cloudinary result:", result);
          resolve(result);
        });
      });
      
      return NextResponse.json({ success: true, result });
    }

    // ✅ Delete by folder
    if (folder) {
      console.log("🗑️ Deleting folder:", folder);
      
      // ✅ Delete folder contents dengan appropriate resource type
      const result = await new Promise<any>((resolve, reject) => {
        const options = resourceType === "raw" ? { resource_type: "raw" } : {};
        
        cloudinary.api.delete_resources_by_prefix(folder, options, (error: any, result: any) => {
          if (error) {
            console.error("❌ Cloudinary folder error:", error);
            return reject(error);
          }
          resolve(result);
        });
      });
      
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}