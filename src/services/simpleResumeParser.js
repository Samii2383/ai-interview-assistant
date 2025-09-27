// Resume parser with DOCX support and PDF fallback
export const parseResume = async (file) => {
  const fileType = file.type;
  let text = '';
  let isPdfFile = false;

  try {
    if (fileType === 'application/pdf') {
      // For PDF files, we'll return a special indicator
      // and let the user know they need to fill manually
      isPdfFile = true;
      text = '';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // DOCX parsing using mammoth
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.default.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    const result = extractCandidateInfo(text);
    
    // Add a flag to indicate if this was a PDF file
    result.isPdfFile = isPdfFile;
    
    return result;
  } catch (error) {
    // If parsing fails, return empty fields for manual input
    console.warn('Resume parsing failed, using manual input:', error);
    return {
      name: '',
      email: '',
      phone: '',
      rawText: '',
      isPdfFile: fileType === 'application/pdf'
    };
  }
};

const extractCandidateInfo = (text) => {
  const info = {
    name: '',
    email: '',
    phone: '',
    rawText: text
  };

  if (!text) {
    return info;
  }

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
