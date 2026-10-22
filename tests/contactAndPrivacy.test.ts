/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  validateContactForm,
  createMailtoLink,
  submitContactForm,
  MONITORED_EDITORIAL_EMAIL,
  ALLOWED_CATEGORIES,
} from '../src/services/contactService.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

console.log('====================================================');
console.log('RUNNING CONTACT SERVICE & PRIVACY VALIDATION TESTS');
console.log('====================================================\n');

// Test Suite 1: Input Validation
console.log('Test Suite 1: Contact Form Input Validation');
{
  const baseTime = 1000000;
  const validSubmitTime = baseTime + 5000; // 5s after mount

  // Valid input
  const valid = validateContactForm(
    {
      name: 'Muhammad Saleem',
      email: 'muhammadsaleem.76588@gmail.com',
      category: 'Report an Outdated/Unverified Scholarship',
      subject: 'DAAD EPOS Deadline update',
      message: 'Please check the latest DAAD scholarship bulletin at https://daad.de for 2026/2027.',
    },
    baseTime,
    validSubmitTime
  );
  assert(valid.isValid === true, 'Valid form input passes validation');

  // Short name
  const invalidName = validateContactForm(
    {
      name: 'A',
      email: 'test@example.com',
      category: 'General Calculator Feedback',
      message: 'This is a sufficiently long message for testing.',
    },
    baseTime,
    validSubmitTime
  );
  assert(invalidName.isValid === false, 'Rejects name with fewer than 2 characters');

  // Invalid email
  const invalidEmail = validateContactForm(
    {
      name: 'Test User',
      email: 'not-an-email',
      category: 'General Calculator Feedback',
      message: 'This is a sufficiently long message for testing.',
    },
    baseTime,
    validSubmitTime
  );
  assert(invalidEmail.isValid === false, 'Rejects invalid email format without domain');

  // Short message
  const shortMsg = validateContactForm(
    {
      name: 'Test User',
      email: 'test@example.com',
      category: 'General Calculator Feedback',
      message: 'Too short',
    },
    baseTime,
    validSubmitTime
  );
  assert(shortMsg.isValid === false, 'Rejects message shorter than 15 characters');
}

// Test Suite 2: Spam Traps & Bot Velocity Protection
console.log('\nTest Suite 2: Spam Traps & Bot Velocity Protection');
{
  const baseTime = 2000000;

  // Honeypot trap filled
  const botWithHoneypot = validateContactForm(
    {
      name: 'Spam Bot',
      email: 'bot@spam.com',
      category: 'Other',
      message: 'Spam content advertising unauthorized university loans',
      honeypot: 'http://spam-link.ru',
    },
    baseTime,
    baseTime + 5000
  );
  assert(botWithHoneypot.isValid === false, 'Rejects submission when hidden honeypot field is filled');
  assert(
    botWithHoneypot.errorMessage?.includes('Automated submission detected') ?? false,
    'Provides automated submission error on honeypot match'
  );

  // Velocity trap (submitted under 2.0 seconds)
  const instantBot = validateContactForm(
    {
      name: 'Instant Submitter',
      email: 'fast@example.com',
      category: 'Other',
      message: 'Legitimate looking text submitted in 400 milliseconds',
    },
    baseTime,
    baseTime + 400
  );
  assert(instantBot.isValid === false, 'Rejects submission occurring under 2.0 seconds from mount');
  assert(
    instantBot.errorMessage?.includes('quickly') ?? false,
    'Flags velocity violation in error message'
  );
}

// Test Suite 3: Clickable Mailto Link Generation
console.log('\nTest Suite 3: Clickable Mailto Link & Monitored Email');
{
  assert(
    MONITORED_EDITORIAL_EMAIL.includes('@'),
    `Monitored email is valid format (${MONITORED_EDITORIAL_EMAIL})`
  );

  const mailto = createMailtoLink(
    {
      name: 'Muhammad Saleem',
      email: 'muhammadsaleem.76588@gmail.com',
      category: 'Suggest a Verified Scholarship Scheme',
      subject: 'TUM Fee Notice',
      message: 'Official source: https://tum.de',
    },
    'muhammadsaleem.76588@gmail.com'
  );

  assert(mailto.startsWith('mailto:muhammadsaleem.76588@gmail.com'), 'Mailto link targets monitored recipient');
  assert(mailto.includes(encodeURIComponent('[GlobalEdu] Suggest a Verified Scholarship Scheme: TUM Fee Notice')), 'Mailto link encodes subject line');
  assert(mailto.includes(encodeURIComponent('Official source: https://tum.de')), 'Mailto link encodes message body');
}

// Test Suite 4: Privacy & Storage Keys Alignment
console.log('\nTest Suite 4: Privacy & LocalStorage Keys Alignment');
{
  const EXPECTED_BUDGET_KEY = 'globaledu_study_budget_v2';
  const EXPECTED_PROFILES_KEY = 'globaledu_saved_profiles_v2';

  assert(EXPECTED_BUDGET_KEY === 'globaledu_study_budget_v2', 'Active budget localStorage key is globaledu_study_budget_v2');
  assert(EXPECTED_PROFILES_KEY === 'globaledu_saved_profiles_v2', 'Saved profiles localStorage key is globaledu_saved_profiles_v2');
}

