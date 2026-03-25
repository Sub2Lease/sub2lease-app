import imageCompression from 'browser-image-compression';

export async function processAndCompressImages(fileList: FileList | null): Promise<PromiseSettledResult<File>[]> {
  if (!fileList || !fileList.length) return [];

  const options = {
    maxSizeMB: 1,           // Target size under 1MB
    maxWidthOrHeight: 1920, // Max resolution (1080p equivalent)
    useWebWorker: true,     // Offload to background thread
    fileType: 'image/jpeg'  // Standardize format
  };

  const files = Array.from(fileList);
  
  // Process all images in parallel for speed
  const compressionPromises = files.map(async (file) => {
    try {
      return imageCompression(file, options);
    } catch (err) {
      console.error("Compression failed for:", file.name, err);
      return file; // Fallback to original if compression fails
    }
  });

  return Promise.allSettled(compressionPromises);
}