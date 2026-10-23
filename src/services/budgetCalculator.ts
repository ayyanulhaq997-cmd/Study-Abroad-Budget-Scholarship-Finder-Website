/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COUNTRIES_DATA } from '../data/countriesData';
import {
  BreakdownItem,
  BudgetCalculationResult,
  BudgetInput,
  Country,
  PreDepartureCosts,
} from '../types';

export const DEFAULT_PRE_DEPARTURE_PKR: PreDepartureCosts = {
  documentAttestationPKR: 45000, // HEC, IBCC, MOFA verification and translations
  ieltsExamFeePKR: 62000, // British Council / AEO IELTS Academic fee
  universityApplicationFeesPKR: 45000, // University application portal fees
  visaAndBiometricFeePKR: 40000, // Embassy visa & appointment charges
  airfarePKR: 195000, // One-way international student airfare
  initialHousingDepositPKR: 150000, // Initial security deposit & advance rent
  miscellaneousSetupPKR: 60000, // SIM card, winter clothing, initial groceries
};

export const DEFAULT_PRE_DEPARTURE_TOTAL_PKR = Object.values(DEFAULT_PRE_DEPARTURE_PKR).reduce(
  (sum, val) => sum + val,
  0
);

export const DEFAULT_BUDGET_INPUT: BudgetInput = {
  homeCountry: 'Pakistan',
  homeCurrency: 'PKR',
  destinationCountryId: 'germany',
  destinationCurrency: 'EUR',
  expenseCurrency: 'EUR',
  exchangeRateToPKR: 305.50,
  isExchangeRateUserProvided: false,
  studyDurationYears: 2,
  intendedDegreeLevel: 'Master',
  annualTuition: 0,
  annualLiving: 11904, // Official German Sperrkonto minimum requirement
  annualInsurance: 1440, // Public student health insurance
  annualSemesterFees: 600, // Mandatory semester contribution (Semesterbeitrag)
  oneTimeExpenses: DEFAULT_PRE_DEPARTURE_TOTAL_PKR,
  oneTimeExpensesCurrency: 'PKR',
  preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
  availableAnnualBudgetPKR: 1200000, // PKR 1.2M annual family sponsorship
  availableOneTimeFundsPKR: 3500000, // PKR 3.5M initial savings for departure
  // Legacy aliases
  annualTuitionForeign: 0,
  annualLivingForeign: 11904,
  annualHealthInsuranceForeign: 1440,
  annualMiscellaneousForeign: 600,
};

/**
 * Format currency with international number standards.
 * Guaranteed rules:
 * - Never returns fabricated equivalents when amount is null/undefined/NaN.
 * - Never labels PKR with a dollar sign.
 * - Formats with clean standard currency symbols and rounding.
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string = 'PKR',
  maxDecimals: number = 0
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Conversion unavailable';
  }

  const code = (currencyCode || 'PKR').toUpperCase().trim();

  // Strict PKR handling: NEVER format PKR with a dollar sign
  if (code === 'PKR') {
    return `PKR ${Math.round(amount).toLocaleString('en-US')}`;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: maxDecimals,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString('en-US', { maximumFractionDigits: maxDecimals })}`;
  }
}

/**
 * Convert PKR to Pakistani Lakhs and Crores for intuitive Pakistani family planning.
 */
export function formatPakistaniDenominations(amountPKR: number | null | undefined): string {
  if (amountPKR === null || amountPKR === undefined || isNaN(amountPKR)) {
    return 'Conversion unavailable';
  }
  const abs = Math.abs(amountPKR);
  if (abs >= 10000000) {
    const crores = (amountPKR / 10000000).toFixed(2);
    return `${crores} Crore PKR`;
  } else if (abs >= 100000) {
    const lakhs = (amountPKR / 100000).toFixed(2);
    return `${lakhs} Lakh PKR`;
  }
  return `PKR ${Math.round(amountPKR).toLocaleString('en-US')}`;
}

