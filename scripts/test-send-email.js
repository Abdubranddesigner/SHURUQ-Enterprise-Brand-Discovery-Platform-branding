import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { processSubmission } from '../src/lib/submissionHandler.js';

const testPayload = {
  clientInfo: {
    fullName: 'Abdurahman Seid',
    businessName: 'SHURUQ Test Verification Enterprise',
    whatsappNumber: '+251 955 303 950',
    preferredContactMethod: 'whatsapp',
    email: 'shuruqenterprise@gmail.com',
    additionalComments: 'This is an end-to-end verification test of the SHURUQ Brand Discovery submission system.'
  },
  selectedPackage: 'pro',
  answers: {
    q1: 'Executive brand design and client onboarding automation for modern businesses.',
    q2: 'To empower ideas and build the future with iconic brand identities.',
    q3: 'SHURUQ Test Verification Enterprise',
    q4: 'Founded to deliver world-class brand identity systems with seamless digital onboarding.',
    q5: 'Integrity, Modern Craftsmanship, Visual Excellence, Rapid Delivery',
    q6: 'End-to-end strategic branding with gold-standard identity systems.',
    q7: '20–45 dynamic business founders and creative visionaries.',
    q8: 'Addis Ababa, regional Ethiopia, and international diaspora.',
    q9: 'Obsidian & Gold emblem featuring geometric elegance and clean letterforms.',
    q10: 'Black (#0C0E12) and Champagne Gold (#F0B90B).',
    q11: 'Empowering Ideas. Building the Future.',
    q12: 'Clean minimalist marks like Apple and modern architectural luxury brands.',
    inspirationUrls: [
      'https://dribbble.com/tags/branding',
      'https://behance.net/search/projects?search=brand+identity'
    ],
    q13: 'Full Brand Kit, Logo Variations, Social Media Kit, Business Cards.',
    q14: 'All systems operational.',
    q15: 'Successful client launch and timeless brand recognition.'
  }
};

async function main() {
  console.log('Sending live test submission through processSubmission()...');
  const result = await processSubmission(testPayload, '127.0.0.1');
  console.log('\n--- Result ---');
  console.log('Status Code:', result.status);
  console.log('Body:       ', JSON.stringify(result.body, null, 2));

  if (result.status === 200 && result.body.success) {
    console.log('\n🎉 SUCCESS! Email delivered to Gmail SMTP and accepted!');
  } else {
    console.error('\n❌ FAILED to send email.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
