import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export type ExportFormat = 'png' | 'jpeg' | 'pdf';
export type AspectRatioType = 'story' | 'portrait' | 'square' | 'landscape';

export interface ExportOptions {
  element: HTMLElement;
  format: ExportFormat;
  aspectRatio: AspectRatioType;
  scale?: number; // 1, 2, or 3
  filename?: string;
  quality?: number; // 0.1 to 1.0 for jpeg
}

/**
 * Capture an invitation HTML element and export it as high-resolution PNG, JPEG, or PDF
 */
export async function exportInvitation({
  element,
  format,
  scale = 2,
  filename = 'prof-rashidah-inaugural-invitation',
  quality = 0.95
}: ExportOptions): Promise<string> {
  // Wait for fonts to be ready
  if (document.fonts) {
    await document.fonts.ready;
  }

  // High resolution canvas capture
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      // Ensure all elements in the cloned document are visible and sharp
      const target = clonedDoc.querySelector('[data-invitation-card]') as HTMLElement;
      if (target) {
        target.style.transform = 'none';
        target.style.boxShadow = 'none';
      }
    }
  });

  const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  if (format === 'pdf') {
    // Generate PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfOrientation = canvas.width > canvas.height ? 'landscape' : 'portrait';
    
    // Standard A5 or 5x7 ratio in mm
    const pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: 'a5'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Maintain aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const x = (pdfWidth - renderWidth) / 2;
    const y = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
    pdf.save(`${cleanFilename}.pdf`);
    return imgData;
  } else if (format === 'jpeg') {
    const imgData = canvas.toDataURL('image/jpeg', quality);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${cleanFilename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return imgData;
  } else {
    // Default PNG
    const imgData = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${cleanFilename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return imgData;
  }
}
