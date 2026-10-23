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
// Shared Rate Limiter (Upstash Redis with In-Memory Fallback)
// Multi-instance distributed protection for Vercel serverless environments
// ==============================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_SECONDS = 600; // 10 minutes
const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_SECONDS * 1000;
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per 10 minutes per IP
const localMemoryRateLimitStore = new Map<string, RateLimitRecord>();

interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
  source: 'upstash' | 'in-memory-fallback' | 'in-memory-default';
  isDegraded?: boolean;
}

/**
 * Checks rate limit using Upstash Redis if configured; otherwise safely uses
 * the in-memory sliding-window limiter.
 */
async function checkRateLimit(clientIp: string): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. If Upstash Redis is configured, execute distributed atomic pipeline
  if (upstashUrl && upstashToken) {
    try {
      const sanitizedIp = clientIp.replace(/[^a-zA-Z0-9_.:-]/g, '');
      const key = `ratelimit:contact:${sanitizedIp}`;

      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, RATE_LIMIT_WINDOW_SECONDS, 'NX'],
          ['TTL', key],
        ]),
        signal: AbortSignal.timeout(3500),
      });

      if (response.ok) {
        const results = await response.json();
        // results is an array of command returns: [{ result: count }, { result: 1 }, { result: ttl }]
        const count = typeof results?.[0]?.result === 'number' ? results[0].result : 1;
        const ttl = typeof results?.[2]?.result === 'number' && results[2].result > 0
          ? results[2].result
          : RATE_LIMIT_WINDOW_SECONDS;

        if (count > MAX_REQUESTS_PER_WINDOW) {
          return {
            limited: true,
            retryAfterSeconds: ttl,
            source: 'upstash',
          };
        }

        return {
          limited: false,
          retryAfterSeconds: 0,
          source: 'upstash',
        };
      } else {
        console.warn('Upstash rate limit service returned non-OK status:', response.status);
      }
    } catch (upstashErr) {
      console.warn('Upstash rate limit service unavailable, falling back to local limiter');
      // Fall through to in-memory fallback with degraded flag
      const fallback = checkLocalMemoryRateLimit(clientIp);
      return {
        ...fallback,
        source: 'in-memory-fallback',
        isDegraded: true,
      };
    }
  }

  // 2. Default In-Memory Limiter when Upstash is not configured
  return checkLocalMemoryRateLimit(clientIp);
}

function checkLocalMemoryRateLimit(clientIp: string): RateLimitResult {
  const now = Date.now();

  // Prune expired records periodically
  if (localMemoryRateLimitStore.size > 1000) {
    for (const [key, record] of localMemoryRateLimitStore.entries()) {
      if (now > record.resetAt) {
        localMemoryRateLimitStore.delete(key);
      }
    }
  }

  const existing = localMemoryRateLimitStore.get(clientIp);
  if (!existing || now > existing.resetAt) {
    localMemoryRateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false, retryAfterSeconds: 0, source: 'in-memory-default' };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { limited: true, retryAfterSeconds, source: 'in-memory-default' };
  }

  existing.count += 1;
  return { limited: false, retryAfterSeconds: 0, source: 'in-memory-default' };
}

/**
 * Extracts client IP using platform-authenticated metadata where available.
 * Prioritizes Vercel's edge proxy header over client-supplied headers.
 */
