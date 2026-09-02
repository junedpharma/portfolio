import { PDFDocument } from 'pdf-lib';

/**
 * Client-side PDF Image Compressor for heavy scanned PDFs (> 3.5 MB).
 * Scanned PDFs (e.g. 9.64 MB) contain uncompressed 300 DPI page images.
 * Uses canvas page rendering & pdf-lib re-encoding to compress page images down
 * to ~1.5 MB – 2.5 MB while maintaining high resolution and readability.
 */
export async function compressPdfIfNeeded(file: File, maxSizeBytes: number = 3.5 * 1024 * 1024): Promise<File> {
  if (file.type !== 'application/pdf' || file.size <= maxSizeBytes) {
    return file;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Step 1: Attempt pdf-lib stream & object structure optimization
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    let compressedFile = new File([compressedBytes.buffer as ArrayBuffer], cleanName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });

    if (compressedFile.size <= maxSizeBytes) {
      return compressedFile;
    }

    // Step 2: For heavy scanned PDFs (> 3.5 MB), use canvas page rasterization via PDF.js
    if (typeof window !== 'undefined') {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Set worker src to CDN for client side
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const newPdfDoc = await PDFDocument.create();

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // High-definition ~1500px resolution

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.72);
            const jpegImageBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());

            const embeddedImage = await newPdfDoc.embedJpg(jpegImageBytes);
            const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
            newPage.drawImage(embeddedImage, {
              x: 0,
              y: 0,
              width: viewport.width,
              height: viewport.height
            });
          }
        }

        const rasterizedBytes = await newPdfDoc.save({ useObjectStreams: true });
        const rasterizedFile = new File([rasterizedBytes.buffer as ArrayBuffer], cleanName, {
          type: 'application/pdf',
          lastModified: Date.now()
        });

        if (rasterizedFile.size < compressedFile.size) {
          compressedFile = rasterizedFile;
        }
      } catch (pdfjsErr) {
        console.warn('PDF.js page image compression fallback:', pdfjsErr);
      }
    }

    return compressedFile;
  } catch (error) {
    console.warn('PDF compression error, using original file:', error);
    return file;
  }
}
