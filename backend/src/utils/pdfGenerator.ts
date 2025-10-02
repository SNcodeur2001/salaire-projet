import PDFDocument from 'pdfkit';
import { Payslip, Entreprise } from '@prisma/client';

interface PdfOptions {
  payslip: Payslip & { employee: { firstName: string; lastName: string; poste: string }; cycle: { period: string } };
  entreprise: Entreprise;
}

export function generatePayslipPdf(doc: PDFDocument, options: PdfOptions) {
  const { payslip, entreprise } = options;

  // Document metadata
  doc.info.Title = 'Bulletin de Paie';
  doc.info.Author = entreprise.name;

  const margin = 50;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const headerHeight = 100;
  const primaryColor = entreprise.color || '#4B0082'; // Use company color or default

  // Header background
  doc.rect(0, 0, pageWidth, headerHeight).fill(primaryColor);

  // Company logo if available
  if (entreprise.logo) {
    try {
      doc.image(entreprise.logo, margin, 20, { width: 60, height: 60 });
    } catch (e) {
      // Ignore if logo path invalid
    }
  }

  // Company name and address
  doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text(entreprise.name, margin + 80, 25);
  if (entreprise.address) {
    doc.fontSize(12).font('Helvetica').text(entreprise.address, margin + 80, 55);
  }
  doc.fontSize(10).text(`Période: ${payslip.cycle.period}`, margin + 80, 75);

  doc.fillColor('black').font('Helvetica');
  doc.moveDown(4);

  // Payslip title
  doc.fontSize(20).font('Helvetica-Bold').text('Ges-Salary - BULLETIN DE PAIE', { align: 'center' });
  doc.moveDown(2);

  // Employee info section
  const employeeBoxY = doc.y;
  doc.rect(margin, employeeBoxY, pageWidth - 2 * margin, 80).stroke(primaryColor);
  doc.fontSize(14).font('Helvetica-Bold').text('Informations de l\'Employé', margin + 10, employeeBoxY + 10);
  doc.fontSize(12).font('Helvetica').text(`Nom: ${payslip.employee.firstName} ${payslip.employee.lastName}`, margin + 10, employeeBoxY + 30);
  doc.text(`Poste: ${payslip.employee.poste}`, margin + 10, employeeBoxY + 50);
  doc.moveDown(5);

  // Payslip details table
  const tableStartY = doc.y;
  const tableWidth = pageWidth - 2 * margin;
  const rowHeight = 25;
  const col1Width = 200;
  const col2Width = 100;

  // Table header
  doc.rect(margin, tableStartY, tableWidth, rowHeight).stroke(primaryColor);
  doc.fillColor(primaryColor).rect(margin, tableStartY, tableWidth, rowHeight).fill();
  doc.fillColor('white').fontSize(12).font('Helvetica-Bold').text('Détails du Salaire', margin + 10, tableStartY + 8);

  // Table rows
  const rows = [
    ['Salaire Brut', `${entreprise.currency}${payslip.grossSalary.toFixed(2)}`],
    ['Déductions', `${entreprise.currency}${payslip.deductions.toFixed(2)}`],
    ['Salaire Net', `${entreprise.currency}${payslip.netSalary.toFixed(2)}`],
    ['Statut', payslip.status]
  ];

  let currentY = tableStartY + rowHeight;
  doc.fillColor('black').font('Helvetica');
  rows.forEach((row, index) => {
    doc.rect(margin, currentY, tableWidth, rowHeight).stroke(primaryColor);
    doc.fontSize(12).text(row[0], margin + 10, currentY + 8);
    doc.text(row[1], margin + col1Width + 10, currentY + 8);
    currentY += rowHeight;
  });

  doc.moveDown(4);

  // Footer
  const footerY = pageHeight - 100;
  doc.rect(0, footerY, pageWidth, 100).fill(primaryColor);
  doc.fillColor('white').fontSize(12).font('Helvetica-Bold').text(entreprise.name, { align: 'center' });
  if (entreprise.address) {
    doc.fontSize(10).font('Helvetica').text(entreprise.address, { align: 'center' });
  }
  doc.fontSize(10).text('Merci pour votre travail et votre engagement.', { align: 'center' });

  doc.end();
}