/**
 * Calculate the total of itemized pre-departure costs.
 */
export function sumItemizedPreDeparture(pre: PreDepartureCosts): number {
  if (!pre) return 0;
  const safe = (val: any) => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num) && num > 0 ? num : 0;
  };
  return (
    safe(pre.documentAttestationPKR) +
    safe(pre.ieltsExamFeePKR) +
    safe(pre.universityApplicationFeesPKR) +
    safe(pre.visaAndBiometricFeePKR) +
    safe(pre.airfarePKR) +
    safe(pre.initialHousingDepositPKR) +
    safe(pre.miscellaneousSetupPKR)
  );
}

/**
 * Pure calculation logic for study abroad budgets.
 * 
 * Strict Formulas Enforced:
 * 1. annualRecurringCost = annualTuition + annualLiving + annualInsurance + annualSemesterFees
 * 2. firstYearCost = annualRecurringCost + oneTimePreDepartureCosts
 * 3. totalDegreeCost = (annualRecurringCost * studyDurationYears) + oneTimePreDepartureCosts
 * 4. totalAvailableResources = availableOneTimeFunds + (annualSponsorship * studyDurationYears)
 * 5. totalDegreeFundingGap = max(0, totalDegreeCost - totalAvailableResources)
 * 6. budgetSurplus = max(0, totalAvailableResources - totalDegreeCost)
 * 
 * Invariants:
 * - Pre-departure expenses are calculated strictly from actual itemized inputs.
 * - Visa financial proof (such as blocked accounts) is NEVER added to total expenses;
 *   it is displayed separately as evidence of funds to prevent double-counting.
 * - Missing or invalid exchange rates return null ("Conversion unavailable") rather than
 *   assuming 1 PKR = 1 USD or fabricating numbers.
 * - Never show a negative number labelled as a positive funding gap.
 */
