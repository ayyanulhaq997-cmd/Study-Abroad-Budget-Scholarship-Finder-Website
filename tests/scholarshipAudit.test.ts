/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SCHOLARSHIPS_DATA,
  OPEN_VERIFIED_SCHOLARSHIPS,
  UPCOMING_VERIFIED_SCHOLARSHIPS,
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

  console.log('\nTest Suite 3: Chevening 2027/2028 Intake Official Deadline Check (Closed)');
  {
    const chevening = SCHOLARSHIPS_DATA.find((s) => s.id === 'chevening-uk');
    assert(!!chevening, 'Chevening record exists in dataset');
    assert(chevening?.programStatus === 'Closed', 'Chevening 2027/2028 intake is marked Closed');
    assert(
      CLOSED_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'chevening-uk'),
      'Chevening is included in CLOSED_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !OPEN_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'chevening-uk'),
      'Chevening is excluded from OPEN_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      Boolean(chevening?.applicationDeadlineNotice.includes('October 6, 2026')),
      'Chevening cites verified October 6, 2026 at 11:00 UTC official closing deadline'
    );
    assert(
      Boolean(chevening?.applicationDeadlineNotice.includes('expected to open in August 2027')),
      'Chevening labels unannounced 2028/2029 cycle opening as expected'
    );
  }

  console.log('\nTest Suite 4: Commonwealth Master\'s Exact Confirmed Deadline Check (Closed)');
  {
    const commonwealth = SCHOLARSHIPS_DATA.find((s) => s.id === 'commonwealth-masters-uk');
    assert(!!commonwealth, 'Commonwealth Master\'s record exists in dataset');
    assert(commonwealth?.programStatus === 'Closed', 'Commonwealth Master\'s is marked Closed on CSC central system');
    assert(
      CLOSED_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'commonwealth-masters-uk'),
      'Commonwealth Master\'s is included in CLOSED_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !OPEN_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'commonwealth-masters-uk'),
      'Commonwealth Master\'s is excluded from OPEN_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      Boolean(commonwealth?.applicationDeadlineNotice.includes('October 20, 2026 at 16:00 BST')),
      'Commonwealth Master\'s cites exact confirmed official deadline: October 20, 2026 at 16:00 BST'
    );
  }

  console.log('\nTest Suite 5: DAAD EPOS Doctoral Stipend & Rolling Status');
  {
    const daad = SCHOLARSHIPS_DATA.find((s) => s.id === 'daad-epos-germany');
    assert(!!daad, 'DAAD EPOS record exists');
    assert(
      daad?.programStatus === 'Course-Specific Deadlines',
      'DAAD EPOS is categorized under Course-Specific Deadlines'
    );
    assert(
      OPEN_VERIFIED_SCHOLARSHIPS.some((s) => s.id === 'daad-epos-germany'),
      'DAAD EPOS is included in OPEN_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !!daad?.benefitsSummary && daad.benefitsSummary.includes('€1,400'),
      'DAAD EPOS reflects €1,400/month doctoral stipend'
    );
    assert(
      !!daad?.benefitsSummary && daad.benefitsSummary.includes('€934'),
      'DAAD EPOS reflects €934/month master\'s stipend'
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

  console.log('\nTest Suite 6: Confirmed vs. Conditional Benefits Distinction');
  {
    for (const scholarship of SCHOLARSHIPS_DATA) {
      if (scholarship.isVerified && scholarship.programStatus !== 'Discontinued') {
        assert(
          Array.isArray(scholarship.confirmedBenefits) && scholarship.confirmedBenefits.length > 0,
          `${scholarship.id} defines explicit confirmed core entitlements`
        );
        assert(
          Array.isArray(scholarship.conditionalBenefits) && scholarship.conditionalBenefits.length > 0,
          `${scholarship.id} defines explicit course-dependent / conditional benefits`
        );
      }
    }
  }

  console.log('\nTest Suite 7: Future Cycles Unannounced Opening Dates Labeled Expected');
  {
    const awaitingPrograms = SCHOLARSHIPS_DATA.filter((s) => s.programStatus === 'Awaiting Announcement');
    assert(awaitingPrograms.length >= 3, 'GKS, Türkiye Bursları, and KAIST are awaiting official announcement');
    for (const prog of awaitingPrograms) {
      assert(
        prog.applicationDeadlineNotice.toLowerCase().includes('expected') &&
          prog.applicationDeadlineNotice.toLowerCase().includes('unannounced'),
        `${prog.id} clearly labels future opening dates as expected and unannounced until published`
      );
    }
  }

  console.log('\nTest Suite 8: Vanier CGS Discontinuation & Replacement');
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
  }

  console.log('\nTest Suite 9: Segregation of Unverified Records');
  {
    const placeholder = SCHOLARSHIPS_DATA.find((s) => s.id === 'placeholder-unverified-sample');
    assert(!!placeholder, 'Unverified placeholder record exists');
    assert(placeholder?.isVerified === false, 'Unverified placeholder has isVerified = false');
    assert(
      placeholder?.programStatus === 'Not Yet Verified',
      'Unverified placeholder has programStatus = Not Yet Verified'
    );
    assert(
      !ACTIVE_VERIFIED_SCHOLARSHIPS.some((s) => s.id === placeholder?.id),
      'Unverified placeholder is excluded from ACTIVE_VERIFIED_SCHOLARSHIPS'
    );
    assert(
      !OPEN_VERIFIED_SCHOLARSHIPS.some((s) => s.id === placeholder?.id),
      'Unverified placeholder is excluded from OPEN_VERIFIED_SCHOLARSHIPS'
    );
  }

  console.log('\nTest Suite 10: Matcher Operational Status Handling');
  {
    const profile: UserEligibilityProfile = {
      academicPercentage: 82,
      ieltsScore: 7.0,
      degreeLevel: 'Master',
      subjectArea: 'Engineering & Technology',
      preferredDestination: 'Germany',
      workExperienceYears: 3,
      isPakistaniCitizen: true,
    };

    const results = matchAllScholarships(profile);

    // Active rolling scheme (DAAD EPOS) evaluates as Baseline Criteria Met
    const daadResult = results.find((r) => r.scholarship.id === 'daad-epos-germany');
    assert(!!daadResult, 'DAAD EPOS evaluated in matcher');
    assert(
      daadResult?.overallStatus === 'Baseline Criteria Met',
      'DAAD EPOS reports "Baseline Criteria Met" for qualified applicant on rolling course deadlines'
    );

    // Closed scheme (Chevening UK) evaluates as Not Eligible due to closed deadline
    const cheveningResult = results.find((r) => r.scholarship.id === 'chevening-uk');
    assert(!!cheveningResult, 'Chevening evaluated in matcher');
    assert(
      cheveningResult?.overallStatus === 'Not Eligible',
      'Closed Chevening 2027/2028 intake reports "Not Eligible" in matcher'
    );
    assert(
      !!cheveningResult?.requirementsNotMet.some((r) => r.id === 'program-closed'),
      'Chevening lists program-closed in requirementsNotMet'
    );

    // Closed scheme (Commonwealth Master\'s) evaluates as Not Eligible due to closed deadline
    const commonwealthResult = results.find((r) => r.scholarship.id === 'commonwealth-masters-uk');
    assert(!!commonwealthResult, 'Commonwealth Master\'s evaluated in matcher');
    assert(
      commonwealthResult?.overallStatus === 'Not Eligible',
      'Closed Commonwealth Master\'s intake reports "Not Eligible" in matcher'
    );
    assert(
      !!commonwealthResult?.requirementsNotMet.some((r) => r.id === 'program-closed'),
      'Commonwealth lists program-closed in requirementsNotMet'
    );

    // Closed scheme (Fulbright Pakistan) evaluates as Not Eligible
    const fulbrightResult = results.find((r) => r.scholarship.id === 'fulbright-pakistan');
    assert(!!fulbrightResult, 'Fulbright evaluated in matcher');
    assert(
      fulbrightResult?.overallStatus === 'Not Eligible',
      'Closed Fulbright 2027 intake reports "Not Eligible" in matcher'
    );
  }

  console.log('\nTest Suite 11: Scholarship Structured VerificationRecord Metadata');
  {
    for (const sch of SCHOLARSHIPS_DATA) {
      assert(
        Boolean(sch.verification),
        `${sch.name} includes structured verification record`
      );
      assert(
        Boolean(sch.verification?.applicableCycle),
        `${sch.name} verification record defines an applicable cycle`
      );
      assert(
        Boolean(sch.verification?.scope),
        `${sch.name} verification record defines eligibility and benefit scope`
      );
      if (sch.programStatus === 'Discontinued') {
        assert(
          sch.verification?.status === 'expired' || sch.verification?.status === 'verified',
          `Discontinued scholarship ${sch.name} has status 'expired' or 'verified'`
        );
      } else if (sch.isVerified) {
        assert(
          sch.verification?.status === 'verified',
          `Verified scholarship ${sch.name} has status 'verified'`
        );
        assert(
          Boolean(sch.verification?.sourceUrl.startsWith('https://')),
          `Verified scholarship ${sch.name} provides official HTTPS source URL (${sch.verification?.sourceUrl})`
        );
      } else {
        assert(
          sch.verification?.status === 'pending',
          `Unverified placeholder ${sch.name} has status 'pending'`
        );
      }
    }
  }

  console.log('\n====================================================');
  console.log('ALL SCHOLARSHIP AUDIT TESTS PASSED SUCCESSFULLY (11/11 SUITES)');
  console.log('====================================================');
}

runScholarshipAuditTests();
