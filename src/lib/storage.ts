import { optimizeImageForUpload } from '@/utils/imageOptimizer';

/**
 * Uploads files (PDFs & Images) to GitHub API Media Storage via `/api/upload`.
 * Optimizes large camera photos (> 1.5 MB) on client side to prevent Vercel 4.5 MB payload errors.
 */
export async function uploadFileToFirebaseStorage(file: File, folder: string = 'uploads'): Promise<string> {
  // Check PDF size limit for Vercel serverless function payload (4.5 MB)
  if (file.type === 'application/pdf' && file.size > 4.2 * 1024 * 1024) {
    throw new Error(`PDF file size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds Vercel's 4.5 MB limit. Please compress the PDF file before uploading.`);
  }

  // Optimize large images to high-definition 1920px canvas (~400 KB)
  const readyFile = await optimizeImageForUpload(file);

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
