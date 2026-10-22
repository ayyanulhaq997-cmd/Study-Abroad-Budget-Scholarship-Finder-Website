/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';
import {
  DegreeLevel,
  EligibilityMatchResult,
  MatcherOverallStatus,
  MatcherRequirementCheck,
  Scholarship,
  SubjectCategory,
} from '../types';

export interface UserEligibilityProfile {
  academicPercentage: number; // e.g. 75
  ieltsScore: number; // e.g. 6.5 (or 0 if not taken)
  degreeLevel: DegreeLevel;
  subjectArea: SubjectCategory;
  preferredDestination: string; // 'All' or country name
  workExperienceYears: number; // e.g. 2
  isPakistaniCitizen: boolean;
}

/**
 * Set of recognized European destination names, country codes, and common aliases.
 * Used for strict regional matching (e.g. Erasmus Mundus Joint Masters).
 */
export const EUROPEAN_DESTINATIONS = new Set([
  'germany',
  'de',
  'deutschland',
  'united kingdom',
  'uk',
  'gb',
  'great britain',
  'england',
  'scotland',
  'wales',
  'france',
  'fr',
  'italy',
  'it',
  'spain',
  'es',
  'netherlands',
  'nl',
  'sweden',
  'se',
  'switzerland',
  'ch',
  'austria',
  'at',
  'belgium',
  'be',
  'norway',
  'no',
  'denmark',
  'dk',
  'finland',
  'fi',
  'ireland',
  'ie',
  'poland',
  'pl',
  'portugal',
  'pt',
  'czech republic',
  'cz',
  'czechia',
  'hungary',
  'hu',
  'greece',
  'gr',
  'multiple european countries',
]);

/**
 * Standardize country names to ensure clean matching across IDs and labels.
 */
export function normalizeCountryName(country: string): string {
  const c = country.trim().toLowerCase();
  if (c === 'usa' || c === 'us' || c === 'united states of america') return 'united states';
  if (c === 'uk' || c === 'gb' || c === 'great britain') return 'united kingdom';
  if (c === 'south-korea' || c === 'kr' || c === 'korea') return 'south korea';
  return c;
}

/**
 * Check if a destination is located in Europe.
 */
export function isEuropeanDestination(destination: string): boolean {
  const norm = normalizeCountryName(destination);
  return EUROPEAN_DESTINATIONS.has(norm);
}

/**
 * Matches a destination country against a scholarship's hostCountries.
 * 
 * Rules:
 * 1. If destination is 'All' or empty, always returns true.
 * 2. Compares normalized destination against each hostCountry in scholarship.hostCountries.
 * 3. Regional entries like 'Multiple European Countries' ONLY match verified European destinations.
 *    They MUST NEVER match Australia, USA, Canada, South Korea, etc.
 * 4. Generic 'Multiple' only matches if the scholarship has no regional exclusions.
 */
export function isCountryMatchingScholarship(
  scholarship: Scholarship,
  destination: string
): boolean {
  if (!destination || destination.trim().toLowerCase() === 'all') {
    return true;
  }

  const normDest = normalizeCountryName(destination);

  // Check direct country matches and regional rules
  for (const host of scholarship.hostCountries) {
    const normHost = normalizeCountryName(host);

    if (normHost === normDest) {
      return true;
    }

    // Regional European matching rule:
    // Only matches if destination is a confirmed European country
    if (normHost === 'multiple european countries') {
      if (isEuropeanDestination(normDest)) {
        return true;
      }
    }

    // Generic 'Multiple' (if no regional restriction specified)
    if (normHost === 'multiple' && !scholarship.hostCountries.some((h) => h.toLowerCase().includes('european'))) {
      return true;
    }
  }

  return false;
}

export interface ActiveScholarshipFilterOptions {
  destination: string; // e.g. 'Australia', 'Germany', 'uk', etc.
  degreeLevel?: DegreeLevel; // e.g. 'Bachelor', 'Master', 'PhD'
  subjectArea?: SubjectCategory;
}

/**
 * Retrieves only active verified scholarships for a specific destination.
 * Strictly excludes:
 * - Scholarships with programStatus 'Closed' or 'Discontinued'
 * - Unverified scholarships (isVerified: false or 'Not Yet Verified')
 * - Destination mismatches (e.g. Erasmus Mundus for Australia)
 * - Degree level mismatches (e.g. graduate-only scholarships for undergraduate/Bachelor)
 */
