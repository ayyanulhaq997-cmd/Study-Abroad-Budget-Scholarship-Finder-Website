/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { IncomingMessage, ServerResponse } from 'http';

interface ContactApiRequest extends IncomingMessage {
  body?: any;
  method?: string;
}

interface ContactApiResponse extends ServerResponse {
  status: (statusCode: number) => ContactApiResponse;
  json: (data: any) => ContactApiResponse;
}

/**
 * Serverless / Edge contact form endpoint for GlobalEdu.
 * Securely handles validation, spam protection, and delivery dispatch.
 * Secrets (RESEND_API_KEY, SMTP credentials, etc.) are strictly kept on the server.
 */
export default async function handler(req: ContactApiRequest, res: ContactApiResponse) {
  // Enforce HTTP POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Only POST submissions are accepted.',
    });
  }

  // Parse body if not pre-parsed by framework
  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ success: false, error: 'Malformed JSON payload.' });
    }
  }

  const { name, email, category, subject, message, hp_website } = payload || {};

  // 1. Spam detection: hidden honeypot field filled by automated crawlers
  if (hp_website && typeof hp_website === 'string' && hp_website.trim().length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Automated spam submission detected.',
    });
  }

  // 2. Strict input validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'A valid name (minimum 2 characters) is required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'A valid email address is required.',
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 15) {
    return res.status(400).json({
      success: false,
      error: 'Message details must be at least 15 characters long.',
    });
  }

  const recipientEmail =
    process.env.NOTIFICATION_EMAIL ||
    process.env.VITE_CONTACT_EMAIL ||
    'muhammadsaleem.76588@gmail.com';

  const resendApiKey = process.env.RESEND_API_KEY;
  const forwardWebhook = process.env.CONTACT_FORWARD_URL;

  // 3. Dispatch via Resend if configured
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GlobalEdu Contact <notifications@resend.dev>',
          to: [recipientEmail],
          reply_to: email.trim(),
          subject: `[GlobalEdu] ${category || 'Report'}: ${subject?.trim() || 'New Submission'}`,
          text: `From: ${name.trim()} (${email.trim()})\nCategory: ${category}\nSubject: ${subject?.trim() || 'N/A'}\n\nDetails:\n${message.trim()}`,
        }),
      });

      if (response.ok) {
        return res.status(200).json({
          success: true,
          message: 'Submission successfully delivered to editorial review inbox.',
          timestamp: new Date().toISOString(),
        });
      } else {
        const errorData = await response.json();
        console.error('Resend delivery rejected:', errorData);
        return res.status(502).json({
          success: false,
          error: 'Email delivery service rejected the request. Please contact the editorial email directly.',
        });
      }
    } catch (dispatchError) {
      console.error('Email dispatch exception:', dispatchError);
      return res.status(500).json({
        success: false,
        error: 'Failed to dispatch email via provider. Please use direct email link.',
      });
    }
  }

  // 4. Dispatch via Webhook if configured
  if (forwardWebhook) {
    try {
      const fwdResponse = await fetch(forwardWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          subject: subject?.trim(),
          message: message.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (fwdResponse.ok) {
        return res.status(200).json({
          success: true,
          message: 'Submission successfully forwarded to editorial review.',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (fwdError) {
      console.error('Webhook forward failure:', fwdError);
    }
  }

  // 5. If no backend dispatch service is configured in the environment:
  // Return clear 503 status so the UI knows delivery is unconfigured and does NOT display a false success.
  return res.status(503).json({
    success: false,
    error:
      'The contact submission service is not currently connected to an active email provider (e.g., RESEND_API_KEY or VITE_CONTACT_FORM_ENDPOINT). Please contact the editorial team directly at ' +
      recipientEmail,
    recipientEmail,
  });
}
