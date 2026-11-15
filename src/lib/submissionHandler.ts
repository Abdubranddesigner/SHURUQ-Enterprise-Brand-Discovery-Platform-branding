import { SubmissionPayload, ApiResponse, PackageId } from '../types';
import { OFFICIAL_PACKAGES } from './constants';
import { sendSubmissionEmail, sanitizeUrl } from './emailService';

// In-memory rate limiting store (IP -> array of timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// In-memory duplicate submission store (Hash -> timestamp)
const recentSubmissions = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 60 * 1000; // 60 seconds

/**
 * Checks and updates rate limits for a given IP
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out expired timestamps
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

/**
 * Checks for duplicate submissions within a short window
 */
function isDuplicateSubmission(hash: string): boolean {
  const now = Date.now();
  const lastTime = recentSubmissions.get(hash);

  if (lastTime && (now - lastTime) < DUPLICATE_WINDOW_MS) {
    return true;
  }

  recentSubmissions.set(hash, now);

  // Clean old entries
  if (recentSubmissions.size > 500) {
    for (const [k, v] of recentSubmissions.entries()) {
      if (now - v >= DUPLICATE_WINDOW_MS) {
        recentSubmissions.delete(k);
      }
    }
  }

  return false;
}

/**
 * Validates and sanitizes a submission payload
 */