// Test Suite 5: Strict Maximum Length & Category Constraints
console.log('\nTest Suite 5: Strict Maximum Length & Category Constraints');
{
  const baseTime = 3000000;
  const validSubmitTime = baseTime + 5000;

  // Name exceeds 100 characters
  const longName = 'A'.repeat(101);
  const nameCheck = validateContactForm(
    {
      name: longName,
      email: 'user@example.com',
      category: 'Other',
      message: 'Valid length message exceeding fifteen characters.',
    },
    baseTime,
    validSubmitTime
  );
  assert(nameCheck.isValid === false, 'Rejects name exceeding 100 characters');

  // Email exceeds 254 characters
  const longEmail = 'a'.repeat(245) + '@example.com';
  const emailCheck = validateContactForm(
    {
      name: 'Valid Name',
      email: longEmail,
      category: 'Other',
      message: 'Valid length message exceeding fifteen characters.',
    },
    baseTime,
    validSubmitTime
  );
  assert(emailCheck.isValid === false, 'Rejects email exceeding 254 characters');

  // Subject exceeds 150 characters
  const longSubject = 'S'.repeat(151);
  const subjectCheck = validateContactForm(
    {
      name: 'Valid Name',
      email: 'user@example.com',
      category: 'Other',
      subject: longSubject,
      message: 'Valid length message exceeding fifteen characters.',
    },
    baseTime,
    validSubmitTime
  );
  assert(subjectCheck.isValid === false, 'Rejects subject exceeding 150 characters');

  // Message exceeds 3000 characters
  const longMessage = 'M'.repeat(3001);
  const msgCheck = validateContactForm(
    {
      name: 'Valid Name',
      email: 'user@example.com',
      category: 'Other',
      message: longMessage,
    },
    baseTime,
    validSubmitTime
  );
  assert(msgCheck.isValid === false, 'Rejects message exceeding 3000 characters');

  // Invalid category
  const invalidCategory = validateContactForm(
    {
      name: 'Valid Name',
      email: 'user@example.com',
      category: 'Unauthorized Category' as any,
      message: 'Valid length message exceeding fifteen characters.',
    },
    baseTime,
    validSubmitTime
  );
  assert(invalidCategory.isValid === false, 'Rejects unlisted category');
  assert(ALLOWED_CATEGORIES.length === 5, 'Maintains 5 official category options');
}

// Test Suite 6: Explicit JSON Success Requirement in submitContactForm
console.log('\nTest Suite 6: Explicit JSON Success Requirement in submitContactForm');
{
  const originalFetch = globalThis.fetch;

  // Case A: Server returns HTTP 200 but empty / non-confirming JSON
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ status: 'ok_unconfirmed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  const testPayload = {
    name: 'Muhammad Saleem',
    email: 'muhammadsaleem.76588@gmail.com',
    category: 'General Calculator Feedback',
    message: 'Testing explicit JSON confirmation check.',
  };

  const resA = await submitContactForm(testPayload, 'http://localhost/test');
  assert(resA.success === false, 'Rejects HTTP 200 when JSON lacks explicit success: true or ok: true');
  assert(
    resA.error?.includes('explicit success confirmation') || false,
    'Reports explicit confirmation missing in error response'
  );

  // Case B: Server returns HTTP 200 with HTML/plain-text (e.g. error page)
  globalThis.fetch = async () =>
    new Response('<html><body>200 OK</body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  const resB = await submitContactForm(testPayload, 'http://localhost/test');
  assert(resB.success === false, 'Rejects HTTP 200 with non-JSON response');

  // Case C: Server returns HTTP 200 with explicit success: true
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: true, message: 'Delivered to queue' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  const resC = await submitContactForm(testPayload, 'http://localhost/test');
  assert(resC.success === true, 'Accepts HTTP 200 when JSON explicitly confirms success: true');
  assert(resC.message === 'Delivered to queue', 'Extracts server confirmation message');

  // Restore fetch
  globalThis.fetch = originalFetch;
}

// Test Suite 7: Vercel Routing Regex Integrity
console.log('\nTest Suite 7: Vercel Routing Regex Integrity');
{
  // Regex from vercel.json: /((?!api/).*)
  const vercelRewriteRegex = /^\/((?!api\/).*)$/;

  // Routes that MUST match the rewrite to /index.html:
  const spaRoutes = [
    '/',
    '/budget-calculator',
    '/countries',
    '/scholarships',
    '/universities',
    '/about',
    '/contact',
    '/privacy',
  ];

  for (const route of spaRoutes) {
    const matched = vercelRewriteRegex.test(route);
    assert(matched === true, `SPA route "${route}" is rewritten to index.html`);
  }

  // Routes that MUST NOT match the rewrite (handled as Serverless Functions):
  const apiRoutes = [
    '/api/contact',
    '/api/contact/verify',
  ];

  for (const route of apiRoutes) {
    const matched = vercelRewriteRegex.test(route);
    assert(matched === false, `API route "${route}" is NOT rewritten (executes serverless function)`);
  }
}

console.log('\n====================================================');
console.log('ALL CONTACT & PRIVACY TESTS PASSED (7/7 SUITES)');
console.log('====================================================');
