import fs from 'fs';
import path from 'path';
import { generateDiscoveryPdf } from '../src/lib/pdfGenerator';

const samplePayload = {
  clientInfo: {
    fullName: 'Abdurahman Seid',
    businessName: 'FALAKit Enterprise',
    whatsappNumber: '+251 955 303 950',
    preferredContactMethod: 'whatsapp' as const,
    email: 'shuruqenterprise@gmail.com',
    additionalComments: 'Urgent turnaround desired for launch event.'
  },
  selectedPackage: 'pro' as const,
  answers: {
    q1: 'Creative technology solutions and modern brand identities.',
    q2: 'To craft bold, memorable brand identities that inspire confidence and elevate African enterprises.',
    q3: 'FALAKit Enterprise',
    q4: 'Started in Addis Ababa with a vision to revolutionize visual identities.',
    q5: 'Precision, Excellence, Timeless Craftsmanship, Innovation',
    q6: 'Gold-standard identity systems with custom typography and rapid execution.',
    q7: '20-40 ambitious founders and modern companies.',
    q8: 'Addis Ababa & Global East African diaspora.',
    q9: 'Minimalist luxury monogram with modern geometry.',
    q10: 'Black (#0C0E12) and Champagne Gold (#F0B90B).',
    q11: 'Empowering Ideas. Building the Future.',
    q12: 'Leading international design agencies on Behance & Dribbble.',
    inspirationUrls: [
      'https://dribbble.com/shots/example-branding',
      'https://behance.net/gallery/example-identity'
    ],
    q13: 'Full Brand Kit, Logo Variations, Social Media Kit, Stationery.',
    q14: 'Looking forward to our discovery kickoff.',
    q15: 'A clean, prestigious brand recognized everywhere.'
  }
};

const doc = generateDiscoveryPdf(samplePayload, 'SHQ-2026-TESTPDF');
const pdfBytes = doc.output('arraybuffer');
const outputPath = path.resolve(process.cwd(), 'sample-client-discovery.pdf');
fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

console.log('✅ Generated sample PDF at:', outputPath);
console.log('PDF byte size:', pdfBytes.byteLength);
