/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UNIVERSITIES_DATA } from '../src/data/universitiesData';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function runUniversityFeesAuditTests() {
  console.log('====================================================');
  console.log('RUNNING UNIVERSITY FEES & ATTRIBUTION AUDIT TESTS');
  console.log('====================================================\n');

  console.log('Test Suite 1: Academic Year & Program Scope Verification');
  {
    assert(UNIVERSITIES_DATA.length === 12, 'Dataset contains 12 institutional profiles');

    for (const uni of UNIVERSITIES_DATA) {
      assert(
        Boolean(uni.feeAcademicYear && (uni.feeAcademicYear.includes('2025/2026') || uni.feeAcademicYear.includes('2026'))),
        `${uni.name} fee is tied to a specific academic year (${uni.feeAcademicYear})`
      );

      assert(
        Boolean(uni.feeProgramScope && uni.feeProgramScope.trim().length > 5),
        `${uni.name} fee is tied to an explicit program/degree scope ("${uni.feeProgramScope}")`
      );

      assert(
        Boolean(uni.officialFeeScheduleUrl && uni.officialFeeScheduleUrl.startsWith('https://')),
        `${uni.name} provides a direct HTTPS official fee schedule URL (${uni.officialFeeScheduleUrl})`
      );

      assert(
        !uni.lastVerifiedDate.includes('2024-2025'),
        `${uni.name} does not use stale "2024-2025 bulletin" date (Current: ${uni.lastVerifiedDate})`
      );
    }
  }

  console.log('\nTest Suite 2: Separation of Institutional vs. External Scholarships');
  {
    const externalKeywords = ['DAAD', 'Fulbright', 'Chevening', 'Commonwealth', 'Australia Awards', 'GKS', 'CGRS-D'];

    for (const uni of UNIVERSITIES_DATA) {
      assert(
        Array.isArray(uni.institutionalScholarships) && uni.institutionalScholarships.length > 0,
        `${uni.name} lists internally funded/administered scholarships`
      );

      // Verify that institutional scholarships do NOT include government/external awards
      for (const instSch of uni.institutionalScholarships) {
        for (const kw of externalKeywords) {
          const isFalselyIncluded = instSch.toLowerCase().includes(kw.toLowerCase()) && !instSch.includes('External');
          assert(
            !isFalselyIncluded,
            `${uni.name}: Institutional scholarship "${instSch}" is not confused with external award "${kw}"`
          );
        }
      }

      assert(
        Array.isArray(uni.externalFundingOpportunities) && uni.externalFundingOpportunities.length > 0,
        `${uni.name} lists external funding opportunities separately`
      );

      // Verify that external funding opportunities explicitly note that they are not funded by the university
      for (const extSch of uni.externalFundingOpportunities) {
        assert(
          extSch.includes('Funded by') || extSch.includes('Federal') || extSch.includes('State-funded'),
          `${uni.name}: External award "${extSch}" transparently identifies the external funding authority`
        );
      }
    }
  }

  console.log('\nTest Suite 3: South Korea University Currency Integrity');
  {
    const kaist = UNIVERSITIES_DATA.find((u) => u.id === 'kaist-korea');
    const snu = UNIVERSITIES_DATA.find((u) => u.id === 'snu-korea');

    assert(Boolean(kaist), 'KAIST university record exists');
    assert(kaist?.currencyCode === 'KRW', 'KAIST currency is KRW (never USD without conversion)');
    assert(kaist?.currencySymbol === '₩', 'KAIST currency symbol is ₩');
    assert(
      kaist?.typicalAnnualTuitionMin! >= 4000000,
      'KAIST tuition is stored in native KRW figures'
    );

    assert(Boolean(snu), 'SNU university record exists');
    assert(snu?.currencyCode === 'KRW', 'SNU currency is KRW');
    assert(snu?.currencySymbol === '₩', 'SNU currency symbol is ₩');
    assert(
      snu?.typicalAnnualTuitionMin! >= 4000000,
      'SNU tuition is stored in native KRW figures'
    );
  }

  console.log('\nTest Suite 4: University Structured VerificationRecord Metadata');
  {
    for (const uni of UNIVERSITIES_DATA) {
      assert(
        Boolean(uni.verification),
        `${uni.name} includes structured verification record`
      );
      assert(
        uni.verification?.status === 'verified',
        `${uni.name} verification status is 'verified'`
      );
      assert(
        Boolean(uni.verification?.sourceUrl.startsWith('https://')),
        `${uni.name} verification sourceUrl is an HTTPS link (${uni.verification?.sourceUrl})`
      );
      assert(
        Boolean(uni.verification?.applicableCycle && uni.verification.applicableCycle.length > 5),
        `${uni.name} verification defines applicable admission/fee cycle`
      );
      assert(
        Boolean(uni.verification?.scope && uni.verification.scope.length > 5),
        `${uni.name} verification defines specific program/faculty scope`
      );
      assert(
        Boolean(uni.verification?.checkedAt && uni.verification.checkedAt.includes('2026')),
        `${uni.name} verification checkedAt date is documented in 2026`
      );
    }
  }

  console.log('\nTest Suite 5: Fee Range Bounds & Manchester MSc Advanced CS Specific Rate');
  {
    for (const uni of UNIVERSITIES_DATA) {
      if (uni.typicalAnnualTuitionMin !== null && uni.typicalAnnualTuitionMax !== null) {
        assert(
          uni.typicalAnnualTuitionMax >= uni.typicalAnnualTuitionMin,
          `${uni.name} tuition max (${uni.typicalAnnualTuitionMax}) is >= min (${uni.typicalAnnualTuitionMin})`
        );
        assert(
          uni.typicalAnnualTuitionMin >= 0,
          `${uni.name} tuition min is non-negative`
        );
      }
      assert(
        uni.estimatedCityLivingAnnual > 0,
        `${uni.name} estimated city living cost is positive`
      );
    }

    // Specific check for Manchester MSc Advanced Computer Science: £39,400 (Sept 2026) / £41,400 (Sept 2027)
    const manchester = UNIVERSITIES_DATA.find((u) => u.id === 'manchester-uk');
    assert(
      manchester?.typicalAnnualTuitionMin === 39400,
      'Manchester MSc Advanced Computer Science tuition min is £39,400 (September 2026 entry)'
    );
    assert(
      manchester?.typicalAnnualTuitionMax === 41400,
      'Manchester MSc Advanced Computer Science tuition max is £41,400 (September 2027 entry)'
    );
  }

  console.log('\n====================================================');
  console.log('ALL UNIVERSITY FEES AUDIT TESTS PASSED (5/5 SUITES)');
  console.log('====================================================');
}

runUniversityFeesAuditTests();
