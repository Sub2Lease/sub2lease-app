import { photosBucket } from "./client";
import { backendApi } from "../api/backendGO/api";

export async function uploadPostPhoto(postId: number, file: File) {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `posts/${postId}/${crypto.randomUUID()}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await photosBucket.upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  // Get the public URL
  const { data: urlData } = photosBucket.getPublicUrl(path);
  const photoUrl = urlData.publicUrl;

  // Save the URL to your Go backend
  const photo = await backendApi.addPhotoToPost({ post_id: postId, photo_url: photoUrl });

  return photo;
}