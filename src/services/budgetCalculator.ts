/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COUNTRIES_DATA } from '../data/countriesData';
import {
  BudgetCalculationResult,
  BudgetInput,
  Country,
  PreDepartureCosts,
} from '../types';

export const DEFAULT_PRE_DEPARTURE_PKR: PreDepartureCosts = {
  documentAttestationPKR: 45000, // HEC, IBCC, MOFA verification and translations
  ieltsExamFeePKR: 62000, // British Council / AEO IELTS Academic fee
  universityApplicationFeesPKR: 45000, // 2-3 university application portal fees (approx 150 EUR/USD)
  visaAndBiometricFeePKR: 40000, // Embassy visa & Gerry's / VFS appointment charges
  airfarePKR: 195000, // One-way international student airfare
  initialHousingDepositPKR: 150000, // Initial security deposit & advance rent
  miscellaneousSetupPKR: 60000, // SIM card, winter clothing, initial groceries
};

export const DEFAULT_BUDGET_INPUT: BudgetInput = {
  homeCountry: 'Pakistan',
  homeCurrency: 'PKR',
  destinationCountryId: 'germany',
  exchangeRateToPKR: 305.50,
  studyDurationYears: 2,
  annualTuitionForeign: 0,
  annualLivingForeign: 11904, // Official German Sperrkonto minimum requirement
  annualHealthInsuranceForeign: 1440, // German TK/AOK public student insurance (~120 EUR/mo)
  annualMiscellaneousForeign: 600, // Semester administrative contribution & student union fee
  preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
  availableAnnualBudgetPKR: 1200000, // PKR 1.2M annual family sponsorship/savings
  availableOneTimeFundsPKR: 3500000, // PKR 3.5M initial savings for blocked account/departure
};

/**
 * Format currency with international number standards
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'PKR',
  maxDecimals: number = 0
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  
  if (currencyCode === 'PKR') {
    // Show PKR with comma notation
    return `PKR ${Math.round(amount).toLocaleString('en-US')}`;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: maxDecimals,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toLocaleString('en-US', { maximumFractionDigits: maxDecimals })}`;
  }
}

/**
 * Convert PKR to Pakistani Lakhs and Crores for intuitive Pakistani family planning
 */
