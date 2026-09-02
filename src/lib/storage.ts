import { optimizeImageForUpload } from '@/utils/imageOptimizer';

/**
 * Uploads files to GitHub API Media Storage via `/api/upload`.
 * Enforces a strict 4.2 MB limit on PDFs and alerts if exceeded.
 */
export async function uploadFileToFirebaseStorage(file: File, folder: string = 'uploads'): Promise<string> {
  // Check PDF file size limit (max 4.2 MB)
  if (file.type === 'application/pdf' && file.size > 4.2 * 1024 * 1024) {
    throw new Error(`PDF file size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 4.2 MB limit. Please compress your PDF file before uploading.`);
  }

  // Downscale large camera photos (> 1.5 MB)
  const readyFile = await optimizeImageForUpload(file);

  const formData = new FormData();
  formData.append('file', readyFile);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const responseText = await response.text();

  if (!response.ok) {
    let errorMsg = 'Upload failed';
    try {
      errorMsg = JSON.parse(responseText).error || errorMsg;
    } catch {
      errorMsg = response.status === 413 || responseText.includes('Request Entity Too Large')
        ? `File size (${(readyFile.size / (1024 * 1024)).toFixed(2)} MB) exceeds 4.2 MB limit. Please select a smaller file.`
        : responseText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  try {
    const data = JSON.parse(responseText);
    if (data.url) return data.url;
  } catch {
    throw new Error('Invalid server response format.');
  }

  throw new Error('Upload failed to return a valid URL.');
}
