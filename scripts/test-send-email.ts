import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { processSubmission } from '../src/lib/submissionHandler';

const testPayload = {
  clientInfo: {
    fullName: 'Abdurahman Seid',
    businessName: 'SHURUQ PDF Attachment Live Test',
    whatsappNumber: '+251 955 303 950',
    preferredContactMethod: 'whatsapp' as const,
    email: 'shuruqenterprise@gmail.com',
    additionalComments: 'Verifying that the official PDF summary is attached directly to this notification email.'
  },
  selectedPackage: 'premium' as const,
  answers: {
    q1: 'Executive brand design and client onboarding platform for leading enterprises.',
    q2: 'To craft iconic visual brands that build credibility and accelerate growth.',
    q3: 'SHURUQ PDF Attachment Live Test',
    q4: 'Founded to deliver the highest standard of corporate identity and digital client discovery.',
    q5: 'Innovation, Craftsmanship, Speed, Excellence',
    q6: 'End-to-end strategic branding with gold-standard guidelines and direct deliverables.',
    q7: '25-50 years old enterprise decision-makers and founders.',
    q8: 'Addis Ababa, East Africa, and global markets.',
    q9: 'Minimalist luxury emblem with modern geometry and precision alignment.',
    q10: 'Obsidian Black (#0C0E12) and Champagne Gold (#F0B90B).',
    q11: 'Empowering Ideas. Building the Future.',
    q12: 'High-end design references from Dribbble, Behance, and minimalist architecture.',
    inspirationUrls: [
      'https://dribbble.com/tags/branding',
      'https://behance.net/search/projects?search=brand+identity'
    ],
    q13: 'Complete Brand Strategy, Brand Guidelines PDF, Stationery, Social Assets.',
    q14: 'PDF attached test execution.',
    q15: 'Flawless automated onboarding and iconic brand presence.'
  }
};

async function main() {
  console.log('Sending live test submission with PDF attachment to shuruqenterprise@gmail.com...');
  const result = await processSubmission(testPayload, '127.0.0.1');
  console.log('\n--- Result ---');
  console.log('Status Code:', result.status);
  console.log('Body:       ', JSON.stringify(result.body, null, 2));

  if (result.status === 200 && result.body.success) {
    console.log('\n🎉 SUCCESS! Email WITH attached PDF delivered to Gmail SMTP and accepted!');
  } else {
    console.error('\n❌ FAILED to send email.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
