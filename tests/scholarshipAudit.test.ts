/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SCHOLARSHIPS_DATA,
  ACTIVE_VERIFIED_SCHOLARSHIPS,
  CLOSED_VERIFIED_SCHOLARSHIPS,
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

  console.log('\nTest Suite 1: Fulbright Pakistan 2027 Intake & Graduate Scope');
  {
    const fulbright = SCHOLARSHIPS_DATA.find((s) => s.id === 'fulbright-pakistan');
    assert(!!fulbright, 'Fulbright Pakistan record exists');
    assert(fulbright?.programStatus === 'Closed', 'Fulbright Pakistan 2027 cycle is marked Closed');
    assert(
      CLOSED_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'fulbright-pakistan'),
      'Fulbright Pakistan is included in CLOSED_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !ACTIVE_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'fulbright-pakistan'),
      'Fulbright Pakistan is excluded from ACTIVE_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !!fulbright?.applicationDeadlineNotice &&
        fulbright.applicationDeadlineNotice.includes('April 1, 2026'),
      'Fulbright Pakistan explicitly states April 1, 2026 deadline'
    );
    assert(
      !fulbright?.degreeLevels.includes('Bachelor'),
      'Fulbright Pakistan does NOT include Bachelor degree'
    );
    assert(
      Boolean(fulbright?.degreeLevels.includes('Master') && fulbright?.degreeLevels.includes('Doctoral')),
      'Fulbright Pakistan is strictly a graduate scholarship (Master & Doctoral)'
    );
    assert(
      fulbright?.officialUrl === 'https://www.usefp.org/scholarships/fulbright-degree.cfm',
      'Fulbright Pakistan cites official USEFP direct portal URL'
    );
  }

  console.log('\nTest Suite 2: Australia Awards Pakistan 2027 Intake & Master\'s Scope');
  {
    const australia = SCHOLARSHIPS_DATA.find((s) => s.id === 'australia-awards');
    assert(!!australia, 'Australia Awards record exists');
    assert(australia?.programStatus === 'Closed', 'Australia Awards 2027 intake is marked Closed');
    assert(
      CLOSED_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'australia-awards'),
      'Australia Awards is included in CLOSED_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !ACTIVE_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'australia-awards'),
      'Australia Awards is excluded from ACTIVE_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !!australia?.applicationDeadlineNotice &&
        australia.applicationDeadlineNotice.includes('April 30, 2026'),
      'Australia Awards states April 30, 2026 deadline'
    );
    assert(
      Boolean(australia?.degreeLevels.length === 1 && australia?.degreeLevels[0] === 'Master'),
      'Australia Awards Pakistan is strictly restricted to Master\'s degree level (no Bachelor\'s or PhD)'
    );
    assert(
      Boolean(australia?.officialUrl.startsWith('https://www.dfat.gov.au')),
      'Australia Awards cites official DFAT Australian Government portal URL'
    );
  }

  console.log('\nTest Suite 3: DAAD EPOS Doctoral Stipend Rate Update');
  {
    const daad = SCHOLARSHIPS_DATA.find((s) => s.id === 'daad-epos-germany');
    assert(!!daad, 'DAAD EPOS record exists');
    assert(
      !!daad?.benefitsSummary && daad.benefitsSummary.includes('€1,400'),
      'DAAD EPOS benefitsSummary reflects €1,400/month doctoral stipend'
    );
    assert(
      !!daad?.benefitsSummary && daad.benefitsSummary.includes('€934'),
      'DAAD EPOS benefitsSummary reflects €934/month master\'s stipend'
    );
    assert(
      !!daad?.statusDetails && daad.statusDetails.includes('February 2026'),
      'DAAD EPOS statusDetails cites February 2026 adjustment date'
    );
    assert(
      Boolean(daad?.officialUrl.includes('daad.de')),
      'DAAD EPOS cites official DAAD scholarship portal'
    );
  }

  console.log('\nTest Suite 4: Vanier CGS Discontinuation & Replacement');
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

  console.log('\nTest Suite 5: Elimination of Stale "Verified 2024–2025" Labels');
  {
    for (const scholarship of SCHOLARSHIPS_DATA) {
      assert(
        !scholarship.lastVerifiedDate.includes('2024-2025'),
        `${scholarship.id} does not use stale "2024-2025" string (Current: "${scholarship.lastVerifiedDate}")`
      );
    }
  }

  console.log('\nTest Suite 6: Active Scholarships Verification & Grounding');
  {
    assert(ACTIVE_VERIFIED_SCHOLARSHIPS.length >= 7, 'Active verified list contains active schemes');
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

  console.log('\nTest Suite 7: Segregation of Unverified Records');
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

  console.log('\nTest Suite 8: Eligibility Matcher Baseline vs Guarantee & Status Handling');
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

    // Test closed Fulbright scholarship in matcher
    const fulbrightResult = results.find((r) => r.scholarship.id === 'fulbright-pakistan');
    assert(!!fulbrightResult, 'Fulbright evaluated in matcher');
    assert(
      fulbrightResult?.overallStatus === 'Not Eligible',
      'Closed Fulbright 2027 intake is marked Not Eligible in matcher'
    );
    assert(
      !!fulbrightResult?.requirementsNotMet.some((r) => r.id === 'program-closed'),
      'Closed intake status is cited in requirementsNotMet'
    );

    // Test bachelor profile against Fulbright (strictly graduate only)
    const bachelorProfile: UserEligibilityProfile = {
      academicPercentage: 85,
      ieltsScore: 7.5,
      degreeLevel: 'Bachelor',
      subjectArea: 'Engineering & Technology',
      preferredDestination: 'United States',
      workExperienceYears: 0,
      isPakistaniCitizen: true,
    };
    const bachelorResults = matchAllScholarships(bachelorProfile);
    const fulbrightBachelor = bachelorResults.find((r) => r.scholarship.id === 'fulbright-pakistan');
    assert(
      !!fulbrightBachelor?.requirementsNotMet.some((r) => r.id === 'degree-level'),
      'Fulbright correctly rejects Bachelor degree applicant with degree-level mismatch'
    );

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
  console.log('ALL SCHOLARSHIP AUDIT TESTS PASSED SUCCESSFULLY (8/8 SUITES)');
  console.log('====================================================');
}

runScholarshipAuditTests();
