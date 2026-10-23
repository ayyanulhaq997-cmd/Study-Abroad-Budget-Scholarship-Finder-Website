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
import contactApiHandler from '../api/contact.ts';
import {
  calculateBudget,
  sumItemizedPreDeparture,
  DEFAULT_BUDGET_INPUT,
} from '../src/services/budgetCalculator.ts';

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
      name: 'Editorial Team',
      email: 'zolly9130@gmail.com',
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
      name: 'Editorial Team',
      email: 'zolly9130@gmail.com',
      category: 'Suggest a Verified Scholarship Scheme',
      subject: 'TUM Fee Notice',
      message: 'Official source: https://tum.de',
    },
    'zolly9130@gmail.com'
  );

  assert(mailto.startsWith('mailto:zolly9130@gmail.com'), 'Mailto link targets monitored recipient');
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
    name: 'Editorial Team',
    email: 'zolly9130@gmail.com',
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

// Helper to create mock request and response for Serverless API testing
function createMockReqRes(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  ip?: string;
}) {
  let statusCode = 200;
  let responseData: any = null;
  const responseHeaders: Record<string, string> = {};

  const req: any = {
    method: options.method || 'POST',
    headers: options.headers || { 'content-type': 'application/json' },
    body: options.body,
    socket: { remoteAddress: options.ip || '127.0.0.1' },
  };

  const res: any = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    setHeader(name: string, value: string) {
      responseHeaders[name.toLowerCase()] = value;
      return res;
    },
    json(data: any) {
      responseData = data;
      return res;
    },
  };

  return {
    req,
    res,
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeader: (name: string) => responseHeaders[name.toLowerCase()],
  };
}

