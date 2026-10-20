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

  console.log('\n====================================================');
  console.log('ALL UNIVERSITY FEES AUDIT TESTS PASSED (3/3 SUITES)');
  console.log('====================================================');
}

runUniversityFeesAuditTests();
