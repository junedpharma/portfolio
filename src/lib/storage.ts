import { optimizeImageForUpload } from '@/utils/imageOptimizer';
import { compressPdfIfNeeded } from '@/utils/pdfCompressor';

/**
 * Uploads files (PDFs & Images) to GitHub API Media Storage via `/api/upload`.
 * Safely parses API response bodies (handling non-JSON 413 Request Entity Too Large)
 * and alerts users if a PDF exceeds Vercel's serverless function payload limit.
 */
export async function uploadFileToFirebaseStorage(file: File, folder: string = 'uploads'): Promise<string> {
  // 1. Compress PDFs larger than 3.5 MB
  let readyFile = await compressPdfIfNeeded(file, 3.5 * 1024 * 1024);

  // 2. Downscale large images (> 1.5 MB) to 1920px HD resolution
  readyFile = await optimizeImageForUpload(readyFile);

  const formData = new FormData();
  formData.append('file', readyFile);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const responseText = await response.text();

  if (!response.ok) {
    let errorMsg = 'Failed to upload file to GitHub Media Storage';
    try {
      const errorJson = JSON.parse(responseText);
      errorMsg = errorJson.error || errorMsg;
    } catch {
      if (response.status === 413 || responseText.includes('Request Entity Too Large')) {
        errorMsg = `PDF file size (${(readyFile.size / (1024 * 1024)).toFixed(2)} MB) exceeds Vercel's 4.5 MB serverless limit. Please compress the PDF under 3.5 MB before uploading.`;
      } else {
        errorMsg = responseText || errorMsg;
      }
    }
    throw new Error(errorMsg);
  }

  try {
    const data = JSON.parse(responseText);
    if (data.url) {
      return data.url;
    }
  } catch {
    throw new Error('Invalid server response format.');
  }

  throw new Error('Upload failed to return a valid URL.');
}
