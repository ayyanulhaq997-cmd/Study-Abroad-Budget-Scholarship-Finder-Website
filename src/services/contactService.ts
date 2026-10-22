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

  // 3. Name validation
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

  // 4. Email validation
  const trimmedEmail = input.email.trim();
  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid email address (e.g. name@example.com).',
    };
  }

  // 5. Message validation
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
 * Never displays success without confirmed delivery from the endpoint.
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

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // Non-JSON response
    }

    // Success response: must be HTTP 200-299 and confirmed by endpoint
    if (response.ok && (data.ok === true || data.success === true || response.status === 200)) {
      return {
        success: true,
        message: data.message || 'Verification report successfully delivered to our editorial team.',
        timestamp: data.timestamp || new Date().toISOString(),
      };
    }

    // Server returned an error (e.g. 503 unconfigured, 400 validation, 500 error)
    const errorDetails =
      data.error ||
      data.message ||
      (response.status === 503
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
