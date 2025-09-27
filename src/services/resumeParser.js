import pdfjsLib from './pdfWorker';
import mammoth from 'mammoth';

export const parseResume = async (file) => {
  const fileType = file.type;
  let text = '';

  try {
    if (fileType === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        text = fullText;
      } catch (pdfError) {
        console.warn('PDF parsing failed, using fallback:', pdfError);
        // Fallback: return empty text and let user fill manually
        text = '';
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    return extractCandidateInfo(text);
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

const extractCandidateInfo = (text) => {
  const info = {
    name: '',
    email: '',
    phone: '',
    rawText: text
  };

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Extract phone number
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    info.phone = phoneMatch[0];
  }

  // Extract name (look for common patterns)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const firstLine = lines[0]?.trim();
  
  // Simple name extraction - first line that doesn't contain email or phone
  if (firstLine && !firstLine.includes('@') && !firstLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
    info.name = firstLine;
  }

  return info;
};
