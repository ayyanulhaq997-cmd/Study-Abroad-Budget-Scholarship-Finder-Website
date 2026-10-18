/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';
import {
  DegreeLevel,
  EligibilityMatchResult,
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

  // Check 1: Verification status
  if (!scholarship.isVerified) {
    informationNeeded.push({
      id: 'verification-pending',
      label: 'Official Verification Status',
      status: 'needed',
      details: 'This scholarship record is currently pending official verification by our editorial team. Requirements cannot be verified yet.',
    });
  }

  // Check 2: Degree Level Match
  const degreeMatches =
    profile.degreeLevel === 'Any' ||
    scholarship.degreeLevels.includes(profile.degreeLevel) ||
    scholarship.degreeLevels.includes('Any');

  if (degreeMatches) {
    requirementsMet.push({
      id: 'degree-level',
      label: 'Intended Degree Level',
      status: 'met',
      details: `Your degree level (${profile.degreeLevel}) matches the eligible levels: ${scholarship.degreeLevels.join(', ')}.`,
    });
  } else {
    requirementsNotMet.push({
      id: 'degree-level',
      label: 'Intended Degree Level Mismatch',
      status: 'unmet',
      details: `This scholarship is strictly for ${scholarship.degreeLevels.join(', ')} degree programs. You selected ${profile.degreeLevel}.`,
    });
  }

  // Check 3: Destination Country Match
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
      details: `Your target country (${profile.preferredDestination}) aligns with eligible destination: ${scholarship.hostCountries.join(', ')}.`,
    });
  } else {
    requirementsNotMet.push({
      id: 'destination',
      label: 'Host Country Mismatch',
      status: 'unmet',
      details: `Tenure for this grant is in ${scholarship.hostCountries.join(', ')}. You selected ${profile.preferredDestination}.`,
    });
  }

  // Check 4: Subject Area
  const subjectMatches =
    profile.subjectArea === 'All Subjects' ||
    scholarship.subjectAreas.includes('All Subjects') ||
    scholarship.subjectAreas.includes(profile.subjectArea);

  if (subjectMatches) {
    requirementsMet.push({
      id: 'subject',
      label: 'Academic Discipline',
      status: 'met',
      details: `Your field (${profile.subjectArea}) is supported by this funding scheme.`,
    });
  } else {
    requirementsNotMet.push({
      id: 'subject',
      label: 'Discipline Restrictions',
      status: 'unmet',
      details: `This grant specifies fields: ${scholarship.subjectAreas.join(', ')}. Your discipline is ${profile.subjectArea}.`,
    });
  }

  // Check 5: Academic Percentage / Minimum GPA
  if (profile.academicPercentage > 0) {
    if (profile.academicPercentage >= scholarship.minAcademicPercentage) {
      requirementsMet.push({
        id: 'academic-percentage',
        label: 'Minimum Academic Percentage',
        status: 'met',
        details: `Your academic percentage (${profile.academicPercentage}%) meets or exceeds the published minimum requirement of ${scholarship.minAcademicPercentage}%.`,
      });
    } else {
      requirementsNotMet.push({
        id: 'academic-percentage',
        label: 'Academic Percentage Below Minimum',
        status: 'unmet',
        details: `Your reported academic percentage is ${profile.academicPercentage}%, which is below the published competitive threshold of ${scholarship.minAcademicPercentage}%.`,
      });
    }
  } else {
    informationNeeded.push({
      id: 'academic-percentage',
      label: 'Academic Percentage / CGPA',
      status: 'needed',
      details: `Enter your graduation percentage or converted CGPA (Requires minimum ${scholarship.minAcademicPercentage}%).`,
    });
  }

  // Check 6: English Language / IELTS
  if (scholarship.minIeltsScore > 0) {
    if (profile.ieltsScore > 0) {
      if (profile.ieltsScore >= scholarship.minIeltsScore) {
        requirementsMet.push({
          id: 'ielts',
          label: 'IELTS English Language Test',
          status: 'met',
          details: `Your IELTS score of ${profile.ieltsScore} meets the minimum published band of ${scholarship.minIeltsScore}.`,
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
        label: 'IELTS Academic Score Needed',
        status: 'needed',
        details: `Official score of at least ${scholarship.minIeltsScore} is required for this award. Provide your test result or verify if TOEFL/PTE is accepted.`,
      });
    }
  } else {
    requirementsMet.push({
      id: 'ielts',
      label: 'Language Requirement',
      status: 'met',
      details: 'No rigid IELTS minimum specified by scholarship provider (may use GRE, institutional language prep, or direct university evaluation).',
    });
  }

  // Check 7: Work Experience
  if (scholarship.requiresWorkExperience) {
    const requiredYears = scholarship.workExperienceYearsNeeded || 2;
    if (profile.workExperienceYears >= requiredYears) {
      requirementsMet.push({
        id: 'work-experience',
        label: 'Professional Work Experience',
        status: 'met',
        details: `You have ${profile.workExperienceYears} year(s) of verified experience, meeting the required ${requiredYears} year(s) threshold.`,
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

  // Check 8: Country Citizenship
  if (scholarship.id === 'fulbright-pakistan' || scholarship.id === 'chevening-uk' || scholarship.id === 'australia-awards') {
    if (profile.isPakistaniCitizen) {
      requirementsMet.push({
        id: 'citizenship',
        label: 'Nationality & Residence',
        status: 'met',
        details: 'Confirmed Pakistani citizenship residing in Pakistan satisfies eligibility boundary.',
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

  // Overall status
  let overallStatus: 'Likely Eligible' | 'Partially Eligible' | 'Not Eligible' = 'Likely Eligible';
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
