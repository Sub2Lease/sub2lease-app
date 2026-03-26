import imageCompression from 'browser-image-compression';

export async function processAndCompressImages(fileList: FileList | null): Promise<PromiseSettledResult<File>[]> {
  if (!fileList || !fileList.length) return [];

  const options = {
    maxSizeMB: 0.5,           // Target size under 500kb
    maxWidthOrHeight: 1600, // Resize to max 1600px dimension
    useWebWorker: true,     // Offload to background thread
    fileType: 'image/webp',  // Use webp for smaller files
    initialQuality: 0.8, 
  };

  const files = Array.from(fileList);
  
  // Process all images in parallel for speed
  const compressionPromises = files.map(async (file) => {
    try {
      return imageCompression(file, options);
    } catch (err) {
      console.error("Compression failed for:", file.name, err);
      throw err; // Fallback to original if compression fails
    }
  });

  return Promise.allSettled(compressionPromises);
}