export function calculateBudget(
  input: BudgetInput,
  countryData?: Country
): BudgetCalculationResult {
  const baseCurrency = input.homeCurrency || 'PKR';
  const destinationCurrency = countryData?.currencyCode || input.destinationCurrency || 'USD';
  const inputExpenseCurrency = input.expenseCurrency || destinationCurrency;

  // Validate exchange rate:
  // Rate expresses: 1 Destination Currency = X Base Currency (PKR)
  const rawRate = input.exchangeRateToPKR;
  const isExchangeRateValid =
    typeof rawRate === 'number' && !isNaN(rawRate) && rawRate > 0 && isFinite(rawRate);
  const exchangeRateUsed = isExchangeRateValid ? rawRate : null;

  const years = Math.max(1, Math.min(10, input.studyDurationYears || 1));

  // 1. Resolve Annual Inputs (Tuition, Living, Insurance, Semester Fees)
  const safeNumber = (val: any, fallback: number = 0): number => {
    const num = Number(val !== undefined && val !== null ? val : fallback);
    return !isNaN(num) && isFinite(num) && num > 0 ? num : 0;
  };

  const tuition = safeNumber(
    input.annualTuition !== undefined ? input.annualTuition : input.annualTuitionForeign,
    0
  );
  const living = safeNumber(
    input.annualLiving !== undefined ? input.annualLiving : input.annualLivingForeign,
    0
  );
  const insurance = safeNumber(
    input.annualInsurance !== undefined
      ? input.annualInsurance
      : input.annualHealthInsuranceForeign,
    0
  );
  const semesterFees = safeNumber(
    input.annualSemesterFees !== undefined
      ? input.annualSemesterFees
      : input.annualMiscellaneousForeign,
    0
  );

  // Core Rule 1: annualRecurringCost = annualTuition + annualLiving + annualInsurance + annualSemesterFees
  const annualRecurringCostInput = tuition + living + insurance + semesterFees;

  // Convert annual recurring costs
  let annualRecurringCostBase: number | null = null;
  let annualRecurringCostForeign: number | null = null;

  if (inputExpenseCurrency === baseCurrency) {
    // Inputs were entered directly in Base Currency (PKR)
    annualRecurringCostBase = annualRecurringCostInput;
    if (baseCurrency === destinationCurrency) {
      annualRecurringCostForeign = annualRecurringCostInput;
    } else if (isExchangeRateValid && exchangeRateUsed) {
      annualRecurringCostForeign = annualRecurringCostInput / exchangeRateUsed;
    } else {
      annualRecurringCostForeign = null; // Conversion unavailable
    }
  } else if (inputExpenseCurrency === destinationCurrency) {
    // Inputs were entered in Destination Currency (e.g. EUR, USD, GBP, CAD, AUD)
    annualRecurringCostForeign = annualRecurringCostInput;
    if (isExchangeRateValid && exchangeRateUsed) {
      annualRecurringCostBase = annualRecurringCostInput * exchangeRateUsed;
    } else {
      annualRecurringCostBase = null; // Conversion unavailable
    }
  } else {
    // Generic currency fallback
    annualRecurringCostBase = null;
    annualRecurringCostForeign = null;
  }

  // 2. Resolve One-Time Pre-Departure Costs
  // Itemized breakdown sum in base currency (PKR)
  const itemizedSum = sumItemizedPreDeparture(input.preDepartureCosts);
  let oneTimePreDepartureCostsBase = 0;
  if (input.oneTimeExpenses !== undefined && input.oneTimeExpenses !== null) {
    oneTimePreDepartureCostsBase = Number(input.oneTimeExpenses);
  } else {
    oneTimePreDepartureCostsBase = itemizedSum;
  }

  const oneTimePreDepartureCostsInput = oneTimePreDepartureCostsBase;
  let oneTimePreDepartureCostsForeign: number | null = null;
  if (baseCurrency === destinationCurrency) {
    oneTimePreDepartureCostsForeign = oneTimePreDepartureCostsBase;
  } else if (isExchangeRateValid && exchangeRateUsed) {
    oneTimePreDepartureCostsForeign = oneTimePreDepartureCostsBase / exchangeRateUsed;
  } else {
    oneTimePreDepartureCostsForeign = null;
  }

  // 3. Core Rule 2: firstYearCost = annualRecurringCost + oneTimePreDepartureCosts
  let firstYearCostBase: number | null = null;
  let firstYearCostForeign: number | null = null;
  let firstYearCostInput = annualRecurringCostInput;

  if (inputExpenseCurrency === baseCurrency) {
    firstYearCostInput = annualRecurringCostInput + oneTimePreDepartureCostsBase;
    firstYearCostBase = firstYearCostInput;
    if (isExchangeRateValid && exchangeRateUsed) {
      firstYearCostForeign = firstYearCostBase / exchangeRateUsed;
    } else if (baseCurrency === destinationCurrency) {
      firstYearCostForeign = firstYearCostBase;
    } else {
      firstYearCostForeign = null;
    }
  } else {
    // Input is in destination currency
    if (oneTimePreDepartureCostsForeign !== null) {
      firstYearCostInput = annualRecurringCostInput + oneTimePreDepartureCostsForeign;
      firstYearCostForeign = firstYearCostInput;
    } else {
      firstYearCostForeign = null;
    }
    if (annualRecurringCostBase !== null) {
      firstYearCostBase = annualRecurringCostBase + oneTimePreDepartureCostsBase;
    } else {
      firstYearCostBase = null;
    }
  }

  // 4. Core Rule 3: totalDegreeCost = (annualRecurringCost * studyDurationYears) + oneTimePreDepartureCosts
  let totalDegreeCostBase: number | null = null;
  let totalDegreeCostForeign: number | null = null;
  let totalDegreeCostInput = annualRecurringCostInput * years;

  if (inputExpenseCurrency === baseCurrency) {
    totalDegreeCostInput = annualRecurringCostInput * years + oneTimePreDepartureCostsBase;
    totalDegreeCostBase = totalDegreeCostInput;
    if (isExchangeRateValid && exchangeRateUsed) {
      totalDegreeCostForeign = totalDegreeCostBase / exchangeRateUsed;
    } else if (baseCurrency === destinationCurrency) {
      totalDegreeCostForeign = totalDegreeCostBase;
    } else {
      totalDegreeCostForeign = null;
    }
  } else {
    if (oneTimePreDepartureCostsForeign !== null) {
      totalDegreeCostInput = annualRecurringCostInput * years + oneTimePreDepartureCostsForeign;
      totalDegreeCostForeign = totalDegreeCostInput;
    } else {
      totalDegreeCostForeign = null;
    }
    if (annualRecurringCostBase !== null) {
      totalDegreeCostBase = annualRecurringCostBase * years + oneTimePreDepartureCostsBase;
    } else {
      totalDegreeCostBase = null;
    }
  }

  // 5. Core Rule 4: Total available resources = available one-time funds + (annual sponsorship * studyDurationYears)
  const oneTimeAvailable = safeNumber(input.availableOneTimeFundsPKR, 0);
  const annualAvailable = safeNumber(input.availableAnnualBudgetPKR, 0);
  const totalAvailableResourcesBase = oneTimeAvailable + annualAvailable * years;
  const cashAvailableBeforeDepartureBase = oneTimeAvailable;

  // 6. Core Rule 5: Funding Gap & Surplus
  // Total degree funding gap = max(0, total degree cost - total available resources)
  const effectiveTotalCostBase = totalDegreeCostBase !== null ? totalDegreeCostBase : 0;
  const rawGapBase = effectiveTotalCostBase - totalAvailableResourcesBase;

  const totalDegreeFundingGapBase = Math.max(0, rawGapBase);
  const budgetSurplusBase = Math.max(0, -rawGapBase);
  const isShortfall = rawGapBase > 0;

  // Pre-departure cash gap: cash needed before boarding vs available one-time savings
  const preDepartureCashGapBase = Math.max(0, oneTimePreDepartureCostsBase - cashAvailableBeforeDepartureBase);
  const firstYearAvailableBase = oneTimeAvailable + annualAvailable;
  const firstYearCostBaseSafe = firstYearCostBase !== null ? firstYearCostBase : 0;
  const firstYearShortfallBase = Math.max(0, firstYearCostBaseSafe - firstYearAvailableBase);

  // 7. Core Rule 6: Separate Visa Financial Proof (evidence of funds, NOT added to degree cost)
  const hasVerifiedVisaProofRequirement = Boolean(
    countryData &&
      countryData.statutoryAnnualLivingProof !== null &&
      countryData.statutoryAnnualLivingProof !== undefined &&
      countryData.statutoryAnnualLivingProof > 0
  );
  const statutoryAnnualLivingProofForeign = hasVerifiedVisaProofRequirement && countryData?.statutoryAnnualLivingProof !== null
    ? countryData!.statutoryAnnualLivingProof!
    : null;
  const statutoryAnnualLivingProofBase =
    hasVerifiedVisaProofRequirement && isExchangeRateValid && exchangeRateUsed && countryData?.statutoryAnnualLivingProof != null
      ? countryData.statutoryAnnualLivingProof * exchangeRateUsed
      : null;
  const statutoryProofDescription = hasVerifiedVisaProofRequirement
    ? countryData!.officialProofOfFundsRequirement
    : null;

  // 8. Visible Calculation Assumptions Notice
  const calculationAssumptionNotice =
    'These formulas assume constant annual expenses and one-time pre-departure costs charged once.';

  // 9. Itemized Breakdown
  const safeTotalPKR = Math.max(1, effectiveTotalCostBase);
  const tuitionBase =
    inputExpenseCurrency === baseCurrency
      ? tuition
      : isExchangeRateValid && exchangeRateUsed
      ? tuition * exchangeRateUsed
      : null;
  const livingBase =
    inputExpenseCurrency === baseCurrency
      ? living
      : isExchangeRateValid && exchangeRateUsed
      ? living * exchangeRateUsed
      : null;
  const insuranceBase =
    inputExpenseCurrency === baseCurrency
      ? insurance
      : isExchangeRateValid && exchangeRateUsed
      ? insurance * exchangeRateUsed
      : null;
  const semesterFeesBase =
    inputExpenseCurrency === baseCurrency
      ? semesterFees
      : isExchangeRateValid && exchangeRateUsed
      ? semesterFees * exchangeRateUsed
      : null;

  const breakdown: BreakdownItem[] = [
    {
      id: 'pre-departure',
      label: 'One-Time Pre-Departure Costs (Visa, IELTS, Airfare, Attestations)',
      amountInputCurrency: oneTimePreDepartureCostsBase,
      inputCurrency: baseCurrency,
      amountForeign: oneTimePreDepartureCostsForeign,
      foreignCurrency: destinationCurrency,
      amountPKR: oneTimePreDepartureCostsBase,
      category: 'one-time',
      frequency: 'one-time',
      percentageOfTotal: (oneTimePreDepartureCostsBase / safeTotalPKR) * 100,
    },
    {
      id: 'tuition',
      label: `Tuition Fees (${years} year${years > 1 ? 's' : ''})`,
      amountInputCurrency: tuition * years,
      inputCurrency: inputExpenseCurrency,
      amountForeign:
        inputExpenseCurrency === destinationCurrency
          ? tuition * years
          : isExchangeRateValid && exchangeRateUsed
          ? (tuition * years) / exchangeRateUsed
          : null,
      foreignCurrency: destinationCurrency,
      amountPKR: tuitionBase !== null ? tuitionBase * years : null,
      category: 'recurring',
      frequency: 'annual',
      percentageOfTotal:
        tuitionBase !== null ? ((tuitionBase * years) / safeTotalPKR) * 100 : 0,
    },
    {
      id: 'living',
      label: `Living Expenses & Rent (${years} year${years > 1 ? 's' : ''})`,
      amountInputCurrency: living * years,
      inputCurrency: inputExpenseCurrency,
      amountForeign:
        inputExpenseCurrency === destinationCurrency
          ? living * years
          : isExchangeRateValid && exchangeRateUsed
          ? (living * years) / exchangeRateUsed
          : null,
      foreignCurrency: destinationCurrency,
      amountPKR: livingBase !== null ? livingBase * years : null,
      category: 'recurring',
      frequency: 'annual',
      percentageOfTotal:
        livingBase !== null ? ((livingBase * years) / safeTotalPKR) * 100 : 0,
    },
    {
      id: 'health-insurance',
      label: `Health Insurance & Medical Coverage (${years} year${years > 1 ? 's' : ''})`,
      amountInputCurrency: insurance * years,
      inputCurrency: inputExpenseCurrency,
      amountForeign:
        inputExpenseCurrency === destinationCurrency
          ? insurance * years
          : isExchangeRateValid && exchangeRateUsed
          ? (insurance * years) / exchangeRateUsed
          : null,
      foreignCurrency: destinationCurrency,
      amountPKR: insuranceBase !== null ? insuranceBase * years : null,
      category: 'recurring',
      frequency: 'annual',
      percentageOfTotal:
        insuranceBase !== null ? ((insuranceBase * years) / safeTotalPKR) * 100 : 0,
    },
    {
      id: 'semester-fees',
      label: `Semester Fees & Administrative Contributions (${years} year${years > 1 ? 's' : ''})`,
      amountInputCurrency: semesterFees * years,
      inputCurrency: inputExpenseCurrency,
      amountForeign:
        inputExpenseCurrency === destinationCurrency
          ? semesterFees * years
          : isExchangeRateValid && exchangeRateUsed
          ? (semesterFees * years) / exchangeRateUsed
          : null,
      foreignCurrency: destinationCurrency,
      amountPKR: semesterFeesBase !== null ? semesterFeesBase * years : null,
      category: 'recurring',
      frequency: 'annual',
      percentageOfTotal:
        semesterFeesBase !== null ? ((semesterFeesBase * years) / safeTotalPKR) * 100 : 0,
    },
  ];

  return {
    inputExpenseCurrency,
    baseCurrency,
    destinationCurrency,
    exchangeRateUsed,
    isExchangeRateValid,

    annualRecurringCostInput,
    annualRecurringCostBase,
    annualRecurringCostForeign,

    firstYearCostInput,
    firstYearCostBase,
    firstYearCostForeign,

    totalDegreeCostInput,
    totalDegreeCostBase,
    totalDegreeCostForeign,

    oneTimePreDepartureCostsInput,
    oneTimePreDepartureCostsBase,
    oneTimePreDepartureCostsForeign,

    totalAvailableResourcesBase,
    cashAvailableBeforeDepartureBase,
    preDepartureCashGapBase,

    totalDegreeFundingGapBase,
    budgetSurplusBase,
    isShortfall,

    hasVerifiedVisaProofRequirement,
    statutoryAnnualLivingProofForeign,
    statutoryAnnualLivingProofBase,
    statutoryProofDescription,

    calculationAssumptionNotice,
    breakdown,

    // Backward compatibility mappings
    oneTimePreDeparturePKR: oneTimePreDepartureCostsBase,
    oneTimePreDepartureForeign: oneTimePreDepartureCostsForeign,
    annualRecurringForeign: annualRecurringCostForeign,
    annualRecurringPKR: annualRecurringCostBase !== null ? annualRecurringCostBase : annualRecurringCostInput,
    firstYearTotalForeign: firstYearCostForeign,
    firstYearTotalPKR: firstYearCostBase !== null ? firstYearCostBase : firstYearCostInput,
    totalDegreeCostPKR: totalDegreeCostBase !== null ? totalDegreeCostBase : totalDegreeCostInput,
    totalAvailableFundsPKR: totalAvailableResourcesBase,
    netBalancePKR: -rawGapBase,
    shortfallPKR: totalDegreeFundingGapBase,
    surplusPKR: budgetSurplusBase,
    firstYearShortfallPKR: firstYearShortfallBase,
    estimatedBeforeDepartureNeededPKR: oneTimePreDepartureCostsBase,
    destinationCurrencyCode: destinationCurrency,
    annualExpensesBreakdown: {
      tuitionPKR: tuitionBase,
      livingPKR: livingBase,
      insurancePKR: insuranceBase,
      miscPKR: semesterFeesBase,
    },
  };
}

