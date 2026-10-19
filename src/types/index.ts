/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DegreeLevel = 'Bachelor' | 'Master' | 'PhD' | 'Doctoral' | 'Any';

export type FundingType = 'Full Funding' | 'Partial Funding' | 'Tuition Waiver';

export type SubjectCategory =
  | 'All Subjects'
  | 'Computer Science & AI'
  | 'Engineering & Technology'
  | 'Business, Economics & Finance'
  | 'Natural & Applied Sciences'
  | 'Health Sciences & Medicine'
  | 'Social Sciences & Humanities';

export interface OfficialLink {
  title: string;
  url: string;
  sourceType: 'Government' | 'University' | 'Official Agency';
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  code: string;
  currencyCode: string;
  currencySymbol: string;
  defaultExchangeRateToPKR: number; // e.g. 1 EUR = 305 PKR (user can edit)
  exchangeRateDate: string;
  typicalTuitionMin: number; // in local currency
  typicalTuitionMax: number;
  typicalLivingMin: number; // actual estimated living
  typicalLivingMax: number;
  officialProofOfFundsRequirement: string;
  statutoryAnnualLivingProof: number; // statutory baseline benchmark (e.g. Germany €11,904, Canada CAD $23,448)
  statutoryLivingProofLondon?: number; // £13,761 for UK
  statutoryLivingProofNonLondon?: number; // £10,539 for UK
  statutoryProofDetails?: string;
  visaProcessingWeeks: string;
  partTimeWorkRights: string;
  workRightsOfficialSource?: string;
  postStudyWorkVisa: string;
  postStudyOfficialSource?: string;
  popularSubjects: string[];
  officialLinks: OfficialLink[];
  notes: string;
  lastVerifiedDate: string;
  officialSourceUrl: string;
}

export type ProgramStatus =
  | 'Applications Open'
  | 'Course-Specific Deadlines'
  | 'Awaiting Announcement'
  | 'Closed'
  | 'Discontinued'
  | 'Not Yet Verified'
  | 'Active';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  hostCountries: string[]; // e.g. ["Germany"], ["United Kingdom"], or ["Multiple"]
  degreeLevels: DegreeLevel[];
  subjectAreas: SubjectCategory[];
  fundingType: FundingType;
  minAcademicPercentage: number; // e.g. 70 for 70% or equivalent 2.8+ CGPA
  minIeltsScore: number; // 0 if not strictly set
  requiresWorkExperience: boolean;
  workExperienceYearsNeeded?: number;
  applicationDeadlineNotice: string;
  officialUrl: string;
  lastVerifiedDate: string;
  isVerified: boolean;
  programStatus?: ProgramStatus;
  statusDetails?: string;
  replacementProgramName?: string;
  replacementProgramSummary?: string;
  replacementProgramUrl?: string;
  benefitsSummary: string;
  eligibilityRequirements: string[];
  notesForPakistaniStudents?: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  currencyCode: string;
  currencySymbol: string;
  feeAcademicYear: string; // Specific academic year (e.g. '2025/2026 Academic Year')
  feeProgramScope: string; // Specific program / degree tier (e.g. 'Non-EU Graduate Master\'s / Engineering')
  typicalAnnualTuitionMin: number | null; // null if unknown/variable
  typicalAnnualTuitionMax: number | null;
  tuitionNote: string;
  estimatedCityLivingAnnual: number;
  officialFeeScheduleUrl: string; // Direct link to official tuition fee schedule
  institutionalScholarships: string[]; // Exclusively university-funded / internally administered awards
  externalFundingOpportunities: string[]; // External / Government-sponsored opportunities (never described as university-funded)
  popularPrograms: string[];
  admissionRequirementsSummary: string;
  officialAdmissionsUrl: string;
  lastVerifiedDate: string;
  knownScholarships?: string[]; // Backwards compatibility alias
}

export interface PreDepartureCosts {
  documentAttestationPKR: number; // HEC, IBCC, MOFA
  ieltsExamFeePKR: number;
  universityApplicationFeesPKR: number;
  visaAndBiometricFeePKR: number;
  airfarePKR: number;
  initialHousingDepositPKR: number;
  miscellaneousSetupPKR: number;
}

