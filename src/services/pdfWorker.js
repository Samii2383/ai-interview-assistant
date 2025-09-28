// PDF.js worker configuration for browser environment
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source to use a local worker or CDN
if (process.env.NODE_ENV === 'development') {
  // For development, use CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} else {
  // For production, you might want to use a local worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default pdfjsLib;




