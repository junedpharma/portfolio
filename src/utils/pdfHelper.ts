/**
 * Utility to convert base64 / Data URL PDFs into a Browser Blob URL.
 * Solves browser security blocks on direct data:application/pdf navigation
 * and provides smooth viewing and downloading experiences.
 */
export function openOrDownloadPDF(
  pdfDataUrl: string,
  fileName: string = 'Branch_Notice_Circular.pdf',
  action: 'view' | 'download' = 'view'
) {
  try {
    // If it's already a standard HTTP/HTTPS URL, open or download directly
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

    // Convert Data URL / Base64 to ArrayBuffer -> Blob
    const base64Data = pdfDataUrl.includes(',') ? pdfDataUrl.split(',')[1] : pdfDataUrl;
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    if (action === 'download') {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } else {
      // Open PDF in a new clean browser tab
      const pdfWindow = window.open(blobUrl, '_blank');
      if (!pdfWindow) {
        // Fallback to trigger download if popup blocked
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    }
  } catch (error) {
    console.error('Failed to process PDF file:', error);
    alert('Unable to open PDF. Please try downloading it.');
  }
}
