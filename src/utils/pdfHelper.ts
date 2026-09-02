function triggerDownload(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}

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
    if (pdfDataUrl.startsWith('http://') || pdfDataUrl.startsWith('https://')) {
      if (action === 'download') {
        triggerDownload(pdfDataUrl, fileName);
      } else {
        window.open(pdfDataUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const mimeType = pdfDataUrl.startsWith('data:')
      ? pdfDataUrl.split(';')[0].split(':')[1] || 'application/pdf'
      : 'application/pdf';

    const base64Data = pdfDataUrl.includes(',') ? pdfDataUrl.split(',')[1] : pdfDataUrl;
    const binaryString = window.atob(base64Data);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

    const blob = new Blob([bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    if (action === 'download') {
      triggerDownload(blobUrl, fileName);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } else {
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        triggerDownload(blobUrl, fileName);
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    }
  } catch (error) {
    console.error('Failed to process notice file:', error);
    alert('Unable to open document. Please try again.');
  }
}

