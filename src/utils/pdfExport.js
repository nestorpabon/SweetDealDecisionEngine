// Letter to PDF export using jsPDF
// Formats a letter with proper layout: date, addresses, body, signature

import { jsPDF } from 'jspdf';

/**
 * Export a letter as a formatted PDF file and trigger download
 * @param {object} letterData - Letter object with body_text, from/to info
 * @param {string} filename - Output filename (without .pdf extension)
 */
export function exportLetterToPDF(letterData, filename = 'letter') {
  console.log('📄 Generating PDF for letter:', letterData.id || filename);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  // --- Page setup ---
  const pageWidth = 8.5;
  const margin = 1;
  const contentWidth = pageWidth - margin * 2;
  let y = 1; // Current Y position in inches

  // --- Helper to add wrapped text ---
  // Splits long text into lines that fit within the content width
  function addWrappedText(text, fontSize = 11) {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line) => {
      // Add new page if we're too close to the bottom
      if (y > 9.5) {
        doc.addPage();
        y = 1;
      }
      doc.text(line, margin, y);
      y += fontSize / 72 + 0.05; // Line height based on font size
    });
  }

  // --- From address block (top right) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (letterData.from_company) {
    doc.text(letterData.from_company, pageWidth - margin, y, { align: 'right' });
    y += 0.2;
  }
  doc.setFont('helvetica', 'normal');
  if (letterData.from_name) {
    doc.text(letterData.from_name, pageWidth - margin, y, { align: 'right' });
    y += 0.2;
  }
  if (letterData.from_address) {
    doc.text(letterData.from_address, pageWidth - margin, y, { align: 'right' });
    y += 0.2;
  }
  if (letterData.from_phone) {
    doc.text(letterData.from_phone, pageWidth - margin, y, { align: 'right' });
    y += 0.2;
  }

  y += 0.3;

  // --- Letter body ---
  // Split by newlines and render each paragraph
  const paragraphs = (letterData.body_text || '').split('\n');
  doc.setFont('helvetica', 'normal');

  paragraphs.forEach((paragraph) => {
    if (paragraph.trim() === '') {
      y += 0.15; // Blank line between paragraphs
    } else {
      addWrappedText(paragraph, 11);
    }
  });

  // --- Save and download ---
  const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}.pdf`);
  console.log('⬇️ PDF downloaded:', `${safeName}.pdf`);
}

/**
 * Export multiple letters as individual PDFs bundled in sequence
 * Each letter starts on a new page in the same PDF
 * @param {object[]} letters - Array of letter objects
 * @param {string} filename - Output filename
 */
export function exportBatchLettersPDF(letters, filename = 'batch_letters') {
  if (!letters || letters.length === 0) return;

  console.log('📄 Generating batch PDF for', letters.length, 'letters');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  const pageWidth = 8.5;
  const margin = 1;
  const contentWidth = pageWidth - margin * 2;

  letters.forEach((letter, index) => {
    // Add new page for each letter after the first
    if (index > 0) {
      doc.addPage();
    }

    let y = 1;

    // --- From address block ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    if (letter.from_company) {
      doc.text(letter.from_company, pageWidth - margin, y, { align: 'right' });
      y += 0.2;
    }
    doc.setFont('helvetica', 'normal');
    if (letter.from_name) {
      doc.text(letter.from_name, pageWidth - margin, y, { align: 'right' });
      y += 0.2;
    }
    if (letter.from_address) {
      doc.text(letter.from_address, pageWidth - margin, y, { align: 'right' });
      y += 0.2;
    }
    if (letter.from_phone) {
      doc.text(letter.from_phone, pageWidth - margin, y, { align: 'right' });
      y += 0.2;
    }

    y += 0.3;

    // --- Letter body ---
    const paragraphs = (letter.body_text || '').split('\n');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === '') {
        y += 0.15;
      } else {
        const lines = doc.splitTextToSize(paragraph, contentWidth);
        lines.forEach((line) => {
          if (y > 9.5) {
            doc.addPage();
            y = 1;
          }
          doc.text(line, margin, y);
          y += 0.18;
        });
      }
    });
  });

  const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}.pdf`);
  console.log('⬇️ Batch PDF downloaded:', `${safeName}.pdf`);
}