/**
 * Pre-configured presets for popular study abroad scenarios.
 * Values explicitly reflect verified country baselines.
 */
export function getPresetInput(presetId: string): BudgetInput {
  switch (presetId) {
    case 'germany-master':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'germany',
        destinationCurrency: 'EUR',
        expenseCurrency: 'EUR',
        exchangeRateToPKR: 305.50,
        isExchangeRateUserProvided: false,
        studyDurationYears: 2,
        annualTuition: 0, // Public university tuition-free (excluding Baden-Württemberg & TUM)
        annualLiving: 11904, // Official German Sperrkonto annual minimum (€992/mo)
        annualInsurance: 1440, // German TK/AOK student health insurance
        annualSemesterFees: 600, // Mandatory semester contribution (Semesterbeitrag)
        oneTimeExpenses: DEFAULT_PRE_DEPARTURE_TOTAL_PKR,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
        availableAnnualBudgetPKR: 1200000,
        availableOneTimeFundsPKR: 3800000,
      };

    case 'usa-stem-master':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'usa',
        destinationCurrency: 'USD',
        expenseCurrency: 'USD',
        exchangeRateToPKR: 279.50,
        isExchangeRateUserProvided: false,
        studyDurationYears: 2,
        annualTuition: 26000,
        annualLiving: 15500,
        annualInsurance: 2400,
        annualSemesterFees: 1200,
        oneTimeExpenses: 650000,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          ieltsExamFeePKR: 62000,
          universityApplicationFeesPKR: 90000,
          visaAndBiometricFeePKR: 130000, // F-1 Visa + SEVIS I-901 fee
          airfarePKR: 280000,
        },
        availableAnnualBudgetPKR: 2500000,
        availableOneTimeFundsPKR: 8000000,
      };

    case 'uk-one-year-msc':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'uk',
        destinationCurrency: 'GBP',
        expenseCurrency: 'GBP',
        exchangeRateToPKR: 355.00,
        isExchangeRateUserProvided: false,
        studyDurationYears: 1, // 1-Year UK Master's
        annualTuition: 19500,
        annualLiving: 10539, // UKVI outside London living statutory benchmark (£1,171/mo × 9)
        annualInsurance: 776, // Immigration Health Surcharge (IHS) £776/yr
        annualSemesterFees: 800,
        oneTimeExpenses: 630000,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          visaAndBiometricFeePKR: 175000,
          airfarePKR: 210000,
        },
        availableAnnualBudgetPKR: 3000000,
        availableOneTimeFundsPKR: 7000000,
      };

    case 'canada-master':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'canada',
        destinationCurrency: 'CAD',
        expenseCurrency: 'CAD',
        exchangeRateToPKR: 203.20,
        isExchangeRateUserProvided: false,
        studyDurationYears: 2,
        annualTuition: 21000,
        annualLiving: 23448, // IRCC statutory living-funds threshold (effective 1 Sept 2026 outside Quebec)
        annualInsurance: 950,
        annualSemesterFees: 1000,
        oneTimeExpenses: 590000,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          visaAndBiometricFeePKR: 50000,
          airfarePKR: 290000,
        },
        availableAnnualBudgetPKR: 2000000,
        availableOneTimeFundsPKR: 6000000,
      };

    case 'korea-stem-master':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'south-korea',
        destinationCurrency: 'KRW',
        expenseCurrency: 'KRW',
        exchangeRateToPKR: 0.208,
        isExchangeRateUserProvided: false,
        studyDurationYears: 2,
        annualTuition: 5400000, // ₩5,400,000 KRW (≈ PKR 1,123,200 at 0.208)
        annualLiving: 9600000, // ₩9,600,000 KRW typical living (₩800k/mo); visa proof is CoA-dependent
        annualInsurance: 800000,
        annualSemesterFees: 400000,
        oneTimeExpenses: 450000,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          airfarePKR: 200000,
        },
        availableAnnualBudgetPKR: 1500000,
        availableOneTimeFundsPKR: 4500000,
      };

    case 'pkr-audit-benchmark':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'germany',
        destinationCurrency: 'EUR',
        expenseCurrency: 'PKR',
        exchangeRateToPKR: 305.50,
        isExchangeRateUserProvided: false,
        studyDurationYears: 3,
        annualTuition: 1000000,
        annualLiving: 600000,
        annualInsurance: 50000,
        annualSemesterFees: 50000,
        oneTimeExpenses: 200000,
        oneTimeExpensesCurrency: 'PKR',
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          airfarePKR: 100000,
          initialHousingDepositPKR: 50000,
          miscellaneousSetupPKR: 50000,
        },
        availableAnnualBudgetPKR: 0,
        availableOneTimeFundsPKR: 0,
      };

    default:
      return DEFAULT_BUDGET_INPUT;
  }
}
