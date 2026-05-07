import { NextResponse } from "next/server";
import { uploadImageToSupabase } from "@/lib/supabase/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "portfolio");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file. Send multipart/form-data with key 'file'." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use png, jpg, jpeg, webp, or gif." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max size is 5MB." },
        { status: 400 },
      );
    }

    const uploaded = await uploadImageToSupabase({ file, folder });

    return NextResponse.json(
      {
        message: "Upload successful",
        ...uploaded,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected upload error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