export interface BudgetInput {
  homeCountry: string;
  homeCurrency: string; // e.g. 'PKR'
  destinationCountryId: string;
  destinationCurrency?: string;
  expenseCurrency: string; // The currency in which annual expenses are specified ('PKR' or destination currency)
  exchangeRateToPKR: number | null; // e.g. 1 Destination Currency = X PKR. null or <= 0 means conversion unavailable
  isExchangeRateUserProvided?: boolean;
  studyDurationYears: number;
  annualTuition: number;
  annualLiving: number;
  annualInsurance: number;
  annualSemesterFees: number;
  oneTimeExpenses: number; // One-time pre-departure expenses
  oneTimeExpensesCurrency: string; // e.g. 'PKR'
  preDepartureCosts: PreDepartureCosts;
  availableAnnualBudgetPKR: number; // Annual recurring sponsorship
  availableOneTimeFundsPKR: number; // Available one-time savings/lump sum
  // Backward compatibility aliases
  annualTuitionForeign?: number;
  annualLivingForeign?: number;
  annualHealthInsuranceForeign?: number;
  annualMiscellaneousForeign?: number;
  monthlyExpectedPartTimeEarningsForeign?: number;
}

export interface BreakdownItem {
  id: string;
  label: string;
  amountInputCurrency: number;
  inputCurrency: string;
  amountForeign: number | null; // null if conversion unavailable
  foreignCurrency: string;
  amountPKR: number | null; // null if conversion unavailable
  category: 'one-time' | 'recurring';
  frequency: 'one-time' | 'annual';
  percentageOfTotal: number;
}

export interface BudgetCalculationResult {
  // Currencies & exchange rate used
  inputExpenseCurrency: string;
  baseCurrency: string;
  destinationCurrency: string;
  exchangeRateUsed: number | null;
  isExchangeRateValid: boolean;

  // Core formulas:
  // 1. annualRecurringCost = annualTuition + annualLiving + annualInsurance + annualSemesterFees
  annualRecurringCostInput: number;
  annualRecurringCostBase: number | null;
  annualRecurringCostForeign: number | null;

  // 2. firstYearCost = annualRecurringCost + oneTimePreDepartureCosts
  firstYearCostInput: number;
  firstYearCostBase: number | null;
  firstYearCostForeign: number | null;

  // 3. totalDegreeCost = (annualRecurringCost * studyDurationYears) + oneTimePreDepartureCosts
  totalDegreeCostInput: number;
  totalDegreeCostBase: number | null;
  totalDegreeCostForeign: number | null;

  // Pre-departure costs (calculated strictly from itemized inputs, no arbitrary visa proof added)
  oneTimePreDepartureCostsInput: number;
  oneTimePreDepartureCostsBase: number;
  oneTimePreDepartureCostsForeign: number | null;

  // Total available resources = available one-time funds + (annual sponsorship * studyDurationYears)
  totalAvailableResourcesBase: number;
  cashAvailableBeforeDepartureBase: number;
  preDepartureCashGapBase: number;

  // Total degree funding gap = max(0, total degree cost - total available resources)
  totalDegreeFundingGapBase: number;
  budgetSurplusBase: number;
  isShortfall: boolean;

  // Visa financial proof displayed separately as evidence of funds (never double-counted)
  hasVerifiedVisaProofRequirement: boolean;
  statutoryAnnualLivingProofForeign: number | null;
  statutoryAnnualLivingProofBase: number | null;
  statutoryProofDescription: string | null;

  // Visible calculation assumptions notice
  calculationAssumptionNotice: string;

  // Itemized breakdown
  breakdown: BreakdownItem[];

  // Backward compatibility properties
  oneTimePreDeparturePKR: number;
  oneTimePreDepartureForeign: number | null;
  annualRecurringForeign: number | null;
  annualRecurringPKR: number;
  firstYearTotalForeign: number | null;
  firstYearTotalPKR: number;
  totalDegreeCostPKR: number;
  totalAvailableFundsPKR: number;
  netBalancePKR: number;
  shortfallPKR: number;
  surplusPKR: number;
  firstYearShortfallPKR: number;
  estimatedBeforeDepartureNeededPKR: number;
  destinationCurrencyCode: string;
  annualExpensesBreakdown: {
    tuitionPKR: number | null;
    livingPKR: number | null;
    insurancePKR: number | null;
    miscPKR: number | null;
  };
}

export interface SavedBudgetProfile {
  id: string;
  title: string;
  savedAt: string;
  destinationCountryName: string;
  input: BudgetInput;
  result: BudgetCalculationResult;
}

export interface MatcherRequirementCheck {
  id: string;
  label: string;
  status: 'met' | 'unmet' | 'needed';
  details: string;
}

export type MatcherOverallStatus =
  | 'Baseline Criteria Met'
  | 'Partially Eligible'
  | 'Not Eligible'
  | 'Likely Eligible';

export interface EligibilityMatchResult {
  scholarship: Scholarship;
  overallStatus: MatcherOverallStatus;
  requirementsMet: MatcherRequirementCheck[];
  requirementsNotMet: MatcherRequirementCheck[];
  informationNeeded: MatcherRequirementCheck[];
}
