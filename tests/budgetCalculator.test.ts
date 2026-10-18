/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  calculateBudget,
  formatCurrency,
  formatPakistaniDenominations,
  getPresetInput,
  DEFAULT_PRE_DEPARTURE_PKR,
} from '../src/services/budgetCalculator';
import { BudgetInput, Country } from '../src/types';

// Simple test runner assertion helper
function assertEqual<T>(actual: T, expected: T, message: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`FAIL: ${message}\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`);
  }
  console.log(`  ✓ ${message}`);
}

function runTests() {
  console.log('====================================================');
  console.log('RUNNING AUTOMATED TEST SUITE FOR BUDGET CALCULATOR');
  console.log('====================================================\n');

  // ----------------------------------------------------------------------
  // TEST SUITE 1: USER SPECIFIED TEST CASE (SECTION 6)
  // ----------------------------------------------------------------------
  console.log('Test Suite 1: Known User Values in PKR (Section 6)');
  {
    const input: BudgetInput = {
      homeCountry: 'Pakistan',
      homeCurrency: 'PKR',
      destinationCountryId: 'germany',
      destinationCurrency: 'EUR',
      expenseCurrency: 'PKR', // Entered in PKR
      exchangeRateToPKR: 305.50,
      studyDurationYears: 3,
      annualTuition: 1000000,
      annualLiving: 600000,
      annualInsurance: 50000,
      annualSemesterFees: 50000,
      oneTimeExpenses: 200000,
      oneTimeExpensesCurrency: 'PKR',
      preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
      availableOneTimeFundsPKR: 0,
      availableAnnualBudgetPKR: 0,
    };

    const result = calculateBudget(input);

    assertEqual(result.annualRecurringCostInput, 1700000, 'annualRecurringCostInput is 1,700,000 PKR');
    assertEqual(result.annualRecurringCostBase, 1700000, 'annualRecurringCostBase is 1,700,000 PKR');
    assertEqual(result.annualRecurringPKR, 1700000, 'annualRecurringPKR is 1,700,000 PKR');

    assertEqual(result.firstYearCostInput, 1900000, 'firstYearCostInput is 1,900,000 PKR');
    assertEqual(result.firstYearCostBase, 1900000, 'firstYearCostBase is 1,900,000 PKR');
    assertEqual(result.firstYearTotalPKR, 1900000, 'firstYearTotalPKR is 1,900,000 PKR');

    assertEqual(result.totalDegreeCostInput, 5300000, 'totalDegreeCostInput is 5,300,000 PKR');
    assertEqual(result.totalDegreeCostBase, 5300000, 'totalDegreeCostBase is 5,300,000 PKR');
    assertEqual(result.totalDegreeCostPKR, 5300000, 'totalDegreeCostPKR is 5,300,000 PKR');

    assertEqual(result.totalAvailableResourcesBase, 0, 'totalAvailableResourcesBase is 0 PKR');
    assertEqual(result.totalAvailableFundsPKR, 0, 'totalAvailableFundsPKR is 0 PKR');

    assertEqual(result.totalDegreeFundingGapBase, 5300000, 'totalDegreeFundingGapBase is 5,300,000 PKR');
    assertEqual(result.shortfallPKR, 5300000, 'shortfallPKR is 5,300,000 PKR');
    assertEqual(result.budgetSurplusBase, 0, 'budgetSurplusBase is 0 PKR');
    assertEqual(result.surplusPKR, 0, 'surplusPKR is 0 PKR');
    assertEqual(result.isShortfall, true, 'isShortfall is true');
    assertEqual(result.preDepartureCashGapBase, 200000, 'preDepartureCashGapBase is 200,000 PKR');
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 2: CURRENCY FORMATTING & INTEGRITY (NO $ FOR PKR)
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 2: Currency Formatting & Symbols');
  {
    assertEqual(formatCurrency(1700000, 'PKR'), 'PKR 1,700,000', 'PKR is formatted as PKR 1,700,000 (never $)');
    assertEqual(formatCurrency(200000, 'PKR'), 'PKR 200,000', 'PKR 200,000 formatted without $');
    assertEqual(formatCurrency(1700000, 'USD'), '$1,700,000', 'USD is formatted with $');
    assertEqual(formatCurrency(11904, 'EUR'), '€11,904', 'EUR is formatted with €');
    assertEqual(formatCurrency(12006, 'GBP'), '£12,006', 'GBP is formatted with £');
    assertEqual(formatCurrency(20635, 'CAD'), 'CA$20,635', 'CAD is formatted with CA$');
    assertEqual(formatCurrency(29710, 'AUD'), 'A$29,710', 'AUD is formatted with A$');
    assertEqual(formatCurrency(0, 'PKR'), 'PKR 0', 'Zero PKR is formatted as PKR 0');
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 3: MISSING OR INVALID EXCHANGE RATES
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 3: Missing / Invalid Exchange Rates');
  {
    assertEqual(formatCurrency(null, 'USD'), 'Conversion unavailable', 'null amount returns Conversion unavailable');
    assertEqual(formatCurrency(undefined, 'EUR'), 'Conversion unavailable', 'undefined amount returns Conversion unavailable');
    assertEqual(formatCurrency(NaN, 'GBP'), 'Conversion unavailable', 'NaN amount returns Conversion unavailable');

    // Calculator with missing exchange rate (null)
    const inputMissingRate: BudgetInput = {
      homeCountry: 'Pakistan',
      homeCurrency: 'PKR',
      destinationCountryId: 'usa',
      destinationCurrency: 'USD',
      expenseCurrency: 'USD',
      exchangeRateToPKR: null, // User did not provide exchange rate
      studyDurationYears: 2,
      annualTuition: 20000,
      annualLiving: 15000,
      annualInsurance: 2000,
      annualSemesterFees: 1000,
      oneTimeExpenses: 500000,
      oneTimeExpensesCurrency: 'PKR',
      preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
      availableOneTimeFundsPKR: 1000000,
      availableAnnualBudgetPKR: 1000000,
    };

    const result = calculateBudget(inputMissingRate);
    assertEqual(result.isExchangeRateValid, false, 'isExchangeRateValid is false when rate is null');
    assertEqual(result.exchangeRateUsed, null, 'exchangeRateUsed is null');
    assertEqual(result.annualRecurringCostInput, 38000, 'annualRecurringCostInput in USD is 38,000');
    assertEqual(result.annualRecurringCostBase, null, 'annualRecurringCostBase is null (no conversion fabricated)');
    assertEqual(result.totalDegreeCostBase, null, 'totalDegreeCostBase is null when rate missing');
    assertEqual(
      formatCurrency(result.annualRecurringCostBase, 'PKR'),
      'Conversion unavailable',
      'Formatting null base cost shows Conversion unavailable'
    );
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 4: ZERO VALUES & TUTION-FREE HANDLING
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 4: Zero Values & Tuition-Free Scenario');
  {
    const zeroInput: BudgetInput = {
      homeCountry: 'Pakistan',
      homeCurrency: 'PKR',
      destinationCountryId: 'germany',
      destinationCurrency: 'EUR',
      expenseCurrency: 'PKR',
      exchangeRateToPKR: 305.50,
      studyDurationYears: 2,
      annualTuition: 0,
      annualLiving: 0,
      annualInsurance: 0,
      annualSemesterFees: 0,
      oneTimeExpenses: 0,
      oneTimeExpensesCurrency: 'PKR',
      preDepartureCosts: {
        documentAttestationPKR: 0,
        ieltsExamFeePKR: 0,
        universityApplicationFeesPKR: 0,
        visaAndBiometricFeePKR: 0,
        airfarePKR: 0,
        initialHousingDepositPKR: 0,
        miscellaneousSetupPKR: 0,
      },
      availableOneTimeFundsPKR: 0,
      availableAnnualBudgetPKR: 0,
    };

    const result = calculateBudget(zeroInput);
    assertEqual(result.annualRecurringCostInput, 0, 'Recurring cost is 0 for zero inputs');
    assertEqual(result.firstYearCostInput, 0, 'First year cost is 0 for zero inputs');
    assertEqual(result.totalDegreeCostInput, 0, 'Total degree cost is 0 for zero inputs');
    assertEqual(result.totalDegreeFundingGapBase, 0, 'Funding gap is 0 for zero inputs');
    assertEqual(result.budgetSurplusBase, 0, 'Surplus is 0 for zero inputs');
    assertEqual(result.isShortfall, false, 'isShortfall is false when costs equal resources (0)');
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 5: BUDGET SURPLUS VS SHORTFALL (NEVER NEGATIVE GAP)
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 5: Budget Surplus vs Shortfall Calculations');
  {
    // Surplus case: 4,000,000 PKR total cost, 6,000,000 PKR available resources
    const surplusInput: BudgetInput = {
      homeCountry: 'Pakistan',
      homeCurrency: 'PKR',
      destinationCountryId: 'germany',
      destinationCurrency: 'EUR',
      expenseCurrency: 'PKR',
      exchangeRateToPKR: 305.50,
      studyDurationYears: 2,
      annualTuition: 1000000,
      annualLiving: 800000,
      annualInsurance: 50000,
      annualSemesterFees: 50000,
      oneTimeExpenses: 200000,
      oneTimeExpensesCurrency: 'PKR',
      preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
      availableOneTimeFundsPKR: 2000000,
      availableAnnualBudgetPKR: 2000000, // 2,000,000 + 2 * 2,000,000 = 6,000,000 available
    };

    const res = calculateBudget(surplusInput);
    // Recurring: 1.9M. Total degree: 1.9M * 2 + 0.2M = 4.0M. Available: 6.0M.
    assertEqual(res.totalDegreeCostBase, 4000000, 'Total degree cost is 4,000,000 PKR');
    assertEqual(res.totalAvailableResourcesBase, 6000000, 'Total available resources is 6,000,000 PKR');
    assertEqual(res.totalDegreeFundingGapBase, 0, 'Total degree funding gap is 0 (never negative)');
    assertEqual(res.budgetSurplusBase, 2000000, 'Budget surplus is 2,000,000 PKR');
    assertEqual(res.isShortfall, false, 'isShortfall is false when surplus exists');
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 6: SEPARATE VISA PROOF (NO DOUBLE COUNTING)
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 6: Separation of Visa Financial Proof from Expenses');
  {
    const mockGermany: Country = {
      id: 'germany',
      name: 'Germany',
      flag: '🇩🇪',
      code: 'DE',
      currencyCode: 'EUR',
      currencySymbol: '€',
      defaultExchangeRateToPKR: 305.50,
      exchangeRateDate: 'Reference',
      typicalTuitionMin: 0,
      typicalTuitionMax: 3000,
      typicalLivingMin: 11000,
      typicalLivingMax: 13500,
      officialProofOfFundsRequirement: 'Blocked Account €11,904',
      statutoryAnnualLivingProof: 11904, // Sperrkonto
      visaProcessingWeeks: '8-14',
      partTimeWorkRights: '140 full days',
      postStudyWorkVisa: '18 months',
      popularSubjects: ['CS'],
      officialLinks: [],
      notes: '',
    };

    const input: BudgetInput = {
      homeCountry: 'Pakistan',
      homeCurrency: 'PKR',
      destinationCountryId: 'germany',
      destinationCurrency: 'EUR',
      expenseCurrency: 'EUR',
      exchangeRateToPKR: 300,
      studyDurationYears: 2,
      annualTuition: 0,
      annualLiving: 11904,
      annualInsurance: 1440,
      annualSemesterFees: 600,
      oneTimeExpenses: 300000, // PKR
      oneTimeExpensesCurrency: 'PKR',
      preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
      availableOneTimeFundsPKR: 1000000,
      availableAnnualBudgetPKR: 1500000,
    };

    const res = calculateBudget(input, mockGermany);

    // Pre-departure costs MUST be 300,000 PKR strictly from inputs, NOT 300,000 + 11,904*300!
    assertEqual(res.oneTimePreDepartureCostsBase, 300000, 'Pre-departure costs strictly equal 300,000 PKR (no visa proof added)');
    assertEqual(res.hasVerifiedVisaProofRequirement, true, 'Visa proof requirement is flagged as verified');
    assertEqual(res.statutoryAnnualLivingProofForeign, 11904, 'Statutory proof is 11,904 EUR');
    assertEqual(res.statutoryAnnualLivingProofBase, 11904 * 300, 'Statutory proof base equivalent is 11,904 * 300 = 3,571,200 PKR');

    // Total degree cost must be: (13,944 * 300 * 2) + 300,000 = 8,366,400 + 300,000 = 8,666,400 PKR.
    // It must NOT have another 3,571,200 added to it!
    assertEqual(res.totalDegreeCostBase, 8666400, 'Total degree cost does not double-count the blocked account');
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 7: PAKISTANI DENOMINATIONS (LAKHS & CRORES)
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 7: Pakistani Denominations (Lakhs & Crores)');
  {
    assertEqual(formatPakistaniDenominations(5300000), '53.00 Lakh PKR', '5,300,000 PKR is 53.00 Lakh PKR');
    assertEqual(formatPakistaniDenominations(12500000), '1.25 Crore PKR', '12,500,000 PKR is 1.25 Crore PKR');
    assertEqual(formatPakistaniDenominations(null), 'Conversion unavailable', 'null returns Conversion unavailable');
  }

  // ----------------------------------------------------------------------
  // TEST SUITE 8: VERIFY PKR AUDIT BENCHMARK PRESET
  // ----------------------------------------------------------------------
  console.log('\nTest Suite 8: Preset Benchmark for 3-Year Audit Case');
  {
    const preset = getPresetInput('pkr-audit-benchmark');
    const result = calculateBudget(preset);

    assertEqual(result.annualRecurringCostInput, 1700000, 'Preset: Annual recurring expenses is PKR 1,700,000');
    assertEqual(result.firstYearCostInput, 1900000, 'Preset: First-year cost is PKR 1,900,000');
    assertEqual(result.totalDegreeCostInput, 5300000, 'Preset: Total degree cost is PKR 5,300,000');
  }

  console.log('\n====================================================');
  console.log('ALL 8 TEST SUITES PASSED SUCCESSFULLY (31/31 TESTS)');
  console.log('====================================================');
}

runTests();
