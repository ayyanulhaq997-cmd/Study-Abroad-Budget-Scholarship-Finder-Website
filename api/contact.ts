/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { IncomingMessage, ServerResponse } from 'http';

interface ContactApiRequest extends IncomingMessage {
  body?: any;
  method?: string;
  socket: any;
}

interface ContactApiResponse extends ServerResponse {
  status: (statusCode: number) => ContactApiResponse;
  json: (data: any) => ContactApiResponse;
}

// Allowed topic categories matching frontend select options
const ALLOWED_CATEGORIES = new Set([
  'Report an Outdated/Unverified Scholarship',
  'Suggest a Verified Scholarship Scheme',
  'Update Country/Visa Requirement Data',
  'General Calculator Feedback',
  'Other',
]);

// Field length boundaries (Server-side defense-in-depth)
const LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MIN: 5,
  EMAIL_MAX: 254,
  SUBJECT_MAX: 150,
  CATEGORY_MAX: 100,
  MESSAGE_MIN: 15,
  MESSAGE_MAX: 3000,
  MAX_PAYLOAD_BYTES: 15 * 1024, // 15 KB
};

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// ==============================================================================
// Server-Side Rate Limiter (Sliding Window per Client IP)
// Protects Vercel serverless execution from automated submission bursts
// ==============================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per 10 minutes per IP
const ipRateLimitStore = new Map<string, RateLimitRecord>();

function isRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Prune expired records periodically to prevent unbounded memory growth
  if (ipRateLimitStore.size > 1000) {
    for (const [key, record] of ipRateLimitStore.entries()) {
      if (now > record.resetAt) {
        ipRateLimitStore.delete(key);
      }
    }
  }

  const existing = ipRateLimitStore.get(ip);
  if (!existing || now > existing.resetAt) {
    ipRateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { limited: true, retryAfterSeconds };
  }

  existing.count += 1;
  return { limited: false, retryAfterSeconds: 0 };
}

