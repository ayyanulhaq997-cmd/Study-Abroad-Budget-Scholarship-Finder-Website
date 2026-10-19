/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SCHOLARSHIPS_DATA,
  ACTIVE_VERIFIED_SCHOLARSHIPS,
  DISCONTINUED_SCHOLARSHIPS,
  UNVERIFIED_SCHOLARSHIPS,
} from '../src/data/scholarshipsData';
import {
  evaluateEligibility,
  matchAllScholarships,
  UserEligibilityProfile,
} from '../src/services/eligibilityMatcher';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function runScholarshipAuditTests() {
  console.log('====================================================');
  console.log('RUNNING SCHOLARSHIP DIRECTORY AUDIT TESTS');
  console.log('====================================================');

  console.log('\nTest Suite 1: Vanier CGS Discontinuation & Replacement');
  {
    const vanier = SCHOLARSHIPS_DATA.find((s) => s.id === 'vanier-cgs-canada');
    assert(!!vanier, 'Vanier CGS record exists in dataset');
    assert(vanier?.programStatus === 'Discontinued', 'Vanier CGS programStatus is Discontinued');
    assert(
      !ACTIVE_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'vanier-cgs-canada'),
      'Vanier CGS is excluded from ACTIVE_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      DISCONTINUED_SCHOLARSHIPS.some((s) => s.id === 'vanier-cgs-canada'),
      'Vanier CGS is included in DISCONTINUED_SCHOLARSHIPS'
    );
    assert(
      !!vanier?.replacementProgramName &&
        vanier.replacementProgramName.includes('Canada Graduate Research Scholarship'),
      'Vanier CGS specifies Canada Graduate Research Scholarship – Doctoral (CGRS-D) replacement'
    );
    assert(
      !!vanier?.statusDetails && vanier.statusDetails.includes('no longer accepting applications'),
      'Vanier CGS statusDetails states no longer accepting applications'
    );
  }

  console.log('\nTest Suite 2: Elimination of Stale "Verified 2024–2025" Labels');
  {
    for (const scholarship of SCHOLARSHIPS_DATA) {
      assert(
        !scholarship.lastVerifiedDate.includes('2024-2025'),
        `${scholarship.id} does not use stale "2024-2025" string (Current: "${scholarship.lastVerifiedDate}")`
      );
    }
  }

  console.log('\nTest Suite 3: Official Links and Grounding for Active Scholarships');
  {
    assert(ACTIVE_VERIFIED_SCHOLARSHIPS.length >= 8, 'Active verified list contains active schemes');
    for (const scholarship of ACTIVE_VERIFIED_SCHOLARSHIPS) {
      assert(scholarship.isVerified === true, `${scholarship.id} has isVerified = true`);
      assert(scholarship.programStatus === 'Active', `${scholarship.id} has programStatus = 'Active'`);
      assert(
        scholarship.officialUrl.startsWith('https://'),
        `${scholarship.id} has verified HTTPS official portal URL (${scholarship.officialUrl})`
      );
      assert(
        scholarship.lastVerifiedDate.includes('2026'),
        `${scholarship.id} has verified 2026 date (${scholarship.lastVerifiedDate})`
      );
    }
  }

  console.log('\nTest Suite 4: Segregation of Unverified Records');
  {
    const placeholder = SCHOLARSHIPS_DATA.find((s) => s.id === 'placeholder-unverified-sample');
    assert(!!placeholder, 'Unverified placeholder record exists');
    assert(placeholder?.isVerified === false, 'Unverified placeholder has isVerified = false');
    assert(
      placeholder?.programStatus === 'Not Yet Verified',
      'Unverified placeholder has programStatus = Not Yet Verified'
    );
    assert(
      placeholder?.lastVerifiedDate === 'Not yet verified',
      'Unverified placeholder has lastVerifiedDate = "Not yet verified"'
    );
    assert(
      !ACTIVE_VERIFIED_SCHOLARSHIPS.some((s) => s.id === placeholder?.id),
      'Unverified placeholder is excluded from ACTIVE_VERIFIED_SCHOLARSHIPS'
    );
  }

  console.log('\nTest Suite 5: Eligibility Matcher Distinguishes Baseline vs Guarantee');
  {
    const profile: UserEligibilityProfile = {
      academicPercentage: 82,
      ieltsScore: 7.0,
      degreeLevel: 'Master',
      subjectArea: 'Computer Science & AI',
      preferredDestination: 'United Kingdom',
      workExperienceYears: 3,
      isPakistaniCitizen: true,
    };

    const results = matchAllScholarships(profile);
    const chevening = results.find((r) => r.scholarship.id === 'chevening-uk');

    assert(!!chevening, 'Chevening evaluated in matcher');
    assert(
      chevening?.overallStatus === 'Baseline Criteria Met',
      'Chevening reports "Baseline Criteria Met" for qualified applicant'
    );
    assert(chevening?.requirementsMet.length! >= 4, 'Chevening documents satisfied requirements');
    assert(chevening?.requirementsNotMet.length === 0, 'No unmet disqualifications for Chevening');

    // Test discontinued program evaluation in matcher
    const vanierResult = results.find((r) => r.scholarship.id === 'vanier-cgs-canada');
    assert(!!vanierResult, 'Vanier evaluated in matcher');
    assert(
      vanierResult?.overallStatus === 'Not Eligible',
      'Discontinued Vanier CGS is marked Not Eligible in matcher'
    );
    assert(
      !!vanierResult?.requirementsNotMet.some((r) => r.id === 'program-discontinued'),
      'Discontinued status is explicitly cited in requirementsNotMet'
    );
  }

  console.log('\n====================================================');
  console.log('ALL SCHOLARSHIP AUDIT TESTS PASSED SUCCESSFULLY');
  console.log('====================================================');
}

runScholarshipAuditTests();
