import nodemailer from 'nodemailer';
import { SubmissionPayload } from '../types';
import { OFFICIAL_PACKAGES, COMPANY_INFO } from './constants';

/**
 * Escapes HTML characters in user inputs to prevent HTML/script injection
 */
export function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes URLs to ensure only http/https protocols are rendered as clickable links
 */
export function sanitizeUrl(urlStr: string): string | null {
  if (!urlStr || typeof urlStr !== 'string') return null;
  const trimmed = urlStr.trim();
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // Malformed URL
  }
  return null;
}

/**
 * Validates and retrieves required SMTP environment variables
 */
function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || 'shuruqenterprise@gmail.com';
  const rawPass = process.env.SMTP_PASS;
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : '';
  const emailTo = process.env.EMAIL_TO || 'shuruqenterprise@gmail.com';

  return { host, port, user, pass, emailTo };
}

/**
 * Singleton Nodemailer Transporter
 */
let cachedTransporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  const config = getSmtpConfig();

  if (!config.pass) {
    throw new Error('SMTP_PASS environment variable is missing. A Google App Password is required to send emails.');
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }

  return cachedTransporter;
}

/**
 * Verifies the SMTP connection and authentication
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      success: true,
      message: 'SMTP connection established and authenticated successfully with Gmail.',
    };
  } catch (error: unknown) {
    const err = error as { code?: string; response?: string; message?: string };
    let sanitizedMessage = 'Failed to connect to SMTP server.';

    if (err.code === 'EAUTH') {
      sanitizedMessage = 'SMTP Authentication failed. Verify that 2-Step Verification is active on shuruqenterprise@gmail.com and a valid 16-character Google App Password is set in SMTP_PASS.';
    } else if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKET') {
      sanitizedMessage = 'SMTP Connection timed out. Outbound port 465 may be blocked or restricted by the network or hosting environment.';
    } else if (err.code === 'ECONNECTION') {
      sanitizedMessage = 'Unable to establish connection to smtp.gmail.com:465.';
    } else if (err.message) {
      sanitizedMessage = `SMTP Verification error: ${err.message.replace(/pass=[^&\s]+/gi, 'pass=***')}`;
    }

    return {
      success: false,
      message: sanitizedMessage,
    };
  }
}

/**
 * Formats a questionnaire question row in HTML
 */
function renderQuestionRow(num: string, question: string, answer: string): string {
  const cleanAnswer = escapeHtml(answer).replace(/\n/g, '<br/>');
  return `
    <div style="margin-bottom: 20px; padding: 16px; background-color: #15171D; border-radius: 8px; border: 1px solid #232732;">
      <div style="font-size: 11px; font-weight: 700; color: #F0B90B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
        Question ${num}
      </div>
      <div style="font-size: 14px; font-weight: 600; color: #FFFFFF; margin-bottom: 10px; line-height: 1.4;">
        ${escapeHtml(question)}
      </div>
      <div style="font-size: 14px; color: #CBD5E1; line-height: 1.6; background-color: #0C0E12; padding: 12px 14px; border-radius: 6px; border: 1px solid #1E232E; word-break: break-word;">
        ${cleanAnswer || '<span style="color: #64748B; font-style: italic;">No answer provided</span>'}
      </div>
    </div>
  `;
}

/**
 * Builds the responsive HTML email template with SHURUQ visual identity
 */
