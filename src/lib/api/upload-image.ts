export type UploadImageResponse = {
  message: string;
  bucket: string;
  path: string;
  publicUrl: string;
};

type UploadImageParams = {
  file: File;
  folder?: string;
};

export async function uploadImage({
  file,
  folder = "portfolio",
}: UploadImageParams): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as
    | UploadImageResponse
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in result && result.error
        ? result.error
        : "Failed to upload image",
    );
  }

  return result as UploadImageResponse;
}
