/**
 * Utility to convert base64 / Data URL PDFs or circular images into a Browser Blob URL.
 * Solves browser security blocks on direct data URL navigation and provides smooth viewing.
 */
export function openOrDownloadPDF(
  pdfDataUrl: string,
  fileName: string = 'Branch_Notice_Circular.pdf',
  action: 'view' | 'download' = 'view'
) {
  try {
    // If it's a standard HTTP/HTTPS URL, open or download directly
    if (pdfDataUrl.startsWith('http://') || pdfDataUrl.startsWith('https://')) {
      if (action === 'download') {
        const link = document.createElement('a');
        link.href = pdfDataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        window.open(pdfDataUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Determine MIME type from Data URL
    let mimeType = 'application/pdf';
    if (pdfDataUrl.startsWith('data:')) {
      const parts = pdfDataUrl.split(';')[0];
      mimeType = parts.split(':')[1] || 'application/pdf';
    }

    // Convert Data URL / Base64 to Uint8Array -> Blob
    const base64Data = pdfDataUrl.includes(',') ? pdfDataUrl.split(',')[1] : pdfDataUrl;
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    if (action === 'download') {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } else {
      // Open in a new clean browser tab
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    }
  } catch (error) {
    console.error('Failed to process notice file:', error);
    alert('Unable to open document. Please try again.');
  }
}
