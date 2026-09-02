/**
 * Downscales large camera photos (> 1.5 MB) to 1920px HD resolution (~400 KB) before uploading.
 */
export async function optimizeImageForUpload(file: File, maxWidth: number = 1920, quality: number = 0.85): Promise<File> {
  if (!file.type.startsWith('image/') || file.size <= 1.5 * 1024 * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = img.width > maxWidth ? maxWidth : img.width;
      const height = img.width > maxWidth ? Math.round((img.height * maxWidth) / img.width) : img.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name.replace(/[^a-zA-Z0-9.-]/g, '_'), { type: 'image/jpeg' }) : file),
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}
