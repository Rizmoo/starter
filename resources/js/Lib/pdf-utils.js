import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export table data to PDF with optional company header.
 * 
 * @param {string} tableName - The name of the table/report
 * @param {string[]} headers - Column headers
 * @param {string[][]} rows - Table data rows
 * @param {Object} companyDetails - Optional company information
 * @param {string} companyDetails.name - Company name
 * @param {string} [companyDetails.address] - Company address
 * @param {string} [companyDetails.phone] - Company phone
 * @param {string} [companyDetails.email] - Company email
 * @param {string} [companyDetails.logo] - Company logo URL
 */
export async function exportTableToPDF(
  tableName,
  headers,
  rows,
  companyDetails
) {
  const doc = new jsPDF({ orientation: 'landscape' });
  let startY = 15;

  // Company header
  if (companyDetails?.name) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(companyDetails.name, 14, startY);
    startY += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (companyDetails.address) { doc.text(companyDetails.address, 14, startY); startY += 5; }
    if (companyDetails.phone) { doc.text(`Phone: ${companyDetails.phone}`, 14, startY); startY += 5; }
    if (companyDetails.email) { doc.text(`Email: ${companyDetails.email}`, 14, startY); startY += 5; }
    startY += 4;
  }

  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 14, startY);
  startY += 2;

  // Date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, startY + 5);
  startY += 8;

  // Table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY,
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [34, 34, 34], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const safeTableName = tableName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const formattedDate = new Date().toISOString().split('T')[0];
  doc.save(`${safeTableName}_${formattedDate}.pdf`);
}
