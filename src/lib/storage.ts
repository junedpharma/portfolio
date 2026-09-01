import { optimizeFileForFirestore } from '@/utils/fileCompressor';

/**
 * Optimizes images and PDFs for 100% free Cloud Firestore storage.
 * Ensures all uploads stay under ~500 KB to fit comfortably within
 * Cloud Firestore's 1 MB document quota without requiring a Blaze plan.
 */
export async function uploadFileToFirebaseStorage(file: File, _folder: string = 'uploads'): Promise<string> {
  return await optimizeFileForFirestore(file, 1200, 0.75);
}
