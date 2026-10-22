/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContactFormInput {
  name: string;
  email: string;
  category: string;
  subject?: string;
  message: string;
  honeypot?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface SubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
}

const getEnv = (key: string): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch {
    // Ignore in non-vite contexts
  }
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
  } catch {
    // Ignore
  }
  return undefined;
};

export const MONITORED_EDITORIAL_EMAIL =
  getEnv('VITE_CONTACT_EMAIL') || 'muhammadsaleem.76588@gmail.com';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const ALLOWED_CATEGORIES = [
  'Report an Outdated/Unverified Scholarship',
  'Suggest a Verified Scholarship Scheme',
  'Update Country/Visa Requirement Data',
  'General Calculator Feedback',
  'Other',
] as const;

/**
 * Validates user input, checks spam traps (honeypot), and enforces velocity timing.
 */
export function validateContactForm(
  input: ContactFormInput,
  mountTimeMs: number,
  currentTimeMs: number = Date.now()
): ValidationResult {
  // 1. Honeypot check (hidden field filled only by automated bots)
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return {
      isValid: false,
      errorMessage: 'Automated submission detected. Please leave spam prevention fields empty.',
    };
  }

  // 2. Submission velocity check (less than 2.0 seconds between mount and submit indicates bot activity)
  if (currentTimeMs - mountTimeMs < 2000) {
    return {
      isValid: false,
      errorMessage: 'Submission occurred too quickly. Please review your message before submitting.',
    };
  }

  // 3. Name validation (min 2, max 100 characters)
  const trimmedName = input.name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return {
      isValid: false,
      errorMessage: 'Please enter your full name (minimum 2 characters).',
    };
  }
  if (trimmedName.length > 100) {
    return {
      isValid: false,
      errorMessage: 'Name must not exceed 100 characters.',
    };
  }

  // 4. Email validation (max 254 characters)
  const trimmedEmail = input.email.trim();
  if (!trimmedEmail || trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid email address (e.g. name@example.com, max 254 characters).',
    };
  }

  // 5. Category validation
  if (input.category && !ALLOWED_CATEGORIES.includes(input.category as any)) {
    return {
      isValid: false,
      errorMessage: 'Please select a valid topic category.',
    };
  }

  // 6. Subject validation (max 150 characters)
  if (input.subject && input.subject.trim().length > 150) {
    return {
      isValid: false,
      errorMessage: 'Subject line must not exceed 150 characters.',
    };
  }

  // 7. Message validation (min 15, max 3000 characters)
  const trimmedMessage = input.message.trim();
  if (!trimmedMessage || trimmedMessage.length < 15) {
    return {
      isValid: false,
      errorMessage: 'Please provide detailed information (minimum 15 characters, including official URLs where applicable).',
    };
  }
  if (trimmedMessage.length > 3000) {
    return {
      isValid: false,
      errorMessage: 'Message length exceeds the 3,000 character limit.',
    };
  }

  return { isValid: true };
}

/**
 * Generates a prefilled mailto link for direct client-side fallback.
 */
export function createMailtoLink(
  input: Partial<ContactFormInput>,
  recipientEmail: string = MONITORED_EDITORIAL_EMAIL
): string {
  const subjectText = input.subject?.trim()
    ? `[GlobalEdu] ${input.category || 'Feedback'}: ${input.subject.trim()}`
    : `[GlobalEdu] ${input.category || 'Verification Report'}`;

  const bodyParts = [
    input.name ? `Name: ${input.name}` : '',
    input.email ? `Email: ${input.email}` : '',
    input.category ? `Category: ${input.category}` : '',
    '',
    input.message ? `Details / Primary Source Links:\n${input.message}` : '',
  ].filter(Boolean);

  const encodedSubject = encodeURIComponent(subjectText);
  const encodedBody = encodeURIComponent(bodyParts.join('\n'));

  return `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Submits the verified payload to the configured form service or serverless endpoint.
 *
 * CRITICAL REQUIREMENT:
 * Requires an explicit successful JSON response (data.success === true || data.ok === true).
 * Does NOT treat HTTP 200 alone as proof of delivery success.
 */
export async function submitContactForm(
  input: ContactFormInput,
  endpointUrl: string = getEnv('VITE_CONTACT_FORM_ENDPOINT') || '/api/contact'
): Promise<SubmissionResult> {
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
        category: input.category,
        subject: input.subject?.trim() || '',
        message: input.message.trim(),
        hp_website: input.honeypot || '',
        submittedAt: new Date().toISOString(),
      }),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      // Body is not valid JSON
      data = null;
    }

    // Explicit confirmation check: must be a JSON object with explicit boolean true
    const hasExplicitConfirmation = Boolean(
      data &&
      typeof data === 'object' &&
      (data.success === true || data.ok === true)
    );

    // Only consider successful when BOTH HTTP status is in 2xx AND JSON explicitly confirms it
    if (response.ok && hasExplicitConfirmation) {
      return {
        success: true,
        message:
          typeof data.message === 'string' && data.message.trim().length > 0
            ? data.message
            : 'Verification report successfully received by our editorial review queue.',
        timestamp: data.timestamp || new Date().toISOString(),
      };
    }

    // If HTTP status was 200 but JSON lacked explicit success confirmation:
    if (response.ok && !hasExplicitConfirmation) {
      const unconfirmedReason =
        data && typeof data === 'object' && typeof data.error === 'string'
          ? data.error
          : 'The server responded with status 200, but did not return an explicit success confirmation. Please send via direct email.';
      return {
        success: false,
        error: unconfirmedReason,
      };
    }

    // Server returned an HTTP error (4xx, 5xx)
    const errorDetails =
      (data && typeof data === 'object' && typeof data.error === 'string' && data.error) ||
      (data && typeof data === 'object' && typeof data.message === 'string' && data.message) ||
      (response.status === 429
        ? 'Too many submissions sent. Please wait several minutes before retrying, or email us directly.'
        : response.status === 503
        ? 'The contact delivery service is currently unconfigured on this deployment. Please use the direct email link below.'
        : `Service returned HTTP error ${response.status}. Please use the direct email link below.`);

    return {
      success: false,
      error: errorDetails,
    };
  } catch (networkError: any) {
    return {
      success: false,
      error:
        'Unable to connect to the submission service (network unreachable). Please verify your connection or contact the editorial team directly.',
    };
  }
}
