import { randomUUID } from "crypto";
import { supabaseServer, supabaseStorageBucket } from "@/lib/supabase/server";

type UploadOptions = {
  file: File;
  folder?: string;
  upsert?: boolean;
};

export async function uploadImageToSupabase({
  file,
  folder = "portfolio",
  upsert = false,
}: UploadOptions) {
  const ext = file.name.split(".").pop() ?? "bin";
  const safeFolder = folder.replace(/^\/+|\/+$/g, "");
  const path = `${safeFolder}/${Date.now()}-${randomUUID()}.${ext}`;

  const { error } = await supabaseServer.storage
    .from(supabaseStorageBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseServer.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(path);

  return {
    bucket: supabaseStorageBucket,
    path,
    publicUrl: data.publicUrl,
  };
}
