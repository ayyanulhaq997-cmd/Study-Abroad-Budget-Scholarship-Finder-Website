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
  const destinationMatches =
    profile.preferredDestination === 'All' ||
    scholarship.hostCountries.includes('Multiple') ||
    scholarship.hostCountries.includes('Multiple European Countries') ||
    scholarship.hostCountries.some(
      (c) => c.toLowerCase() === profile.preferredDestination.toLowerCase()
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
