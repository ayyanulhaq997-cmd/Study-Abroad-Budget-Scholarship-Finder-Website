/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DegreeLevel = 'Bachelor' | 'Master' | 'PhD' | 'Any';

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
  typicalLivingMin: number;
  typicalLivingMax: number;
  officialProofOfFundsRequirement: string;
  statutoryAnnualLivingProof: number; // e.g. Germany Sperrkonto 11,904 EUR, Canada IRCC 20,635 CAD
  visaProcessingWeeks: string;
  partTimeWorkRights: string;
  postStudyWorkVisa: string;
  popularSubjects: string[];
  officialLinks: OfficialLink[];
  notes: string;
}

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
  typicalAnnualTuitionMin: number | null; // null if unknown/variable
  typicalAnnualTuitionMax: number | null;
  tuitionNote: string;
  estimatedCityLivingAnnual: number;
  knownScholarships: string[];
  popularPrograms: string[];
  admissionRequirementsSummary: string;
  officialAdmissionsUrl: string;
  lastVerifiedDate: string;
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
  homeCurrency: string;
  destinationCountryId: string;
  exchangeRateToPKR: number;
  studyDurationYears: number;
  annualTuitionForeign: number;
  annualLivingForeign: number;
  annualHealthInsuranceForeign: number;
  annualMiscellaneousForeign: number;
  preDepartureCosts: PreDepartureCosts;
  availableAnnualBudgetPKR: number;
  availableOneTimeFundsPKR: number;
  monthlyExpectedPartTimeEarningsForeign?: number;
}

export interface BreakdownItem {
  id: string;
  label: string;
  amountForeign: number;
  amountPKR: number;
  category: 'one-time' | 'recurring';
  frequency: 'one-time' | 'annual';
  percentageOfTotal: number;
}

export interface BudgetCalculationResult {
  oneTimePreDeparturePKR: number;
  oneTimePreDepartureForeign: number;
  annualRecurringForeign: number;
  annualRecurringPKR: number;
  firstYearTotalForeign: number;
  firstYearTotalPKR: number;
  totalDegreeCostForeign: number;
  totalDegreeCostPKR: number;
  totalAvailableFundsPKR: number;
  netBalancePKR: number;
  isShortfall: boolean;
  shortfallPKR: number;
  surplusPKR: number;
  firstYearShortfallPKR: number;
  estimatedBeforeDepartureNeededPKR: number;
  exchangeRateUsed: number;
  destinationCurrencyCode: string;
  breakdown: BreakdownItem[];
  annualExpensesBreakdown: {
    tuitionPKR: number;
    livingPKR: number;
    insurancePKR: number;
    miscPKR: number;
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

export interface EligibilityMatchResult {
  scholarship: Scholarship;
  overallStatus: 'Likely Eligible' | 'Partially Eligible' | 'Not Eligible';
  requirementsMet: MatcherRequirementCheck[];
  requirementsNotMet: MatcherRequirementCheck[];
  informationNeeded: MatcherRequirementCheck[];
}
