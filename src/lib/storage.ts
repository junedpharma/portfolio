import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads files to Firebase Storage when available (returning a short HTTPS download URL),
 * keeping Firestore document size small and preventing 1 MB document quota errors!
 * Falls back to base64 Data URL for small files under 800 KB if storage is unconfigured.
 */
export async function uploadFileToFirebaseStorage(file: File, folder: string = 'uploads'): Promise<string> {
  // 1. Attempt upload to Firebase Storage Bucket first
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (storageError) {
    console.warn('Firebase Storage bucket upload skipped or unconfigured, attempting base64 fallback:', storageError);
  }

  // 2. Fallback to base64 Data URL for small files (< 800 KB)
  const MAX_BASE64_BYTES = 800 * 1024; // 800 KB
  if (file.size > MAX_BASE64_BYTES) {
    throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 800 KB. Please configure Firebase Storage or upload a smaller file.`);
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
