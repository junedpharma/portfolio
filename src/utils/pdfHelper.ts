function triggerDownload(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Utility to open PDFs & circulars directly inline in a browser tab.
 * Bypasses GitHub raw Content-Disposition headers by fetching arrayBuffer -> Blob URL.
 */
export async function openOrDownloadPDF(
  pdfDataUrl: string,
  fileName: string = 'Branch_Notice_Circular.pdf',
  action: 'view' | 'download' = 'view'
) {
  try {
    // If HTTP/HTTPS URL (e.g. raw.githubusercontent.com)
    if (pdfDataUrl.startsWith('http://') || pdfDataUrl.startsWith('https://')) {
      if (action === 'download') {
        triggerDownload(pdfDataUrl, fileName);
        return;
      }

      // Fetch bytes directly to display inline in browser PDF viewer
      try {
        const response = await fetch(pdfDataUrl);
        const arrayBuffer = await response.arrayBuffer();
        const isPdf = pdfDataUrl.toLowerCase().endsWith('.pdf') || pdfDataUrl.includes('pdf');
        const mimeType = isPdf ? 'application/pdf' : 'image/jpeg';
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const win = window.open(blobUrl, '_blank');
        if (!win) {
          triggerDownload(pdfDataUrl, fileName);
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
        return;
      } catch (fetchErr) {
        console.warn('Direct fetch failed, falling back to window.open:', fetchErr);
        window.open(pdfDataUrl, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    // Base64 Data URL processing
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
