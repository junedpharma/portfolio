import { optimizeImageForUpload } from '@/utils/imageOptimizer';
import { compressPdfIfNeeded } from '@/utils/pdfCompressor';

/**
 * Uploads files (PDFs & Images) to GitHub API Media Storage via `/api/upload`.
 * Automatically compresses PDFs > 4 MB and downscales large camera photos (> 1.5 MB)
 * on the client side to guarantee all uploads pass Vercel's 4.5 MB payload limit cleanly!
 */
export async function uploadFileToFirebaseStorage(file: File, folder: string = 'uploads'): Promise<string> {
  // 1. Compress PDFs larger than 4 MB
  let readyFile = await compressPdfIfNeeded(file, 4 * 1024 * 1024);

  // 2. Downscale large images (> 1.5 MB) to 1920px HD resolution
  readyFile = await optimizeImageForUpload(readyFile);

  const formData = new FormData();
  formData.append('file', readyFile);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload file to GitHub Media Storage');
  }

  const data = await response.json();
  if (data.url) {
    return data.url;
  }

  throw new Error('Upload failed to return a valid URL.');
}
