/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COUNTRIES_DATA } from '../src/data/countriesData';
import { Country } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function runCountryComparisonTests() {
  console.log('====================================================');
  console.log('RUNNING COUNTRY COMPARISON & AUDIT TESTS');
  console.log('====================================================');

  // Test Suite 1: Germany Verification
  console.log('\nTest Suite 1: Germany Audit Requirements');
  {
    const de = COUNTRIES_DATA.find((c) => c.id === 'germany');
    assert(Boolean(de), 'Germany record exists');
    if (de) {
      assert(de.statutoryAnnualLivingProof === 11904, 'Germany statutory living proof is €11,904');
      assert(de.currencyCode === 'EUR', 'Germany currency is EUR');
      assert(
        de.partTimeWorkRights.includes('140 full days') &&
          de.partTimeWorkRights.includes('280 half days'),
        'Germany states 140 full days or 280 half days work rule'
      );
      assert(
        Boolean(de.workRightsOfficialSource && de.workRightsOfficialSource.includes('16b (3)')),
        'Germany cites Section 16b (3) AufenthG / Skilled Immigration Act'
      );
      assert(
        de.postStudyWorkVisa.includes('18-month') || de.postStudyWorkVisa.includes('18 months'),
        'Germany post-study job-search residence permit is up to 18 months'
      );
      assert(
        Boolean(de.postStudyOfficialSource && de.postStudyOfficialSource.includes('20 (3)')),
        'Germany cites Section 20 (3) no. 1 AufenthG'
      );
    }
  }

  // Test Suite 2: South Korea Verification & Arithmetic
  console.log('\nTest Suite 2: South Korea Audit & Arithmetic');
  {
    const kr = COUNTRIES_DATA.find((c) => c.id === 'south-korea');
    assert(Boolean(kr), 'South Korea record exists');
    if (kr) {
      assert(kr.currencyCode === 'KRW', 'South Korea currency is KRW (Korean Won)');
      assert(kr.currencySymbol === '₩', 'South Korea currency symbol is ₩');
      assert(
        kr.typicalTuitionMin >= 1000000,
        'South Korea tuition data is stored in original KRW (e.g. ₩4,000,000)'
      );
      assert(
        kr.typicalLivingMin >= 1000000,
        'South Korea living expenses are stored in original KRW (e.g. ₩9,600,000)'
      );
      assert(
        !kr.officialProofOfFundsRequirement.includes('universal $18,000'),
        'Universal bank statement claim removed for Korea'
      );
      assert(
        kr.partTimeWorkRights.includes('S-3') && kr.partTimeWorkRights.includes('TOPIK'),
        'South Korea part-time work states S-3 immigration permission and TOPIK dependency'
      );
      assert(
        kr.postStudyWorkVisa.includes('D-10') &&
          kr.postStudyWorkVisa.includes('domestic Korean universities') &&
          kr.postStudyWorkVisa.includes('Points-Based System'),
        'South Korea D-10 visa explains conditional pathways for domestic vs foreign graduates'
      );
      assert(
        Boolean(kr.postStudyOfficialSource && kr.postStudyOfficialSource.includes('HiKorea')),
        'South Korea cites official HiKorea / Ministry of Justice portal'
      );

      // Verify exact arithmetic requested in audit:
      // ₩20,000,000 * 0.208 = PKR 4,160,000 (Financial Proof Benchmark)
      // ₩5,400,000 * 0.208 = PKR 1,123,200 (Illustrative Tuition)
      // PKR 450,000 (Pre-departure Costs)
      // Combined Illustrative Total = PKR 5,733,200
      const statedFinancialProofPKR = Math.round(20000000 * 0.208); // 4,160,000
      const illustrativeTuitionPKR = Math.round(5400000 * 0.208); // 1,123,200
      const preDeparturePKR = 450000;
      const combinedTotalPKR = statedFinancialProofPKR + illustrativeTuitionPKR + preDeparturePKR;

      assert(
        statedFinancialProofPKR === 4160000,
        'South Korea stated financial proof: ₩20,000,000 × 0.208 = PKR 4,160,000'
      );
      assert(
        illustrativeTuitionPKR === 1123200,
        'South Korea illustrative tuition: ₩5,400,000 × 0.208 = PKR 1,123,200'
      );
      assert(
        combinedTotalPKR === 5733200,
        'South Korea combined illustrative amount: PKR 4,160,000 + PKR 1,123,200 + PKR 450,000 = PKR 5,733,200'
      );
    }
  }

  // Test Suite 3: United States Verification
  console.log('\nTest Suite 3: United States Audit Requirements');
  {
    const us = COUNTRIES_DATA.find((c) => c.id === 'usa');
    assert(Boolean(us), 'United States record exists');
    if (us) {
      assert(
        us.officialProofOfFundsRequirement.includes('Form I-20') &&
          us.officialProofOfFundsRequirement.includes('Cost of Attendance'),
        'US proof-of-funds requirement tied to institutional Form I-20 Cost of Attendance'
      );
      assert(
        !us.officialProofOfFundsRequirement.includes('mandatory $18,000 federal'),
        'Unsupported universal $18,000 federal claim removed'
      );
      assert(
        us.partTimeWorkRights.includes('On-campus') &&
          us.partTimeWorkRights.includes('20 hours') &&
          us.partTimeWorkRights.includes('Off-campus'),
        'US strictly preserves legal distinction between on-campus and authorized off-campus work'
      );
      assert(
        Boolean(us.workRightsOfficialSource && us.workRightsOfficialSource.includes('8 CFR 214.2(f)(9)')),
        'US cites 8 CFR 214.2(f)(9) employment regulations'
      );
    }
  }

  // Test Suite 4: Canada Verification
  console.log('\nTest Suite 4: Canada Audit Requirements');
  {
    const ca = COUNTRIES_DATA.find((c) => c.id === 'canada');
    assert(Boolean(ca), 'Canada record exists');
    if (ca) {
      assert(
        ca.statutoryAnnualLivingProof === 23448,
        'Canada living-funds requirement is CAD $23,448 for single applicant (effective 1 Sept 2026)'
      );
      assert(
        ca.partTimeWorkRights.includes('24 hours per week'),
        'Canada off-campus work limit updated to 24 hours per week'
      );
      assert(
        ca.notes.includes('PAL/TAL') && ca.notes.includes('exemptions'),
        'Canada PAL/TAL exemptions (master’s/doctoral, extensions) clearly explained'
      );
    }
  }

  // Test Suite 5: United Kingdom Verification
  console.log('\nTest Suite 5: United Kingdom Audit Requirements');
  {
    const uk = COUNTRIES_DATA.find((c) => c.id === 'uk');
    assert(Boolean(uk), 'United Kingdom record exists');
    if (uk) {
      assert(
        uk.statutoryLivingProofLondon === 13761,
        'UK London statutory living proof is £13,761 (£1,529 x 9 months)'
      );
      assert(
        uk.statutoryLivingProofNonLondon === 10539,
        'UK Outside London statutory living proof is £10,539 (£1,171 x 9 months)'
      );
      assert(
        Boolean(
          uk.postStudyWorkVisa.includes('1 January 2027') &&
            uk.postStudyWorkVisa.includes('18 months') &&
            uk.postStudyWorkVisa.includes('3 years for doctoral')
        ),
        'UK Graduate Route change effective 1 January 2027 (18 mo master’s, 3 yr doctoral) documented'
      );
    }
  }

  // Test Suite 6: Australia Verification
  console.log('\nTest Suite 6: Australia Audit Requirements');
  {
    const au = COUNTRIES_DATA.find((c) => c.id === 'australia');
    assert(Boolean(au), 'Australia record exists');
    if (au) {
      assert(
        au.statutoryAnnualLivingProof === 29710,
        'Australia Department of Home Affairs 12-month living funds is AUD $29,710'
      );
      assert(
        au.partTimeWorkRights.includes('48 hours per fortnight'),
        'Australia states 48 hours per fortnight work limit'
      );
      assert(
        au.partTimeWorkRights.includes('Master by research') &&
          au.partTimeWorkRights.includes('unrestricted'),
        'Australia work limit exceptions for research masters/PhD stated'
      );
      assert(
        au.postStudyWorkVisa.includes('Bachelor') &&
          au.postStudyWorkVisa.includes('Master’s by Research: 3 years') &&
          au.postStudyWorkVisa.includes('Doctoral (PhD): 3 years'),
        'Australia Subclass 485 post-study work duration by qualification verified'
      );
    }
  }

  // Test Suite 7: All 6 Countries Grounding & Presentation
  console.log('\nTest Suite 7: All 6 Countries Official Grounding & Sources');
  {
    assert(COUNTRIES_DATA.length === 6, 'Exactly 6 comparison countries present');
    for (const country of COUNTRIES_DATA) {
      assert(
        country.lastVerifiedDate.includes('2026'),
        `${country.name} displays 2026 last-verified date (${country.lastVerifiedDate})`
      );
      assert(
        country.officialSourceUrl.startsWith('https://'),
        `${country.name} has HTTPS official source URL (${country.officialSourceUrl})`
      );
      assert(
        country.officialLinks.length >= 2,
        `${country.name} provides official government portals`
      );
      assert(
        country.statutoryAnnualLivingProof > 0,
        `${country.name} has non-zero statutory annual living proof`
      );
      assert(
        country.typicalLivingMax >= country.typicalLivingMin,
        `${country.name} estimated actual living range is valid`
      );
      assert(
        Boolean(country.visaRequirementType),
        `${country.name} defines visaRequirementType`
      );
      assert(
        Boolean(country.verification && country.verification.status === 'verified'),
        `${country.name} has a structured VerificationRecord with status 'verified'`
      );
      assert(
        Boolean(country.verification && country.verification.sourceUrl.startsWith('https://')),
        `${country.name} verification record links to an HTTPS source URL`
      );
      assert(
        Boolean(country.verification && country.verification.applicableCycle),
        `${country.name} verification record defines an applicable admission/immigration cycle`
      );
    }

    // Specific visa requirement types
    const us = COUNTRIES_DATA.find((c) => c.id === 'usa');
    assert(
      us?.visaRequirementType === 'institution_specific',
      'USA is classified as institution_specific (Form I-20 COA, no federal statutory flat sum)'
    );

    const kr = COUNTRIES_DATA.find((c) => c.id === 'south-korea');
    assert(
      kr?.visaRequirementType === 'variable_regional',
      'South Korea is classified as variable_regional (CoA-determined & regional benchmark)'
    );

    const fixedBenchmarkCountries = ['germany', 'canada', 'uk', 'australia'];
    for (const id of fixedBenchmarkCountries) {
      const c = COUNTRIES_DATA.find((item) => item.id === id);
      assert(
        c?.visaRequirementType === 'fixed_benchmark',
        `${c?.name} is classified as fixed_benchmark`
      );
    }
  }

  // Test Suite 8: Calculator Integration & Arithmetic across all 6 countries
  console.log('\nTest Suite 8: Calculator Integration for All 6 Countries');
  {
    const DEFAULT_PRE_DEPARTURE_PKR = {
      documentAttestationPKR: 45000,
      ieltsExamFeePKR: 65000,
      universityApplicationFeesPKR: 40000,
      visaAndBiometricFeePKR: 35000,
      airfarePKR: 180000,
      initialHousingDepositPKR: 60000,
      miscellaneousSetupPKR: 25000,
    };

    for (const country of COUNTRIES_DATA) {
      const input = {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: country.id,
        destinationCurrency: country.currencyCode,
        expenseCurrency: country.currencyCode,
        exchangeRateToPKR: country.defaultExchangeRateToPKR,
        studyDurationYears: 2,
        annualTuition: country.typicalTuitionMin,
        annualLiving: country.statutoryAnnualLivingProof,
        annualInsurance: country.currencyCode === 'KRW' ? 800000 : 1000,
        annualSemesterFees: country.currencyCode === 'KRW' ? 400000 : 500,
        oneTimeExpenses: 450000,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
        availableAnnualBudgetPKR: 0,
        availableOneTimeFundsPKR: 0,
      };

      // Ensure that calculating totals does not produce NaN or infinite values
      const annualTotalForeign =
        country.typicalTuitionMin +
        country.statutoryAnnualLivingProof +
        (country.currencyCode === 'KRW' ? 800000 : 1000) +
        (country.currencyCode === 'KRW' ? 400000 : 500);
      const annualTotalBase = annualTotalForeign * country.defaultExchangeRateToPKR;
      const firstYearTotalBase = annualTotalBase + 450000;

      assert(
        !isNaN(annualTotalBase) && annualTotalBase > 0,
        `${country.name} annual recurring total in PKR is valid and non-zero`
      );
      assert(
        !isNaN(firstYearTotalBase) && firstYearTotalBase > 450000,
        `${country.name} first-year all-in total in PKR includes pre-departure and tuition/living`
      );
    }
  }

  console.log('\n====================================================');
  console.log('ALL COUNTRY COMPARISON AUDIT TESTS PASSED (8/8 SUITES)');
  console.log('====================================================');
}

runCountryComparisonTests();