export function validateAndSanitizePayload(body: unknown): {
  valid: boolean;
  errors: string[];
  sanitized?: SubmissionPayload;
} {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const raw = body as Partial<SubmissionPayload>;

  // 1. Validate Client Info
  const rawClient = raw.clientInfo;
  if (!rawClient || typeof rawClient !== 'object') {
    return { valid: false, errors: ['Missing client information.'] };
  }

  // Honeypot check
  if (rawClient.honeypot && String(rawClient.honeypot).trim().length > 0) {
    return { valid: false, errors: ['Automated submission detected.'] };
  }

  const fullName = String(rawClient.fullName || '').trim();
  if (!fullName || fullName.length < 2) {
    errors.push('Full name is required (minimum 2 characters).');
  } else if (fullName.length > 100) {
    errors.push('Full name must not exceed 100 characters.');
  }

  const businessName = String(rawClient.businessName || '').trim();
  if (!businessName || businessName.length < 2) {
    errors.push('Business name is required (minimum 2 characters).');
  } else if (businessName.length > 120) {
    errors.push('Business name must not exceed 120 characters.');
  }

  const whatsappNumber = String(rawClient.whatsappNumber || '').trim();
  const digitsOnly = whatsappNumber.replace(/[^0-9]/g, '');
  if (!whatsappNumber || digitsOnly.length < 9) {
    errors.push('Valid WhatsApp/phone number is required (at least 9 digits).');
  } else if (whatsappNumber.length > 30) {
    errors.push('WhatsApp number is too long.');
  }

  const validMethods = ['whatsapp', 'call', 'telegram'] as const;
  const preferredContactMethod = validMethods.includes(rawClient.preferredContactMethod as (typeof validMethods)[number])
    ? (rawClient.preferredContactMethod as (typeof validMethods)[number])
    : 'whatsapp';

  const email = rawClient.email ? String(rawClient.email).trim().slice(0, 100) : undefined;
  const additionalComments = rawClient.additionalComments
    ? String(rawClient.additionalComments).trim().slice(0, 2000)
    : undefined;

  // 2. Validate Selected Package
  const pkgKey = String(raw.selectedPackage || '').toLowerCase() as PackageId;
  if (!['basic', 'pro', 'premium'].includes(pkgKey)) {
    errors.push('A valid branding package must be selected (BASIC, PRO, or PREMIUM).');
  }

  // Enforce server-side official package (ignoring any client-submitted prices)
  const officialPackage = OFFICIAL_PACKAGES[pkgKey];
  if (!officialPackage) {
    errors.push('Invalid package selection.');
  }

  // 3. Validate Answers
  const rawAnswers = (raw.answers || {}) as Record<string, unknown>;
  const cleanField = (val: unknown, maxLen = 3000): string => {
    if (!val) return '';
    return String(val).trim().slice(0, maxLen);
  };

  const q1 = cleanField(rawAnswers.q1);
  const q2 = cleanField(rawAnswers.q2);
  const q3 = cleanField(rawAnswers.q3 || businessName); // Default to business name if empty
  const q4 = cleanField(rawAnswers.q4);
  const q5 = cleanField(rawAnswers.q5);
  const q6 = cleanField(rawAnswers.q6);
  const q7 = cleanField(rawAnswers.q7);
  const q8 = cleanField(rawAnswers.q8);
  const q9 = cleanField(rawAnswers.q9);
  const q10 = cleanField(rawAnswers.q10);
  const q11 = cleanField(rawAnswers.q11);
  const q12 = cleanField(rawAnswers.q12);
  const q13 = cleanField(rawAnswers.q13);
  const q14 = cleanField(rawAnswers.q14);
  const q15 = cleanField(rawAnswers.q15);

  // Require at least the core foundation answers
  if (!q1) {
    errors.push('Question 01 (What is your product / service?) is required.');
  }

  // Sanitize inspiration URLs (max 10)
  const rawUrls = Array.isArray(rawAnswers.inspirationUrls) ? rawAnswers.inspirationUrls : [];
  const sanitizedUrls: string[] = [];
  for (const item of rawUrls.slice(0, 10)) {
    if (typeof item === 'string') {
      const validUrl = sanitizeUrl(item);
      if (validUrl) sanitizedUrls.push(validUrl);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const sanitized: SubmissionPayload = {
    clientInfo: {
      fullName,
      businessName,
      whatsappNumber,
      preferredContactMethod,
      email,
      additionalComments,
    },
    selectedPackage: pkgKey,
    answers: {
      q1, q2, q3, q4, q5,
      q6, q7, q8,
      q9, q10, q11, q12,
      inspirationUrls: sanitizedUrls,
      q13, q14, q15,
    },
  };

  return { valid: true, errors: [], sanitized };
}

/**
 * Core submission handler executed by both Vercel Serverless Function and Vite local dev middleware
 */
export async function processSubmission(
  body: unknown,
  clientIp: string
): Promise<{ status: number; body: ApiResponse }> {
  // 1. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return {
      status: 429,
      body: {
        success: false,
        message: 'Too many submissions from this connection. Please wait 15 minutes before submitting again.',
      },
    };
  }

  // 2. Validate & Sanitize Input
  const { valid, errors, sanitized } = validateAndSanitizePayload(body);
  if (!valid || !sanitized) {
    return {
      status: 400,
      body: {
        success: false,
        message: errors.join(' '),
        error: errors[0],
      },
    };
  }

  // 3. Duplicate Submission Check
  const subHash = `${sanitized.clientInfo.businessName.toLowerCase()}_${sanitized.clientInfo.whatsappNumber}_${sanitized.selectedPackage}`;
  if (isDuplicateSubmission(subHash)) {
    return {
      status: 429,
      body: {
        success: false,
        message: 'A submission for this business was just received. Please do not submit duplicate inquiries.',
      },
    };
  }

  // 4. Send Email via Nodemailer & Gmail SMTP
  try {
    const result = await sendSubmissionEmail(sanitized);

    return {
      status: 200,
      body: {
        success: true,
        message: 'Your Brand Discovery questionnaire has been submitted successfully to SHURUQ Enterprise.',
        referenceId: result.referenceId,
        data: {
          referenceId: result.referenceId,
          timestamp: result.timestamp,
          businessName: sanitized.clientInfo.businessName,
          package: sanitized.selectedPackage,
        },
      },
    };
  } catch (error: unknown) {
    const err = error as Error;
    // Log internal error safely on the server side (never to client)
    console.error('[SHURUQ_EMAIL_ERROR]', {
      name: err.name,
      message: err.message,
      timestamp: new Date().toISOString(),
    });

    return {
      status: 502,
      body: {
        success: false,
        message: 'Unable to deliver submission email via SMTP at this moment. Please verify your internet connection or reach out to us directly on WhatsApp.',
        error: 'SMTP_DELIVERY_FAILURE',
      },
    };
  }
}