export function generateEmailHtml(payload: SubmissionPayload, referenceId: string, timestamp: string): string {
  const { clientInfo, selectedPackage: pkgKey, answers } = payload;
  const pkg = OFFICIAL_PACKAGES[pkgKey] || OFFICIAL_PACKAGES.pro;

  // Filter and sanitize inspiration URLs
  const validInspirationUrls = (answers.inspirationUrls || [])
    .map(url => sanitizeUrl(url))
    .filter((url): url is string => Boolean(url));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Brand Discovery Submission - SHURUQ Enterprise</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0C0E12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C0E12; width: 100%;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; background-color: #0C0E12; margin: 0 auto;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="padding: 32px 24px 24px; text-align: center; border-bottom: 2px solid #F0B90B;">
              <div style="display: inline-block; font-size: 26px; font-weight: 800; letter-spacing: 3px; color: #F0B90B; text-transform: uppercase;">
                SHURUQ
              </div>
              <div style="display: block; font-size: 11px; font-weight: 600; letter-spacing: 4px; color: #CBD5E1; text-transform: uppercase; margin-top: 4px;">
                ENTERPRISE
              </div>
              <div style="margin-top: 16px; font-size: 18px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
                NEW BRAND DISCOVERY SUBMISSION
              </div>
              <div style="margin-top: 6px; font-size: 12px; color: #94A3B8;">
                Reference: <strong style="color: #F0B90B;">${escapeHtml(referenceId)}</strong> &bull; ${escapeHtml(timestamp)}
              </div>
            </td>
          </tr>

          <!-- CLIENT INFORMATION -->
          <tr>
            <td style="padding: 24px 20px 10px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #15171D; border-radius: 8px; border: 1px solid #232732; overflow: hidden;">
                <tr>
                  <td style="background-color: #1E232E; padding: 12px 18px; border-bottom: 1px solid #232732;">
                    <span style="font-size: 12px; font-weight: 700; color: #F0B90B; letter-spacing: 1.5px; text-transform: uppercase;">
                      CLIENT INFORMATION
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; width: 40%; font-size: 13px; color: #94A3B8;">Client Full Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #FFFFFF;">${escapeHtml(clientInfo.fullName)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94A3B8;">Business Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #F0B90B;">${escapeHtml(clientInfo.businessName)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94A3B8;">WhatsApp Number:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #FFFFFF;">
                          <a href="https://wa.me/${encodeURIComponent(clientInfo.whatsappNumber.replace(/[^0-9]/g, ''))}" style="color: #F0B90B; text-decoration: none;">
                            ${escapeHtml(clientInfo.whatsappNumber)}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94A3B8;">Preferred Contact:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #FFFFFF; text-transform: uppercase;">${escapeHtml(clientInfo.preferredContactMethod)}</td>
                      </tr>
                      ${clientInfo.email ? `
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94A3B8;">Email Address:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #FFFFFF;">${escapeHtml(clientInfo.email)}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SELECTED PACKAGE -->
          <tr>
            <td style="padding: 10px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #15171D; border-radius: 8px; border: 1px solid #F0B90B; overflow: hidden;">
                <tr>
                  <td style="background-color: #1E232E; padding: 12px 18px; border-bottom: 1px solid #232732;">
                    <span style="font-size: 12px; font-weight: 700; color: #F0B90B; letter-spacing: 1.5px; text-transform: uppercase;">
                      SELECTED PACKAGE
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">
                      ${escapeHtml(pkg.name)} PACKAGE
                    </div>
                    <div style="font-size: 24px; font-weight: 800; color: #F0B90B; margin-bottom: 8px;">
                      ${escapeHtml(pkg.priceETB)}
                    </div>
                    <div style="font-size: 13px; color: #94A3B8; margin-bottom: 12px;">
                      Estimated Delivery Timeline: <strong style="color: #FFFFFF;">${escapeHtml(pkg.timeline)}</strong>
                    </div>
                    <div style="font-size: 12px; color: #CBD5E1; line-height: 1.6; border-top: 1px solid #232732; padding-top: 10px;">
                      <strong style="color: #F0B90B;">Included Deliverables:</strong><br/>
                      ${pkg.features.map(f => `&bull; ${escapeHtml(f)}`).join('<br/>')}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SECTION A: BUSINESS FOUNDATION -->
          <tr>
            <td style="padding: 20px 20px 10px;">
              <div style="background-color: #1E232E; padding: 10px 16px; border-radius: 6px; margin-bottom: 14px; border-left: 4px solid #F0B90B;">
                <span style="font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase;">
                  SECTION A: BUSINESS FOUNDATION
                </span>
              </div>
              ${renderQuestionRow('01', 'What is your product? What do you do? Or what service do you provide?', answers.q1)}
              ${renderQuestionRow('02', 'Why does your company exist? What are the functional, symbolic or experiential benefits?', answers.q2)}
              ${renderQuestionRow('03', 'What is the full name of your business?', answers.q3)}
              ${renderQuestionRow('04', 'Is there a compelling story behind your company? How did you get started?', answers.q4)}
              ${renderQuestionRow('05', 'What values does your company live by?', answers.q5)}
            </td>
          </tr>

          <!-- SECTION B: MARKET AND POSITIONING -->
          <tr>
            <td style="padding: 10px 20px;">
              <div style="background-color: #1E232E; padding: 10px 16px; border-radius: 6px; margin-bottom: 14px; border-left: 4px solid #F0B90B;">
                <span style="font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase;">
                  SECTION B: MARKET AND POSITIONING
                </span>
              </div>
              ${renderQuestionRow('06', 'How do you differ from your competitors? What sets you apart?', answers.q6)}
              ${renderQuestionRow('07', 'How old is your target audience?', answers.q7)}
              ${renderQuestionRow('08', 'Where are your target audience based?', answers.q8)}
            </td>
          </tr>

          <!-- SECTION C: VISUAL DIRECTION -->
          <tr>
            <td style="padding: 10px 20px;">
              <div style="background-color: #1E232E; padding: 10px 16px; border-radius: 6px; margin-bottom: 14px; border-left: 4px solid #F0B90B;">
                <span style="font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase;">
                  SECTION C: VISUAL DIRECTION
                </span>
              </div>
              ${renderQuestionRow('09', 'Do you have a specific idea in mind for your new logo?', answers.q9)}
              ${renderQuestionRow('10', 'Do you want to use existing brand colours or a particular range of colours?', answers.q10)}
              ${renderQuestionRow('11', 'Does your logo need a tagline?', answers.q11)}
              ${renderQuestionRow('12', 'What current logos do you like and why? Provide links if you can. Try dribbble.com or behance.net for some inspiration.', answers.q12)}

              <!-- Inspiration URLs -->
              <div style="margin-bottom: 20px; padding: 16px; background-color: #15171D; border-radius: 8px; border: 1px solid #232732;">
                <div style="font-size: 11px; font-weight: 700; color: #F0B90B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                  Inspiration & Reference Links
                </div>
                ${validInspirationUrls.length > 0 ? `
                  <ul style="margin: 8px 0 0; padding-left: 20px; color: #CBD5E1; font-size: 14px; line-height: 1.8;">
                    ${validInspirationUrls.map(url => `
                      <li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="color: #F0B90B; text-decoration: underline; word-break: break-all;">${escapeHtml(url)}</a></li>
                    `).join('')}
                  </ul>
                ` : `
                  <div style="font-size: 14px; color: #64748B; font-style: italic; padding: 8px 0;">No inspiration links submitted.</div>
                `}
              </div>
            </td>
          </tr>

          <!-- SECTION D: PROJECT REQUIREMENTS -->
          <tr>
            <td style="padding: 10px 20px;">
              <div style="background-color: #1E232E; padding: 10px 16px; border-radius: 6px; margin-bottom: 14px; border-left: 4px solid #F0B90B;">
                <span style="font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase;">
                  SECTION D: PROJECT REQUIREMENTS
                </span>
              </div>
              ${renderQuestionRow('13', 'Do you require any additional supporting designs alongside your logo? (e.g., business cards, social media kits, packaging)', answers.q13)}
              ${renderQuestionRow('14', 'Any questions or comments?', answers.q14)}
              ${renderQuestionRow('15', 'And finally, what does success look like for this project?', answers.q15)}
            </td>
          </tr>

          <!-- ADDITIONAL INFORMATION -->
          <tr>
            <td style="padding: 10px 20px 24px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #15171D; border-radius: 8px; border: 1px solid #232732; overflow: hidden;">
                <tr>
                  <td style="background-color: #1E232E; padding: 12px 18px; border-bottom: 1px solid #232732;">
                    <span style="font-size: 12px; font-weight: 700; color: #F0B90B; letter-spacing: 1.5px; text-transform: uppercase;">
                      ADDITIONAL INFORMATION
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 13px; color: #94A3B8; margin-bottom: 6px;">
                      Submission Date & Time: <strong style="color: #FFFFFF;">${escapeHtml(timestamp)}</strong>
                    </div>
                    <div style="font-size: 13px; color: #94A3B8;">
                      Client Comments:
                      <div style="font-size: 14px; color: #CBD5E1; margin-top: 6px; line-height: 1.6;">
                        ${escapeHtml(clientInfo.additionalComments) || '<span style="color: #64748B; font-style: italic;">None provided</span>'}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 24px 20px 40px; text-align: center; border-top: 1px solid #232732;">
              <div style="font-size: 12px; font-weight: 600; color: #F0B90B; letter-spacing: 1px;">
                ${escapeHtml(COMPANY_INFO.name)}
              </div>
              <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">
                ${escapeHtml(COMPANY_INFO.tagline)} &bull; Direct Line: ${escapeHtml(COMPANY_INFO.directLine)}
              </div>
              <div style="font-size: 11px; color: #64748B; margin-top: 8px;">
                This automated notification was generated by the SHURUQ Client Discovery System.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Builds the plain-text email fallback
 */
export function generateEmailText(payload: SubmissionPayload, referenceId: string, timestamp: string): string {
  const { clientInfo, selectedPackage: pkgKey, answers } = payload;
  const pkg = OFFICIAL_PACKAGES[pkgKey] || OFFICIAL_PACKAGES.pro;

  const validInspirationUrls = (answers.inspirationUrls || [])
    .map(url => sanitizeUrl(url))
    .filter((url): url is string => Boolean(url));

  return `
================================================================================
SHURUQ ENTERPRISE - NEW BRAND DISCOVERY SUBMISSION
================================================================================
Reference ID: ${referenceId}
Submitted At: ${timestamp}

--------------------------------------------------------------------------------
CLIENT INFORMATION
--------------------------------------------------------------------------------
Client Full Name:        ${clientInfo.fullName}
Business Name:           ${clientInfo.businessName}
WhatsApp / Phone Number: ${clientInfo.whatsappNumber}
Preferred Contact:       ${clientInfo.preferredContactMethod.toUpperCase()}
Email Address:           ${clientInfo.email || 'Not provided'}
Additional Comments:     ${clientInfo.additionalComments || 'None'}

--------------------------------------------------------------------------------
SELECTED PACKAGE
--------------------------------------------------------------------------------
Package:           ${pkg.name}
Official Price:    ${pkg.priceETB}
Delivery Timeline: ${pkg.timeline}
Deliverables:
${pkg.features.map(f => `  - ${f}`).join('\n')}

--------------------------------------------------------------------------------
SECTION A: BUSINESS FOUNDATION
--------------------------------------------------------------------------------
01. What is your product? What do you do? Or what service do you provide?
${answers.q1 || 'Not answered'}

02. Why does your company exist? What are the functional, symbolic or experiential benefits?
${answers.q2 || 'Not answered'}

03. What is the full name of your business?
${answers.q3 || 'Not answered'}

04. Is there a compelling story behind your company? How did you get started?
${answers.q4 || 'Not answered'}

05. What values does your company live by?
${answers.q5 || 'Not answered'}

--------------------------------------------------------------------------------
SECTION B: MARKET AND POSITIONING
--------------------------------------------------------------------------------
06. How do you differ from your competitors? What sets you apart?
${answers.q6 || 'Not answered'}

07. How old is your target audience?
${answers.q7 || 'Not answered'}

08. Where are your target audience based?
${answers.q8 || 'Not answered'}

--------------------------------------------------------------------------------
SECTION C: VISUAL DIRECTION
--------------------------------------------------------------------------------
09. Do you have a specific idea in mind for your new logo?
${answers.q9 || 'Not answered'}

10. Do you want to use existing brand colours or a particular range of colours?
${answers.q10 || 'Not answered'}

11. Does your logo need a tagline?
${answers.q11 || 'Not answered'}

12. What current logos do you like and why? Provide links if you can.
${answers.q12 || 'Not answered'}

Inspiration URLs:
${validInspirationUrls.length > 0 ? validInspirationUrls.map(u => `  - ${u}`).join('\n') : '  None provided'}

--------------------------------------------------------------------------------
SECTION D: PROJECT REQUIREMENTS
--------------------------------------------------------------------------------
13. Do you require any additional supporting designs alongside your logo?
${answers.q13 || 'Not answered'}

14. Any questions or comments?
${answers.q14 || 'Not answered'}

15. And finally, what does success look like for this project?
${answers.q15 || 'Not answered'}

================================================================================
SHURUQ Enterprise - Empowering Ideas. Building the Future.
Direct Line: ${COMPANY_INFO.directLine} | shuruqenterprise@gmail.com
================================================================================
  `.trim();
}

/**
 * Sends the submission notification email through Gmail SMTP via Nodemailer
 */
export async function sendSubmissionEmail(payload: SubmissionPayload): Promise<{
  success: boolean;
  messageId?: string;
  referenceId: string;
  timestamp: string;
}> {
  const config = getSmtpConfig();
  const transporter = getTransporter();

  const referenceId = `SHQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Africa/Addis_Ababa',
  });

  const subject = `New Brand Discovery Submission | ${payload.clientInfo.businessName} | SHURUQ Enterprise`;
  const htmlContent = generateEmailHtml(payload, referenceId, timestamp);
  const textContent = generateEmailText(payload, referenceId, timestamp);

  const mailOptions: nodemailer.SendMailOptions = {
    from: `SHURUQ Enterprise <${config.user}>`,
    to: config.emailTo,
    replyTo: payload.clientInfo.email ? payload.clientInfo.email : config.user,
    subject,
    text: textContent,
    html: htmlContent,
    headers: {
      'X-Entity-Ref-ID': referenceId,
      'X-Application': 'SHURUQ Enterprise Brand Discovery Platform',
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // Verify SMTP response acceptance
    if (!info || !info.messageId) {
      throw new Error('SMTP server did not return a valid messageId.');
    }

    return {
      success: true,
      messageId: info.messageId,
      referenceId,
      timestamp,
    };
  } catch (error: unknown) {
    const err = error as { code?: string; responseCode?: number; message?: string };
    let cleanMessage = 'Failed to send submission email through Gmail SMTP.';

    if (err.code === 'EAUTH') {
      cleanMessage = 'Gmail SMTP Authentication failed. Please check that a valid Google App Password is set.';
    } else if (err.code === 'ETIMEDOUT') {
      cleanMessage = 'Connection to Gmail SMTP (smtp.gmail.com:465) timed out.';
    } else if (err.code === 'ECONNECTION') {
      cleanMessage = 'Could not connect to Gmail SMTP server.';
    } else if (err.responseCode === 550 || err.responseCode === 553) {
      cleanMessage = 'Gmail SMTP rejected the message recipient.';
    }

    const failure = new Error(cleanMessage);
    (failure as unknown as { originalError: unknown }).originalError = err;
    throw failure;
  }
}
