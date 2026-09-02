/**
 * Uploads files (PDFs & Images) to GitHub API Media Storage via `/api/upload`.
 * Returns a short HTTPS CDN URL (e.g. https://raw.githubusercontent.com/junedpharma/portfolio/main/public/uploads/...)
 * 100% FREE FOREVER with 0 credit cards, 0 billing setup, and 0 Firestore document quota errors!
 */
export async function uploadFileToFirebaseStorage(file: File, folder: string = 'uploads'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
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
