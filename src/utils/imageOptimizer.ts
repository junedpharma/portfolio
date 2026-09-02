/**
 * Client-side image optimization to bypass Vercel's 4.5 MB serverless function payload limit.
 * Resizes large camera photos (e.g. 6.3 MB) to a high-definition 1920px canvas (~400 KB) before uploading.
 */
export async function optimizeImageForUpload(file: File, maxWidth: number = 1920, quality: number = 0.85): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If image is already smaller than 1.5 MB, return original file
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
              const optimizedFile = new File([blob], cleanName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