function extractClientIp(req: ContactApiRequest): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string' && xForwardedFor.trim().length > 0) {
    // Return first IP before comma
    const firstIp = xForwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const xRealIp = req.headers['x-real-ip'];
  if (typeof xRealIp === 'string' && xRealIp.trim().length > 0) {
    return xRealIp.trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Serverless contact form endpoint for GlobalEdu.
 *
 * Security & Reliability Features:
 * 1. Strict HTTP POST enforcement
 * 2. Payload size bounds & safe JSON parsing
 * 3. Client IP rate limiting (5 req / 10 min window)
 * 4. Honeypot automated bot trap
 * 5. Server-side minimum & maximum lengths for name, email, subject, category, message
 * 6. Production-valid Resend dispatch configuration with explicit delivery status reporting
 * 7. Zero secret exposure in responses or logs
 */
export default async function handler(req: ContactApiRequest, res: ContactApiResponse) {
  // 1. Enforce HTTP POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Only POST submissions are accepted.',
    });
  }

  // 2. Client IP Rate Limiting
  const clientIp = extractClientIp(req);
  const { limited, retryAfterSeconds } = isRateLimited(clientIp);
  if (limited) {
    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      success: false,
      error: `Too many submissions from this connection. Please wait ${retryAfterSeconds} seconds before sending another message, or email us directly.`,
    });
  }

  // 3. Safe Request Body Parsing
  let payload: any = req.body;
  if (typeof payload === 'string') {
    if (payload.length > LIMITS.MAX_PAYLOAD_BYTES) {
      return res.status(413).json({
        success: false,
        error: 'Payload size exceeds the 15 KB limit.',
      });
    }
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Malformed JSON payload. Please ensure request body is valid JSON.',
      });
    }
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request body format.',
    });
  }

  const { name, email, category, subject, message, hp_website } = payload;

  // 4. Spam detection: hidden honeypot field
  if (hp_website && (typeof hp_website !== 'string' || hp_website.trim().length > 0)) {
    return res.status(400).json({
      success: false,
      error: 'Automated spam submission detected.',
    });
  }

  // 5. Server-side field validation & maximum lengths
  // Name
  if (!name || typeof name !== 'string' || name.trim().length < LIMITS.NAME_MIN) {
    return res.status(400).json({
      success: false,
      error: `Name is required (minimum ${LIMITS.NAME_MIN} characters).`,
    });
  }
  if (name.trim().length > LIMITS.NAME_MAX) {
    return res.status(400).json({
      success: false,
      error: `Name must not exceed ${LIMITS.NAME_MAX} characters.`,
    });
  }

  // Email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Email address is required.',
    });
  }
  const cleanEmail = email.trim();
  if (cleanEmail.length < LIMITS.EMAIL_MIN || cleanEmail.length > LIMITS.EMAIL_MAX || !EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: `Please provide a valid email address (maximum ${LIMITS.EMAIL_MAX} characters).`,
    });
  }

  // Category
  const cleanCategory = typeof category === 'string' ? category.trim() : 'Other';
  if (cleanCategory.length > LIMITS.CATEGORY_MAX || !ALLOWED_CATEGORIES.has(cleanCategory)) {
    return res.status(400).json({
      success: false,
      error: 'Please select a valid topic category from the list.',
    });
  }

  // Subject (optional)
  const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
  if (cleanSubject.length > LIMITS.SUBJECT_MAX) {
    return res.status(400).json({
      success: false,
      error: `Subject line must not exceed ${LIMITS.SUBJECT_MAX} characters.`,
    });
  }

  // Message
  if (!message || typeof message !== 'string' || message.trim().length < LIMITS.MESSAGE_MIN) {
    return res.status(400).json({
      success: false,
      error: `Message details must be at least ${LIMITS.MESSAGE_MIN} characters long.`,
    });
  }
  if (message.trim().length > LIMITS.MESSAGE_MAX) {
    return res.status(400).json({
      success: false,
      error: `Message details must not exceed ${LIMITS.MESSAGE_MAX} characters.`,
    });
  }

  // Destination configuration
  const recipientEmail =
    process.env.NOTIFICATION_EMAIL ||
    process.env.VITE_CONTACT_EMAIL ||
    'muhammadsaleem.76588@gmail.com';

  const resendApiKey = process.env.RESEND_API_KEY;
  const forwardWebhook = process.env.CONTACT_FORWARD_URL;

  // 6. Resend Email Dispatch (if configured)
  if (resendApiKey) {
    // In production, users should configure RESEND_FROM_EMAIL with their verified custom domain.
    // For initial sandbox testing, fallback to onboarding@resend.dev (restricted to account owner).
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'GlobalEdu Contact <onboarding@resend.dev>';

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipientEmail],
          reply_to: cleanEmail,
          subject: `[GlobalEdu] ${cleanCategory}: ${cleanSubject || 'New Verification Submission'}`,
          text: `From: ${name.trim()} (${cleanEmail})\nTopic: ${cleanCategory}\nSubject: ${cleanSubject || 'N/A'}\n\nMessage Details:\n${message.trim()}`,
        }),
      });

      let resendData: any = {};
      try {
        resendData = await response.json();
      } catch {
        // Non-JSON
      }

      if (response.ok && resendData && resendData.id) {
        // Do NOT claim "delivered to mailbox" — accurately report acceptance into dispatch queue
        return res.status(200).json({
          success: true,
          message: 'Submission received and accepted into the editorial dispatch queue.',
          dispatchId: resendData.id,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Log sanitized error status without exposing API key
        console.error('Resend delivery provider rejected submission:', response.status);
        const providerError =
          (resendData && typeof resendData.message === 'string' && resendData.message) ||
          'Email dispatch provider rejected the message. Please contact editorial email directly.';
        return res.status(502).json({
          success: false,
          error: providerError,
        });
      }
    } catch (dispatchError) {
      console.error('Email dispatch network error');
      return res.status(500).json({
        success: false,
        error: 'Failed to reach dispatch service. Please use direct email.',
      });
    }
  }

  // 7. Webhook Forwarding (if configured)
  if (forwardWebhook) {
    try {
      const fwdResponse = await fetch(forwardWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          category: cleanCategory,
          subject: cleanSubject,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (fwdResponse.ok) {
        return res.status(200).json({
          success: true,
          message: 'Submission received and forwarded to editorial review.',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (fwdError) {
      console.error('Webhook forward failure');
    }
  }

  // 8. Unconfigured Service State
  // Accurately reports that automated backend dispatch is not yet configured on this deployment.
  return res.status(503).json({
    success: false,
    error:
      'Contact submission service is not currently connected to an active email provider (e.g. RESEND_API_KEY or VITE_CONTACT_FORM_ENDPOINT). Please contact the editorial team directly at ' +
      recipientEmail,
    recipientEmail,
  });
}
