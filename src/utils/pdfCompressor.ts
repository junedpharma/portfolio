import { PDFDocument } from 'pdf-lib';

/**
 * Client-side PDF Compressor with dynamic size-ratio scaling.
 * Calculates the exact ratio of target size (3.5 MB) to input file size (e.g. 5 MB vs 50 MB)
 * to apply minimal compression for small files and strong proportional compression for huge 50 MB PDFs.
 */
export async function compressPdfIfNeeded(file: File, maxSizeBytes: number = 3.5 * 1024 * 1024): Promise<File> {
  if (file.type !== 'application/pdf' || file.size <= maxSizeBytes) {
    return file;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Step 1: Attempt pdf-lib metadata & stream optimization
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    let compressedFile = new File([compressedBytes.buffer as ArrayBuffer], cleanName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });

    if (compressedFile.size <= maxSizeBytes) {
      return compressedFile;
    }

    // Step 2: Calculate dynamic compression parameters based on size ratio
    const sizeRatio = Math.max(0.01, Math.min(1.0, maxSizeBytes / file.size));
    // Scale: 0.75x for huge 50 MB files up to 1.50x for 5 MB files
    const scale = Number(Math.max(0.75, Math.min(1.50, 0.70 + sizeRatio * 0.80)).toFixed(2));
    // Quality: 0.50 for 50 MB files up to 0.82 for 5 MB files
    const quality = Number(Math.max(0.50, Math.min(0.82, 0.48 + sizeRatio * 0.35)).toFixed(2));

    if (typeof window !== 'undefined') {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const newPdfDoc = await PDFDocument.create();

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
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
        console.warn('PDF.js dynamic compression fallback:', pdfjsErr);
      }
    }

    return compressedFile;
  } catch (error) {
    console.warn('PDF compression error, using original file:', error);
    return file;
  }
}
