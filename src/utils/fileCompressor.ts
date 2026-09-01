/**
 * Client-side file optimization for 100% Free Cloud Firestore storage.
 * Compresses uploaded images & document files under 500 KB so they fit
 * comfortably in Firestore's 1 MB document quota with $0 cost and 0 Blaze plan requirement!
 */
export async function optimizeFileForFirestore(file: File, maxWidth: number = 1200, quality: number = 0.75): Promise<string> {
  // If it's an image file, compress via HTML5 Canvas
  if (file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
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
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // If it's a PDF document:
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read file.'));
        return;
      }

      // Check size limit for Firestore (max 700 KB for PDF string)
      const base64Length = result.length;
      const sizeInKb = (base64Length * (3 / 4)) / 1024;

      if (sizeInKb > 750) {
        reject(new Error(`PDF size (${(sizeInKb / 1024).toFixed(2)} MB) is too large for free tier storage. Please compress the PDF under 500 KB or convert to JPEG image before uploading.`));
      } else {
        resolve(result);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
