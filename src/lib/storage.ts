import { compressAndResizeImage } from '@/utils/imageCompressor';

/**
 * Converts files (Images & PDFs) to optimized Data URLs (base64).
 * Image uploads are automatically compressed on the client side
 * to prevent QuotaExceededError and optimize database storage!
 */
export async function uploadFileToFirebaseStorage(file: File, _folder?: string): Promise<string> {
  if (file.type.startsWith('image/')) {
    return await compressAndResizeImage(file, 1200, 0.8);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