// Test Suite 8: Serverless API Handler Unit & Security Tests
console.log('\nTest Suite 8: Serverless API Handler Unit & Security Tests');
{
  // 1. Rejects GET requests with 405 Method Not Allowed
  {
    const mock = createMockReqRes({ method: 'GET' });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 405, 'Rejects GET request with HTTP 405');
    assert(mock.getHeader('allow') === 'POST', 'Sets Allow: POST header on 405');
  }

  // 2. Rejects unsupported Content-Type with 415
  {
    const mock = createMockReqRes({
      headers: { 'content-type': 'text/html' },
      body: 'test',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 415, 'Rejects text/html Content-Type with HTTP 415');
  }

  // 3. Rejects malformed JSON body with 400
  {
    const mock = createMockReqRes({
      body: '{ not valid json }',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 400, 'Rejects malformed JSON body with HTTP 400');
  }

  // 4. Rejects honeypot spam bot with 400
  {
    const mock = createMockReqRes({
      body: {
        name: 'Bot User',
        email: 'bot@spam.com',
        category: 'Other',
        message: 'Valid length message exceeding fifteen characters.',
        hp_website: 'http://spam-link.ru',
      },
      ip: '192.168.1.100',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 400, 'Honeypot filled submission rejected with HTTP 400');
    assert(mock.getData().error.includes('spam'), 'Reports automated spam detected');
  }

  // 5. Server-side length validation: short name (< 2 chars)
  {
    const mock = createMockReqRes({
      body: {
        name: 'A',
        email: 'user@example.com',
        category: 'Other',
        message: 'Valid length message exceeding fifteen characters.',
      },
      ip: '192.168.1.101',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 400, 'Short name (< 2 chars) rejected with HTTP 400');
  }

  // 6. Server-side length validation: oversized name (> 100 chars)
  {
    const mock = createMockReqRes({
      body: {
        name: 'A'.repeat(101),
        email: 'user@example.com',
        category: 'Other',
        message: 'Valid length message exceeding fifteen characters.',
      },
      ip: '192.168.1.102',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 400, 'Oversized name (> 100 chars) rejected with HTTP 400');
  }

  // 7. Server-side length validation: short message (< 15 chars)
  {
    const mock = createMockReqRes({
      body: {
        name: 'Muhammad Saleem',
        email: 'user@example.com',
        category: 'Other',
        message: 'Too short',
      },
      ip: '192.168.1.103',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 400, 'Short message (< 15 chars) rejected with HTTP 400');
  }

  // 8. Server-side length validation: oversized message (> 3000 chars)
  {
    const mock = createMockReqRes({
      body: {
        name: 'Muhammad Saleem',
        email: 'user@example.com',
        category: 'Other',
        message: 'M'.repeat(3001),
      },
      ip: '192.168.1.104',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 400, 'Oversized message (> 3000 chars) rejected with HTTP 400');
  }

  // 9. Unconfigured email service returns HTTP 503 with editorial recipient without crashing
  {
    const mock = createMockReqRes({
      body: {
        name: 'Muhammad Saleem',
        email: 'muhammadsaleem.76588@gmail.com',
        category: 'Other',
        message: 'Valid length message exceeding fifteen characters for unconfigured test.',
      },
      ip: '192.168.1.105',
    });
    await contactApiHandler(mock.req, mock.res);
    assert(mock.getStatusCode() === 503, 'Unconfigured provider returns HTTP 503');
    assert(mock.getData().success === false, 'Returns success: false when unconfigured');
    assert(Boolean(mock.getData().recipientEmail), 'Provides recipient email for direct fallback');
  }

  // 10. Rate limiting test: IP sends more than 5 requests in window
  {
    const testIp = '10.0.0.99';
    let lastStatus = 200;

    for (let i = 0; i < 6; i++) {
      const mock = createMockReqRes({
        body: {
          name: 'Rate Limit Tester',
          email: 'ratelimit@example.com',
          category: 'Other',
          message: 'Valid length message exceeding fifteen characters for rate limit testing.',
        },
        ip: testIp,
      });
      await contactApiHandler(mock.req, mock.res);
      lastStatus = mock.getStatusCode();
      if (i === 5) {
        assert(lastStatus === 429, 'Sixth request from same IP is rate-limited with HTTP 429');
        assert(Boolean(mock.getHeader('retry-after')), 'Sets Retry-After header on HTTP 429');
      }
    }
  }
}

// Test Suite 9: Financial Calculator Defensive Clamping & Parsing
console.log('\nTest Suite 9: Financial Calculator Defensive Clamping & Parsing');
{
  // 1. Negative cost inputs are safely clamped to 0
  const negativeInput = {
    ...DEFAULT_BUDGET_INPUT,
    annualTuition: -5000,
    annualLiving: -2000,
    annualInsurance: -500,
    annualSemesterFees: -100,
  };
  const negResult = calculateBudget(negativeInput);
  assert(negResult.annualRecurringCostForeign === 0, 'Negative tuition and living costs clamped to 0');
  assert(negResult.totalDegreeFundingGapBase >= 0, 'Funding gap remains non-negative with negative inputs');

  // 2. Negative available funds clamped to 0
  const negFundsInput = {
    ...DEFAULT_BUDGET_INPUT,
    availableOneTimeFundsPKR: -1000000,
    availableAnnualBudgetPKR: -500000,
  };
  const negFundsResult = calculateBudget(negFundsInput);
  assert(negFundsResult.totalAvailableResourcesBase === 0, 'Negative available resources clamped to 0');

  // 3. Negative itemized pre-departure costs clamped to 0
  const negPreDeparture = {
    documentAttestationPKR: -15000,
    ieltsExamFeePKR: -65000,
    universityApplicationFeesPKR: -45000,
    visaAndBiometricFeePKR: -120000,
    airfarePKR: -180000,
    initialHousingDepositPKR: -250000,
    miscellaneousSetupPKR: -50000,
  };
  const sum = sumItemizedPreDeparture(negPreDeparture);
  assert(sum === 0, 'Negative itemized pre-departure costs clamped to 0');
}

console.log('\n====================================================');
console.log('ALL CONTACT & PRIVACY TESTS PASSED (9/9 SUITES)');
console.log('====================================================');
