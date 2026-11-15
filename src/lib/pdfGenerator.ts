import { jsPDF } from 'jspdf';
import { ClientInfo, PackageId, QuestionnaireAnswers } from '../types';
import { OFFICIAL_PACKAGES, COMPANY_INFO } from './constants';

interface PdfPayload {
  clientInfo: ClientInfo;
  selectedPackage: PackageId;
  answers: QuestionnaireAnswers;
}

export function generateDiscoveryPdf(payload: PdfPayload, referenceId: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { clientInfo, selectedPackage, answers } = payload;
  const pkg = OFFICIAL_PACKAGES[selectedPackage] || OFFICIAL_PACKAGES.pro;

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  let currentY = margin;
  let pageCount = 1;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Helper to add footer
  const addFooter = (pageNum: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      `${COMPANY_INFO.name} — ${COMPANY_INFO.tagline} (${COMPANY_INFO.directLine})`,
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // Helper to check for page break
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      addFooter(pageCount);
      doc.addPage();
      pageCount++;
      currentY = margin + 5;
    }
  };

  // 1. Top Header Banner
  doc.setFillColor(12, 14, 18); // #0C0E12
  doc.rect(margin, currentY, contentWidth, 26, 'F');

  // Gold accent bar on top
  doc.setFillColor(240, 185, 11); // #F0B90B
  doc.rect(margin, currentY, contentWidth, 2, 'F');

  // Brand title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(240, 185, 11);
  doc.text('SHURUQ ENTERPRISE | SHINE.', margin + 6, currentY + 8);

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Brand Discovery Questionnaire Summary', margin + 6, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 185, 195);
  doc.text(
    `Submitted: ${formattedDate}  •  Ref: ${referenceId}  •  Direct Line: ${COMPANY_INFO.directLine}  •  ${COMPANY_INFO.email}`,
    margin + 6,
    currentY + 22
  );

  currentY += 31;

  // 2. Client Information & Selected Package (Two-column box)
  const infoBoxHeight = 36;
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.roundedRect(margin, currentY, contentWidth, infoBoxHeight, 2, 2, 'FD');

  const colWidth = (contentWidth - 6) / 2;

  // Left column: Client Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(217, 119, 6); // Amber/Gold
  doc.text('CLIENT INFORMATION', margin + 5, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const leftLabels = [
    { label: 'Client Name:', val: clientInfo.fullName || 'Not provided' },
    { label: 'Business Name:', val: clientInfo.businessName || 'Not provided' },
    { label: 'Phone / WhatsApp:', val: clientInfo.whatsappNumber || 'Not provided' },
    { label: 'Email Address:', val: clientInfo.email || 'Not provided' },
    { label: 'Contact Method:', val: (clientInfo.preferredContactMethod || 'whatsapp').toUpperCase() },
  ];

  let leftY = currentY + 12;
  leftLabels.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, margin + 5, leftY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.val, margin + 36, leftY);
    leftY += 4.5;
  });

  // Right column: Selected Package
  const rightX = margin + colWidth + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(217, 119, 6);
  doc.text('SELECTED PACKAGE', rightX, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Package: ${pkg.name}`, rightX, currentY + 13);

  doc.setFontSize(12);
  doc.setTextColor(217, 119, 6);
  doc.text(pkg.priceETB, rightX, currentY + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Delivery Timeline: ${pkg.timeline}`, rightX, currentY + 24);

  const featuresText = `Includes: ${pkg.features.join(', ')}`;
  const splitFeatures = doc.splitTextToSize(featuresText, colWidth - 4);
  doc.text(splitFeatures, rightX, currentY + 28);

  currentY += infoBoxHeight + 7;

  // Helper to render Section Title
  const renderSectionHeader = (title: string) => {
    checkPageBreak(14);
    doc.setFillColor(12, 14, 18);
    doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(240, 185, 11);
    doc.text(title, margin + 5, currentY + 5);
    currentY += 10;
  };

  // Helper to render Question & Answer Box
  const renderQuestion = (num: string, question: string, answer: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const qText = `${num}. ${question}`;
    const splitQuestion = doc.splitTextToSize(qText, contentWidth);
    const qHeight = splitQuestion.length * 4;

    const cleanAnswer = answer && answer.trim() ? answer.trim() : 'No answer provided';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const splitAnswer = doc.splitTextToSize(cleanAnswer, contentWidth - 6);
    const aHeight = Math.max(splitAnswer.length * 3.8 + 4, 8);

    checkPageBreak(qHeight + aHeight + 4);

    // Question
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(splitQuestion, margin, currentY);
    currentY += qHeight + 1;

    // Answer Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, aHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(splitAnswer, margin + 3, currentY + 4.5);

    currentY += aHeight + 4;
  };

  // Section A
  renderSectionHeader('SECTION A: BUSINESS FOUNDATION');
  renderQuestion('01', 'What is your product? What do you do? Or what service do you provide?', answers.q1);
  renderQuestion('02', 'Why does your company exist? What are the functional, symbolic or experiential benefits?', answers.q2);
  renderQuestion('03', 'What is the full name of your business?', answers.q3);
  renderQuestion('04', 'Is there a compelling story behind your company? How did you get started?', answers.q4);
  renderQuestion('05', 'What values does your company live by?', answers.q5);

  // Section B
  renderSectionHeader('SECTION B: MARKET AND POSITIONING');
  renderQuestion('06', 'How do you differ from your competitors? What sets you apart?', answers.q6);
  renderQuestion('07', 'How old is your target audience?', answers.q7);
  renderQuestion('08', 'Where are your target audience based?', answers.q8);

  // Section C
  renderSectionHeader('SECTION C: VISUAL DIRECTION');
  renderQuestion('09', 'Do you have a specific idea in mind for your new logo?', answers.q9);
  renderQuestion('10', 'Do you want to use existing brand colours or a particular range of colours?', answers.q10);
  renderQuestion('11', 'Does your logo need a tagline?', answers.q11);
  renderQuestion('12', 'What current logos do you like and why? Provide links if you can.', answers.q12);

  // Inspiration URLs
  const urls = (answers.inspirationUrls || []).filter(u => u && u.trim());
  if (urls.length > 0) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('INSPIRATION & REFERENCE LINKS', margin, currentY);
    currentY += 4;

    const urlsText = urls.join('\n');
    const splitUrls = doc.splitTextToSize(urlsText, contentWidth - 6);
    const boxHeight = splitUrls.length * 4 + 4;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(37, 99, 235); // Blue for links
    doc.text(splitUrls, margin + 3, currentY + 4.5);
    currentY += boxHeight + 4;
  }

  // Section D
  renderSectionHeader('SECTION D: PROJECT REQUIREMENTS');
  renderQuestion('13', 'Do you require any additional supporting designs alongside your logo?', answers.q13);
  renderQuestion('14', 'Any questions or comments?', answers.q14);
  renderQuestion('15', 'And finally, what does success look like for this project?', answers.q15);

  // Final comments
  if (clientInfo.additionalComments && clientInfo.additionalComments.trim()) {
    renderSectionHeader('ADDITIONAL CLIENT COMMENTS');
    const comments = doc.splitTextToSize(clientInfo.additionalComments.trim(), contentWidth - 6);
    const cHeight = comments.length * 4 + 4;
    checkPageBreak(cHeight + 4);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, cHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(comments, margin + 3, currentY + 4.5);
    currentY += cHeight + 4;
  }

  // Add final footer on the last page
  addFooter(pageCount);

  return doc;
}

export function downloadDiscoveryPdf(payload: PdfPayload, referenceId: string): void {
  try {
    const doc = generateDiscoveryPdf(payload, referenceId);
    doc.save(`SHURUQ-Brand-Discovery-${referenceId}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
