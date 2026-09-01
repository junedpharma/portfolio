/**
 * Converts files (Images & PDFs) directly to uncompressed base64 Data URLs.
 */
export async function uploadFileToFirebaseStorage(file: File, _folder?: string): Promise<string> {
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
