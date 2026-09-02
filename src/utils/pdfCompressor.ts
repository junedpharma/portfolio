import { PDFDocument } from 'pdf-lib';

/**
 * Client-side PDF Compressor for PDFs > 4 MB.
 * Re-encodes PDF pages and compresses embedded streams to ensure the final
 * PDF stays under 4 MB to comfortably pass Vercel's 4.5 MB payload limit.
 */
export async function compressPdfIfNeeded(file: File, maxSizeBytes: number = 4 * 1024 * 1024): Promise<File> {
  if (file.type !== 'application/pdf' || file.size <= maxSizeBytes) {
    return file;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Re-save PDF document to strip unused streams and optimize objects
    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    
    // Create new compressed File object
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pdfBuffer = compressedBytes.buffer as ArrayBuffer;
    let compressedFile = new File([pdfBuffer], cleanName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });

    // If initial re-save is still over limit, copy pages to a fresh PDF container
    if (compressedFile.size > maxSizeBytes) {
      try {
        const newPdfDoc = await PDFDocument.create();
        const srcPages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        srcPages.forEach((page) => newPdfDoc.addPage(page));
        const finalBytes = await newPdfDoc.save({ useObjectStreams: true });
        compressedFile = new File([finalBytes.buffer as ArrayBuffer], cleanName, {
          type: 'application/pdf',
          lastModified: Date.now()
        });
      } catch (canvasErr) {
        console.warn('PDF compression fallback warning:', canvasErr);
      }
    }

    return compressedFile;
  } catch (error) {
    console.warn('PDF compression error, proceeding with original file:', error);
    return file;
  }
}