function extractClientIp(req: ContactApiRequest): string {
  // 1. Vercel Edge Proxy header (authenticated, cannot be spoofed by client)
  const vercelIp = req.headers['x-vercel-forwarded-for'];
  if (typeof vercelIp === 'string' && vercelIp.trim().length > 0) {
    const firstIp = vercelIp.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  // 2. Cloudflare Connecting IP (authenticated on Cloudflare setups)
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.trim().length > 0) {
    return cfIp.trim();
  }

  // 3. Real IP header (from trusted reverse proxies)
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim().length > 0) {
    return realIp.trim();
  }

  // 4. Standard Forwarded header (fallback)
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim().length > 0) {
    const firstIp = fwd.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  // 5. Socket remote address
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Serverless contact form endpoint for GlobalEdu.
 *
 * Security & Reliability Features:
 * 1. Strict HTTP POST enforcement & Content-Type validation
 * 2. Payload size bounds (15 KB max) & safe JSON parsing
 * 3. Shared Upstash Redis rate limiting with safe in-memory fallback
 * 4. Honeypot automated bot trap (hp_website)
 * 5. Strict server-side field length bounds and RFC email validation
 * 6. Production-valid Resend dispatch configuration with explicit dispatch status
 * 7. Zero secret exposure in responses, logs, or error dumps
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

  // 2. Validate Content-Type
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType && !contentType.includes('application/json')) {
    return res.status(415).json({
      success: false,
      error: 'Unsupported Media Type. Request must have Content-Type: application/json.',
    });
  }

  // 3. Client IP Rate Limiting (Upstash Redis shared or in-memory fallback)
  const clientIp = extractClientIp(req);
  const rateLimit = await checkRateLimit(clientIp);

  if (rateLimit.isDegraded) {
    res.setHeader('X-RateLimit-Degraded', 'true');
  }
  res.setHeader('X-RateLimit-Source', rateLimit.source);

  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({
      success: false,
      error: `Too many submissions from this connection. Please wait ${rateLimit.retryAfterSeconds} seconds before sending another message, or email us directly.`,
    });
  }

  // 4. Safe Request Body Parsing & Size Limit
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

  // 5. Spam detection: hidden honeypot field
  if (hp_website && (typeof hp_website !== 'string' || hp_website.trim().length > 0)) {
    return res.status(400).json({
      success: false,
      error: 'Automated spam submission detected.',
    });
  }

  // 6. Server-side field validation & maximum lengths
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
  // The internal notification recipient can be completely different from the public contact email
  const notificationRecipient =
    process.env.NOTIFICATION_EMAIL ||
    process.env.VITE_CONTACT_EMAIL ||
    'zolly9130@gmail.com';

  const publicContactEmail =
    process.env.VITE_CONTACT_EMAIL || 'zolly9130@gmail.com';

  const resendApiKey = process.env.RESEND_API_KEY;
  const forwardWebhook = process.env.CONTACT_FORWARD_URL;

  // 7. Resend Email Dispatch (if configured)
  if (resendApiKey) {
    // In production, users should configure RESEND_FROM_EMAIL with their verified custom domain.
    // Sandbox default: onboarding@resend.dev (restricted to the account owner's email address).
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
          to: [notificationRecipient],
          reply_to: cleanEmail,
          subject: `[GlobalEdu] ${cleanCategory}: ${cleanSubject || 'New Verification Submission'}`,
          text: `From: ${name.trim()} (${cleanEmail})\nTopic: ${cleanCategory}\nSubject: ${cleanSubject || 'N/A'}\n\nMessage Details:\n${message.trim()}`,
        }),
        signal: AbortSignal.timeout(5000),
      });

      let resendData: any = {};
      try {
        resendData = await response.json();
      } catch {
        // Non-JSON
      }

      if (response.ok && resendData && resendData.id) {
        // Accurately report acceptance into dispatch queue without claiming guaranteed mailbox delivery
        return res.status(200).json({
          success: true,
          message: 'Submission received and accepted into the editorial dispatch queue.',
          dispatchId: resendData.id,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Log sanitized error status without exposing API key
        console.error('Resend delivery provider rejected submission HTTP status:', response.status);
        const providerError =
          (resendData && typeof resendData.message === 'string' && resendData.message) ||
          'Email dispatch provider rejected the message. For production, verify your domain in Resend and set RESEND_FROM_EMAIL.';
        return res.status(502).json({
          success: false,
          error: providerError,
        });
      }
    } catch (dispatchError) {
      console.error('Email dispatch timeout or network failure');
      return res.status(500).json({
        success: false,
        error: 'Failed to reach email dispatch provider. Please use the direct email link.',
      });
    }
  }

  // 8. Webhook Forwarding (if configured)
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
        signal: AbortSignal.timeout(5000),
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

  // 9. Unconfigured Service State
  // Accurately reports that automated backend dispatch is not yet configured on this deployment.
  return res.status(503).json({
    success: false,
    error:
      'Contact submission service is not currently connected to an active email provider (e.g. RESEND_API_KEY or VITE_CONTACT_FORM_ENDPOINT). Please contact the editorial team directly at ' +
      publicContactEmail,
    recipientEmail: publicContactEmail,
  });
}
