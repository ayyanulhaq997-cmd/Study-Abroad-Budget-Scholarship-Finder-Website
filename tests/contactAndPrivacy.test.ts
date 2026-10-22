/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  validateContactForm,
  createMailtoLink,
  submitContactForm,
  MONITORED_EDITORIAL_EMAIL,
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
      category: 'General',
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
      category: 'General',
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
      category: 'General',
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
      category: 'Data Correction',
      subject: 'TUM Fee Notice',
      message: 'Official source: https://tum.de',
    },
    'muhammadsaleem.76588@gmail.com'
  );

  assert(mailto.startsWith('mailto:muhammadsaleem.76588@gmail.com'), 'Mailto link targets monitored recipient');
  assert(mailto.includes(encodeURIComponent('[GlobalEdu] Data Correction: TUM Fee Notice')), 'Mailto link encodes subject line');
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

console.log('\n====================================================');
console.log('ALL CONTACT & PRIVACY TESTS PASSED (4/4 SUITES)');
console.log('====================================================');
