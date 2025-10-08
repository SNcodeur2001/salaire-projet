import PDFDocument from 'pdfkit';
import { Payslip, Entreprise, Payment } from '@prisma/client';

interface PdfOptions {
  payslip: Payslip & { employee: { firstName: string; lastName: string; poste: string; contract: string }; cycle: { period: string } };
  entreprise: Entreprise;
}

interface ReceiptOptions {
  payment: Payment & {
    payslip: Payslip & { employee: { firstName: string; lastName: string; poste: string }; cycle: { period: string } };
    caissier: { email: string };
  };
  entreprise: Entreprise;
}

export function generatePayslipPdf(doc: typeof PDFDocument.prototype, options: PdfOptions) {
  const { payslip, entreprise } = options;

  // Document metadata
  doc.info.Title = `Bulletin de Paie - ${payslip.employee.firstName} ${payslip.employee.lastName}`;
  doc.info.Author = entreprise.name;
  doc.info.Subject = `Bulletin de paie période ${payslip.cycle.period}`;

  const margin = 50;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const primaryColor = entreprise.color || '#1e40af'; // Modern blue
  const secondaryColor = '#f8fafc'; // Light gray background

  // Helper function for formatted currency
  const formatCurrency = (amount: number) => `${entreprise.currency} ${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;

  // Header with gradient effect
  doc.rect(0, 0, pageWidth, 120).fill(primaryColor);
  doc.rect(0, 100, pageWidth, 20).fill('#ffffff');

  // Company logo
  if (entreprise.logo) {
    try {
      doc.image(entreprise.logo, margin, 25, { width: 70, height: 70 });
    } catch (e) {
      // Fallback: company initial
      doc.fillColor('white').fontSize(36).font('Helvetica-Bold')
         .text(entreprise.name.charAt(0), margin + 20, 40);
    }
  } else {
    // Company initial as logo
    doc.fillColor('white').fontSize(36).font('Helvetica-Bold')
       .text(entreprise.name.charAt(0), margin + 20, 40);
  }

  // Company info
  doc.fillColor('white').fontSize(28).font('Helvetica-Bold')
     .text(entreprise.name, margin + 100, 30);
  if (entreprise.address) {
    doc.fontSize(12).font('Helvetica').text(entreprise.address, margin + 100, 65);
  }

  // Document title
  doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold')
     .text('BULLETIN DE PAIE', 0, 115, { align: 'center' });

  // Period badge
  doc.fillColor('#e5e7eb').roundedRect(pageWidth - 150, 25, 100, 25, 5).fill();
  doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
     .text(`Période: ${payslip.cycle.period}`, pageWidth - 140, 35);

  doc.moveDown(3);

  // Employee information card
  const cardY = doc.y;
  doc.fillColor(secondaryColor).rect(margin, cardY, pageWidth - 2 * margin, 100).fill();
  doc.strokeColor(primaryColor).lineWidth(1).rect(margin, cardY, pageWidth - 2 * margin, 100).stroke();

  doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold')
     .text('INFORMATIONS EMPLOYÉ', margin + 20, cardY + 15);

  // Employee details in two columns
  const leftColX = margin + 20;
  const rightColX = pageWidth / 2 + 20;

  doc.fillColor('black').fontSize(11).font('Helvetica-Bold');
  doc.text('Nom complet:', leftColX, cardY + 40);
  doc.text('Poste:', leftColX, cardY + 60);
  doc.text('Type de contrat:', leftColX, cardY + 80);

  doc.font('Helvetica');
  doc.text(`${payslip.employee.firstName} ${payslip.employee.lastName}`, leftColX + 80, cardY + 40);
  doc.text(payslip.employee.poste, leftColX + 80, cardY + 60);
  doc.text(payslip.employee.contract, leftColX + 80, cardY + 80);

  // Contract-specific info
  if (payslip.employee.contract === 'HONORAIRE' && payslip.hoursWorked) {
    doc.font('Helvetica-Bold').text('Heures travaillées:', rightColX, cardY + 40);
    doc.font('Helvetica').text(`${payslip.hoursWorked.toFixed(2)}h`, rightColX + 100, cardY + 40);
  } else if (payslip.employee.contract === 'JOURNALIER' && payslip.daysWorked) {
    doc.font('Helvetica-Bold').text('Jours travaillés:', rightColX, cardY + 40);
    doc.font('Helvetica').text(`${payslip.daysWorked} jours`, rightColX + 100, cardY + 40);
  }

  doc.moveDown(4);

  // Salary breakdown section
  doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold')
     .text('DÉTAIL DE LA RÉMUNÉRATION', margin, doc.y);

  doc.moveDown(1);

  // Salary table
  const tableY = doc.y;
  const tableWidth = pageWidth - 2 * margin;
  const rowHeight = 35;

  // Table header
  doc.fillColor(primaryColor).rect(margin, tableY, tableWidth, rowHeight).fill();
  doc.fillColor('white').fontSize(12).font('Helvetica-Bold')
     .text('RUBRIQUES', margin + 20, tableY + 12);
  doc.text('MONTANTS', pageWidth - 150, tableY + 12);

  // Salary rows
  const salaryData = [
    { label: 'Salaire brut', amount: payslip.grossSalary, highlight: false },
    { label: 'Charges sociales et fiscales', amount: payslip.deductions, highlight: false },
    { label: 'Salaire net à payer', amount: payslip.netSalary, highlight: true }
  ];

  let currentY = tableY + rowHeight;
  salaryData.forEach((item, index) => {
    // Alternate row colors
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.fillColor(bgColor).rect(margin, currentY, tableWidth, rowHeight).fill();
    doc.strokeColor('#e5e7eb').rect(margin, currentY, tableWidth, rowHeight).stroke();

    // Text colors
    const textColor = item.highlight ? primaryColor : 'black';
    const fontWeight = item.highlight ? 'Helvetica-Bold' : 'Helvetica';

    doc.fillColor(textColor).fontSize(12).font(fontWeight);
    doc.text(item.label, margin + 20, currentY + 12);
    doc.text(formatCurrency(item.amount), pageWidth - 150, currentY + 12);

    currentY += rowHeight;
  });

  // Status badge
  const statusY = currentY + 20;
  const statusColor = payslip.status === 'PAYE' ? '#10b981' : payslip.status === 'PARTIEL' ? '#f59e0b' : '#6b7280';
  doc.fillColor(statusColor).roundedRect(pageWidth - 120, statusY, 70, 25, 5).fill();
  doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
     .text(payslip.status, pageWidth - 110, statusY + 8);

  doc.moveDown(4);

  // Footer with professional design
  const footerY = pageHeight - 80;
  doc.fillColor(primaryColor).rect(0, footerY, pageWidth, 80).fill();

  // Footer content
  doc.fillColor('white').fontSize(14).font('Helvetica-Bold')
     .text(entreprise.name, 0, footerY + 15, { align: 'center' });

  if (entreprise.address) {
    doc.fontSize(10).font('Helvetica').text(entreprise.address, 0, footerY + 35, { align: 'center' });
  }

  doc.fontSize(9).text('Ce document est généré automatiquement par Ges-Salary', 0, footerY + 55, { align: 'center' });
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 0, footerY + 65, { align: 'center' });

  doc.end();
}

export function generatePaymentReceiptPdf(doc: typeof PDFDocument.prototype, options: ReceiptOptions) {
  const { payment, entreprise } = options;

  // Document metadata
  doc.info.Title = `Reçu de Paiement - ${payment.payslip.employee.firstName} ${payment.payslip.employee.lastName}`;
  doc.info.Author = entreprise.name;
  doc.info.Subject = `Reçu de paiement ${payment.id}`;

  const margin = 50;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const primaryColor = entreprise.color || '#1e40af';
  const successColor = '#10b981';

  // Helper function for formatted currency
  const formatCurrency = (amount: number) => `${entreprise.currency} ${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;

  // Header
  doc.fillColor(primaryColor).rect(0, 0, pageWidth, 100).fill();

  // Company logo/initial
  if (entreprise.logo) {
    try {
      doc.image(entreprise.logo, margin, 25, { width: 50, height: 50 });
    } catch (e) {
      doc.fillColor('white').fontSize(28).font('Helvetica-Bold')
         .text(entreprise.name.charAt(0), margin + 15, 35);
    }
  } else {
    doc.fillColor('white').fontSize(28).font('Helvetica-Bold')
       .text(entreprise.name.charAt(0), margin + 15, 35);
  }

  // Company info
  doc.fillColor('white').fontSize(24).font('Helvetica-Bold')
     .text(entreprise.name, margin + 80, 25);
  if (entreprise.address) {
    doc.fontSize(11).font('Helvetica').text(entreprise.address, margin + 80, 50);
  }

  // Document title
  doc.fillColor(successColor).fontSize(20).font('Helvetica-Bold')
     .text('REÇU DE PAIEMENT', 0, 110, { align: 'center' });

  doc.moveDown(2);

  // Payment confirmation badge
  const badgeY = doc.y;
  doc.fillColor(successColor).roundedRect(pageWidth/2 - 75, badgeY, 150, 30, 15).fill();
  doc.fillColor('white').fontSize(14).font('Helvetica-Bold')
     .text('✓ PAIEMENT CONFIRMÉ', 0, badgeY + 8, { align: 'center' });

  doc.moveDown(3);

  // Payment details card
  const cardY = doc.y;
  doc.fillColor('#f8fafc').rect(margin, cardY, pageWidth - 2 * margin, 200).fill();
  doc.strokeColor(primaryColor).lineWidth(2).rect(margin, cardY, pageWidth - 2 * margin, 200).stroke();

  doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold')
     .text('DÉTAILS DU PAIEMENT', margin + 20, cardY + 15);

  // Payment information
  const detailsY = cardY + 40;
  const leftColX = margin + 20;
  const rightColX = pageWidth / 2 + 20;

  doc.fillColor('black').fontSize(11).font('Helvetica-Bold');
  doc.text('Bénéficiaire:', leftColX, detailsY);
  doc.text('Période:', leftColX, detailsY + 20);
  doc.text('Montant payé:', leftColX, detailsY + 40);
  doc.text('Mode de paiement:', leftColX, detailsY + 60);
  doc.text('Date de paiement:', leftColX, detailsY + 80);
  doc.text('Caissier:', leftColX, detailsY + 100);

  doc.font('Helvetica');
  doc.text(`${payment.payslip.employee.firstName} ${payment.payslip.employee.lastName}`, leftColX + 100, detailsY);
  doc.text(payment.payslip.cycle.period, leftColX + 100, detailsY + 20);
  doc.fillColor(successColor).font('Helvetica-Bold').text(formatCurrency(payment.amount), leftColX + 100, detailsY + 40);
  doc.fillColor('black').font('Helvetica').text(payment.mode, leftColX + 100, detailsY + 60);
  doc.text(new Date(payment.paymentDate).toLocaleDateString('fr-FR'), leftColX + 100, detailsY + 80);
  doc.text(payment.caissier.email, leftColX + 100, detailsY + 100);

  // Reference number
  doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
     .text(`Référence: ${payment.id}`, rightColX, detailsY + 120);

  doc.moveDown(8);

  // Legal notice
  doc.fillColor('#6b7280').fontSize(9).font('Helvetica')
     .text('Ce reçu atteste du paiement effectué. Il constitue une preuve officielle de transaction.', margin, doc.y, {
       width: pageWidth - 2 * margin,
       align: 'center'
     });

  // Footer
  const footerY = pageHeight - 60;
  doc.fillColor(primaryColor).rect(0, footerY, pageWidth, 60).fill();

  doc.fillColor('white').fontSize(12).font('Helvetica-Bold')
     .text(entreprise.name, 0, footerY + 15, { align: 'center' });

  if (entreprise.address) {
    doc.fontSize(9).font('Helvetica').text(entreprise.address, 0, footerY + 30, { align: 'center' });
  }

  doc.fontSize(8).text('Document généré automatiquement - Ges-Salary', 0, footerY + 45, { align: 'center' });

  doc.end();
}