export function getActiveVerifiedScholarshipsForDestination(
  options: ActiveScholarshipFilterOptions
): Scholarship[] {
  return SCHOLARSHIPS_DATA.filter((s) => {
    // 1. Must be verified
    if (!s.isVerified || s.programStatus === 'Not Yet Verified') {
      return false;
    }

    // 2. Must not be Closed or Discontinued
    if (s.programStatus === 'Closed' || s.programStatus === 'Discontinued') {
      return false;
    }

    // 3. Must match destination using explicit country/regional rules
    if (!isCountryMatchingScholarship(s, options.destination)) {
      return false;
    }

    // 4. If degree level is specified and not 'Any', must match scholarship degreeLevels
    if (options.degreeLevel && options.degreeLevel !== 'Any') {
      const matchesDegree =
        s.degreeLevels.includes(options.degreeLevel) ||
        s.degreeLevels.includes('Any');
      if (!matchesDegree) {
        return false;
      }
    }

    // 5. If subject area is specified and not 'All Subjects', must match
    if (options.subjectArea && options.subjectArea !== 'All Subjects') {
      const matchesSubject =
        s.subjectAreas.includes('All Subjects') ||
        s.subjectAreas.includes(options.subjectArea);
      if (!matchesSubject) {
        return false;
      }
    }

    return true;
  });
}