export function formatPakistaniDenominations(amountPKR: number): string {
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
 * Pure calculation logic for study abroad budgets.
 * Distinguishes one-time pre-departure expenses from annual recurring costs.
 */
export function calculateBudget(
  input: BudgetInput,
  countryData?: Country
): BudgetCalculationResult {
  const exchangeRate = Math.max(0.00001, input.exchangeRateToPKR || 1);
  const years = Math.max(1, Math.min(10, input.studyDurationYears || 1));

  // 1. Calculate One-Time Pre-Departure Costs (PKR base)
  const pre = input.preDepartureCosts || DEFAULT_PRE_DEPARTURE_PKR;
  const oneTimePreDeparturePKR =
    Number(pre.documentAttestationPKR || 0) +
    Number(pre.ieltsExamFeePKR || 0) +
    Number(pre.universityApplicationFeesPKR || 0) +
    Number(pre.visaAndBiometricFeePKR || 0) +
    Number(pre.airfarePKR || 0) +
    Number(pre.initialHousingDepositPKR || 0) +
    Number(pre.miscellaneousSetupPKR || 0);

  const oneTimePreDepartureForeign = oneTimePreDeparturePKR / exchangeRate;

  // 2. Calculate Annual Recurring Costs (Foreign currency base)
  const tuition = Number(input.annualTuitionForeign || 0);
  const living = Number(input.annualLivingForeign || 0);
  const insurance = Number(input.annualHealthInsuranceForeign || 0);
  const misc = Number(input.annualMiscellaneousForeign || 0);

  const annualRecurringForeign = tuition + living + insurance + misc;
  const annualRecurringPKR = annualRecurringForeign * exchangeRate;

  // 3. First-Year Total
  const firstYearTotalForeign = oneTimePreDepartureForeign + annualRecurringForeign;
  const firstYearTotalPKR = oneTimePreDeparturePKR + annualRecurringPKR;

  // 4. Total Degree Cost across selected duration
  const totalDegreeCostForeign = oneTimePreDepartureForeign + annualRecurringForeign * years;
  const totalDegreeCostPKR = oneTimePreDeparturePKR + annualRecurringPKR * years;

  // 5. Total Available Funds over the duration
  const oneTimeAvailable = Number(input.availableOneTimeFundsPKR || 0);
  const annualAvailable = Number(input.availableAnnualBudgetPKR || 0);
  const totalAvailableFundsPKR = oneTimeAvailable + annualAvailable * years;

  // 6. Net Balance and Shortfall / Surplus
  const netBalancePKR = totalAvailableFundsPKR - totalDegreeCostPKR;
  const isShortfall = netBalancePKR < 0;
  const shortfallPKR = isShortfall ? Math.abs(netBalancePKR) : 0;
  const surplusPKR = isShortfall ? 0 : netBalancePKR;

  // 7. First Year Cash Flow Gap
  const firstYearAvailablePKR = oneTimeAvailable + annualAvailable;
  const firstYearShortfallPKR = Math.max(0, firstYearTotalPKR - firstYearAvailablePKR);

  // 8. Estimated Needed Before Departure
  // For Germany: Blocked account (11,904 EUR) + Pre-departure PKR
  // For Canada: GIC (20,635 CAD) + 1st term tuition + Pre-departure
  // General: Pre-departure + min 6 months living / statutory requirement
  let estimatedBeforeDepartureNeededPKR = oneTimePreDeparturePKR;
  if (countryData && countryData.statutoryAnnualLivingProof > 0) {
    const statutoryFundInPKR = countryData.statutoryAnnualLivingProof * exchangeRate;
    estimatedBeforeDepartureNeededPKR += statutoryFundInPKR;
  } else {
    // Default: Pre-departure + 1st year living/initial deposit
    estimatedBeforeDepartureNeededPKR += (living + tuition * 0.5) * exchangeRate;
  }

  // 9. Itemized Breakdown for Visualization and Transparency
  const safeTotalPKR = Math.max(1, totalDegreeCostPKR);

  const breakdown = [
    {
      id: 'pre-departure',
      label: 'One-Time Pre-Departure Costs (Visa, IELTS, Airfare, Attestations)',
      amountForeign: oneTimePreDepartureForeign,
      amountPKR: oneTimePreDeparturePKR,
      category: 'one-time' as const,
      frequency: 'one-time' as const,
      percentageOfTotal: (oneTimePreDeparturePKR / safeTotalPKR) * 100,
    },
    {
      id: 'tuition',
      label: `Tuition Fees (${years} year${years > 1 ? 's' : ''})`,
      amountForeign: tuition * years,
      amountPKR: tuition * exchangeRate * years,
      category: 'recurring' as const,
      frequency: 'annual' as const,
      percentageOfTotal: ((tuition * exchangeRate * years) / safeTotalPKR) * 100,
    },
    {
      id: 'living',
      label: `Living Expenses & Rent (${years} year${years > 1 ? 's' : ''})`,
      amountForeign: living * years,
      amountPKR: living * exchangeRate * years,
      category: 'recurring' as const,
      frequency: 'annual' as const,
      percentageOfTotal: ((living * exchangeRate * years) / safeTotalPKR) * 100,
    },
    {
      id: 'health-insurance',
      label: `Health Insurance & Medical Coverage (${years} year${years > 1 ? 's' : ''})`,
      amountForeign: insurance * years,
      amountPKR: insurance * exchangeRate * years,
      category: 'recurring' as const,
      frequency: 'annual' as const,
      percentageOfTotal: ((insurance * exchangeRate * years) / safeTotalPKR) * 100,
    },
    {
      id: 'miscellaneous',
      label: `Semester Contributions & Supplies (${years} year${years > 1 ? 's' : ''})`,
      amountForeign: misc * years,
      amountPKR: misc * exchangeRate * years,
      category: 'recurring' as const,
      frequency: 'annual' as const,
      percentageOfTotal: ((misc * exchangeRate * years) / safeTotalPKR) * 100,
    },
  ];

  return {
    oneTimePreDeparturePKR,
    oneTimePreDepartureForeign,
    annualRecurringForeign,
    annualRecurringPKR,
    firstYearTotalForeign,
    firstYearTotalPKR,
    totalDegreeCostForeign,
    totalDegreeCostPKR,
    totalAvailableFundsPKR,
    netBalancePKR,
    isShortfall,
    shortfallPKR,
    surplusPKR,
    firstYearShortfallPKR,
    estimatedBeforeDepartureNeededPKR,
    exchangeRateUsed: exchangeRate,
    destinationCurrencyCode: countryData ? countryData.currencyCode : 'USD',
    breakdown,
    annualExpensesBreakdown: {
      tuitionPKR: tuition * exchangeRate,
      livingPKR: living * exchangeRate,
      insurancePKR: insurance * exchangeRate,
      miscPKR: misc * exchangeRate,
    },
  };
}

/**
 * Pre-configured presets for popular study abroad scenarios
 */
export function getPresetInput(presetId: string): BudgetInput {
  switch (presetId) {
    case 'germany-master':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'germany',
        exchangeRateToPKR: 305.50,
        studyDurationYears: 2,
        annualTuitionForeign: 0, // Public university tuition-free
        annualLivingForeign: 11904, // Blocked Account requirement
        annualHealthInsuranceForeign: 1440,
        annualMiscellaneousForeign: 600, // Semester ticket & admin fee
        preDepartureCosts: { ...DEFAULT_PRE_DEPARTURE_PKR },
        availableAnnualBudgetPKR: 1200000,
        availableOneTimeFundsPKR: 3800000,
      };

    case 'usa-stem-master':
      return {
        homeCountry: 'Pakistan',
        homeCurrency: 'PKR',
        destinationCountryId: 'usa',
        exchangeRateToPKR: 279.50,
        studyDurationYears: 2,
        annualTuitionForeign: 26000,
        annualLivingForeign: 15500,
        annualHealthInsuranceForeign: 2400,
        annualMiscellaneousForeign: 1200,
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          ieltsExamFeePKR: 62000,
          universityApplicationFeesPKR: 90000, // Higher US app fees ($85-$125 each)
          visaAndBiometricFeePKR: 130000, // F-1 Visa ($185) + SEVIS I-901 fee ($350)
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
        exchangeRateToPKR: 355.00,
        studyDurationYears: 1, // 1-Year UK Master's
        annualTuitionForeign: 19500,
        annualLivingForeign: 12006, // UKVI outside London living proof
        annualHealthInsuranceForeign: 776, // Immigration Health Surcharge (IHS) £776/yr
        annualMiscellaneousForeign: 800,
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          visaAndBiometricFeePKR: 175000, // UK Student visa fee £490 + biometric appointment
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
        exchangeRateToPKR: 203.20,
        studyDurationYears: 2,
        annualTuitionForeign: 21000,
        annualLivingForeign: 20635, // Mandatory IRCC living proof standard
        annualHealthInsuranceForeign: 950,
        annualMiscellaneousForeign: 1000,
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          visaAndBiometricFeePKR: 50000, // Study permit $150 CAD + Biometrics $85 CAD
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
        exchangeRateToPKR: 279.50,
        studyDurationYears: 2,
        annualTuitionForeign: 6500,
        annualLivingForeign: 8000,
        annualHealthInsuranceForeign: 650,
        annualMiscellaneousForeign: 500,
        preDepartureCosts: {
          ...DEFAULT_PRE_DEPARTURE_PKR,
          airfarePKR: 220000,
        },
        availableAnnualBudgetPKR: 1000000,
        availableOneTimeFundsPKR: 2800000,
      };

    default:
      return DEFAULT_BUDGET_INPUT;
  }
}
