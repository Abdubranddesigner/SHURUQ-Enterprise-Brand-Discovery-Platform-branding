import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER || 'shuruqenterprise@gmail.com';
const rawPass = process.env.SMTP_PASS;
const pass = rawPass ? rawPass.replace(/\s+/g, '') : '';
const emailTo = process.env.EMAIL_TO || 'shuruqenterprise@gmail.com';

console.log('================================================================');
console.log('SHURUQ ENTERPRISE - GMAIL SMTP VERIFICATION TEST');
console.log('================================================================');
console.log(`Host:      ${host}`);
console.log(`Port:      ${port} (Secure: ${port === 465})`);
console.log(`User:      ${user}`);
console.log(`Recipient: ${emailTo}`);
console.log(`Password:  ${pass ? '***Configured (' + pass.length + ' chars)***' : 'NOT CONFIGURED (Empty)'}`);
console.log('----------------------------------------------------------------');

if (!pass) {
  console.error('\n❌ ERROR: SMTP_PASS is missing or empty.');
  console.error('Please configure your 16-character Google App Password in .env.local or Vercel environment variables.');
  console.error('Visit https://myaccount.google.com/apppasswords to generate one for shuruqenterprise@gmail.com.\n');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: { user, pass },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

async function runTest() {
  console.log('Verifying SMTP connection and authentication with smtp.gmail.com:465...');
  try {
    const verified = await transporter.verify();
    console.log('✅ Connection verification SUCCESSFUL:', verified);
    console.log('Your Gmail SMTP configuration is 100% verified and ready for production!');
  } catch (error) {
    console.error('❌ Connection verification FAILED.');
    console.error('Code:    ', error.code);
    console.error('Message: ', error.message?.replace(/pass=[^&\s]+/gi, 'pass=***'));
    if (error.code === 'EAUTH') {
      console.error('\nTip: 535-5.7.8 Username and Password not accepted.');
      console.error('Ensure Google 2-Step Verification is enabled and use a 16-character App Password, NOT your regular Google password.');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      console.error('\nTip: Outbound connection timed out. Check firewall or network policies on port 465.');
    }
    process.exit(1);
  }
}

runTest();