export function evaluateEligibility(
  profile: UserEligibilityProfile,
  scholarship: Scholarship
): EligibilityMatchResult {
  const requirementsMet: MatcherRequirementCheck[] = [];
  const requirementsNotMet: MatcherRequirementCheck[] = [];
  const informationNeeded: MatcherRequirementCheck[] = [];

  // Check 1: Program Operational Status
  if (scholarship.programStatus === 'Discontinued') {
    requirementsNotMet.push({
      id: 'program-discontinued',
      label: 'Program Status: Discontinued',
      status: 'unmet',
      details:
        scholarship.statusDetails ||
        'This scholarship program has concluded and no longer accepts new applications.',
    });
  } else if (scholarship.programStatus === 'Closed') {
    requirementsNotMet.push({
      id: 'program-closed',
      label: 'Application Status: Closed (Past Deadline)',
      status: 'unmet',
      details:
        scholarship.statusDetails ||
        scholarship.applicationDeadlineNotice ||
        'The official application deadline for the current cycle has closed.',
    });
  }

  // Check 2: Verification Status
  if (!scholarship.isVerified || scholarship.programStatus === 'Not Yet Verified') {
    informationNeeded.push({
      id: 'verification-pending',
      label: 'Official Verification Status',
      status: 'needed',
      details:
        'This scholarship record is currently pending official verification by our editorial team. Requirements cannot be treated as confirmed facts.',
    });
  }

  // Check 3: Degree Level Match
  const degreeMatches =
    profile.degreeLevel === 'Any' ||
    scholarship.degreeLevels.includes(profile.degreeLevel) ||
    scholarship.degreeLevels.includes('Any');

  if (degreeMatches) {
    requirementsMet.push({
      id: 'degree-level',
      label: 'Intended Degree Level',
      status: 'met',
      details: `Your degree level (${profile.degreeLevel}) aligns with published eligible levels: ${scholarship.degreeLevels.join(', ')}.`,
    });
  } else {
    requirementsNotMet.push({
      id: 'degree-level',
      label: 'Intended Degree Level Mismatch',
      status: 'unmet',
      details: `This scholarship is designated strictly for ${scholarship.degreeLevels.join(', ')} degree programs. You selected ${profile.degreeLevel}.`,
    });
  }

  // Check 4: Destination Country Match
  const destinationMatches = isCountryMatchingScholarship(
    scholarship,
    profile.preferredDestination
  );

  if (destinationMatches) {
    requirementsMet.push({
      id: 'destination',
      label: 'Host Country Eligibility',
      status: 'met',
      details: `Your target destination (${profile.preferredDestination}) aligns with tenure country: ${scholarship.hostCountries.join(', ')}.`,
    });
  } else {
    requirementsNotMet.push({
      id: 'destination',
      label: 'Host Country Mismatch',
      status: 'unmet',
      details: `Tenure for this grant is in ${scholarship.hostCountries.join(', ')}. You selected ${profile.preferredDestination}.`,
    });
  }

  // Check 5: Subject Area Match
  const subjectMatches =
    profile.subjectArea === 'All Subjects' ||
    scholarship.subjectAreas.includes('All Subjects') ||
    scholarship.subjectAreas.includes(profile.subjectArea);

  if (subjectMatches) {
    requirementsMet.push({
      id: 'subject',
      label: 'Academic Discipline',
      status: 'met',
      details: `Your discipline (${profile.subjectArea}) is supported under this scheme.`,
    });
  } else {
    requirementsNotMet.push({
      id: 'subject',
      label: 'Discipline Restrictions',
      status: 'unmet',
      details: `This grant specifies fields: ${scholarship.subjectAreas.join(', ')}. Your discipline is ${profile.subjectArea}.`,
    });
  }

  // Check 6: Academic Percentage / Minimum GPA
  if (profile.academicPercentage > 0) {
    if (profile.academicPercentage >= scholarship.minAcademicPercentage) {
      requirementsMet.push({
        id: 'academic-percentage',
        label: 'Minimum Academic Benchmark',
        status: 'met',
        details: `Your reported graduation metric (${profile.academicPercentage}%) meets the published baseline threshold of ${scholarship.minAcademicPercentage}%. (Note: Selection remains competitive).`,
      });
    } else {
      requirementsNotMet.push({
        id: 'academic-percentage',
        label: 'Academic Percentage Below Minimum',
        status: 'unmet',
        details: `Your reported graduation metric (${profile.academicPercentage}%) is below the published minimum of ${scholarship.minAcademicPercentage}%.`,
      });
    }
  } else {
    informationNeeded.push({
      id: 'academic-percentage',
      label: 'Academic Percentage / CGPA Missing',
      status: 'needed',
      details: `Enter your graduation percentage or converted CGPA (Baseline requirement is minimum ${scholarship.minAcademicPercentage}%).`,
    });
  }

  // Check 7: English Language / IELTS
  if (scholarship.minIeltsScore > 0) {
    if (profile.ieltsScore > 0) {
      if (profile.ieltsScore >= scholarship.minIeltsScore) {
        requirementsMet.push({
          id: 'ielts',
          label: 'English Language Benchmark',
          status: 'met',
          details: `Your IELTS score of ${profile.ieltsScore} satisfies the published baseline band of ${scholarship.minIeltsScore}.`,
        });
      } else {
        requirementsNotMet.push({
          id: 'ielts',
          label: 'IELTS Band Below Requirement',
          status: 'unmet',
          details: `Your score (${profile.ieltsScore}) is below the minimum published requirement of ${scholarship.minIeltsScore} overall.`,
        });
      }
    } else {
      informationNeeded.push({
        id: 'ielts',
        label: 'Language Score Information Needed',
        status: 'needed',
        details: `Official score of at least ${scholarship.minIeltsScore} is required for this award. Enter your score or check if equivalent test (TOEFL/PTE) is accepted.`,
      });
    }
  } else {
    requirementsMet.push({
      id: 'ielts',
      label: 'Language Benchmark',
      status: 'met',
      details: 'No rigid scholarship-level IELTS cutoff specified (uses GRE, institutional preparatory language course, or target university criteria).',
    });
  }

  // Check 8: Work Experience
  if (scholarship.requiresWorkExperience) {
    const requiredYears = scholarship.workExperienceYearsNeeded || 2;
    if (profile.workExperienceYears >= requiredYears) {
      requirementsMet.push({
        id: 'work-experience',
        label: 'Professional Work Experience',
        status: 'met',
        details: `You have ${profile.workExperienceYears} year(s) of verified experience, meeting the required baseline of ${requiredYears} year(s) (approx. 2,800 hours).`,
      });
    } else {
      requirementsNotMet.push({
        id: 'work-experience',
        label: 'Work Experience Insufficient',
        status: 'unmet',
        details: `Requires at least ${requiredYears} year(s) (e.g. 2,800 hours) of verified professional work experience. You entered ${profile.workExperienceYears} year(s).`,
      });
    }
  }

  // Check 9: Country Citizenship / Nationality
  if (
    scholarship.id === 'fulbright-pakistan' ||
    scholarship.id === 'chevening-uk' ||
    scholarship.id === 'australia-awards'
  ) {
    if (profile.isPakistaniCitizen) {
      requirementsMet.push({
        id: 'citizenship',
        label: 'Nationality & Residence',
        status: 'met',
        details: 'Confirmed Pakistani citizenship and residency fulfills eligibility criteria.',
      });
    } else {
      requirementsNotMet.push({
        id: 'citizenship',
        label: 'Nationality Requirement',
        status: 'unmet',
        details: 'This specific quota or commission is strictly reserved for citizens and residents of Pakistan.',
      });
    }
  }

  // Overall Status determination:
  // Strictly distinguishes baseline eligibility from guaranteed admission/selection
  let overallStatus: MatcherOverallStatus = 'Baseline Criteria Met';
  if (requirementsNotMet.length > 0) {
    overallStatus = 'Not Eligible';
  } else if (informationNeeded.length > 0) {
    overallStatus = 'Partially Eligible';
  }

  return {
    scholarship,
    overallStatus,
    requirementsMet,
    requirementsNotMet,
    informationNeeded,
  };
}

export function matchAllScholarships(
  profile: UserEligibilityProfile
): EligibilityMatchResult[] {
  return SCHOLARSHIPS_DATA.map((scholarship) =>
    evaluateEligibility(profile, scholarship)
  );
}
