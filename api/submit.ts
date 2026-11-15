import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processSubmission } from '../src/lib/submissionHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enforce HTTP POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed. Use POST.`,
    });
  }

  // Extract client IP safely for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || '127.0.0.1';

  try {
    const result = await processSubmission(req.body, clientIp);
    return res.status(result.status).json(result.body);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API_SUBMIT_FATAL_ERROR]', err.message);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while processing your submission.',
    });
  }
}
