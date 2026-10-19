/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scholarship } from '../types';

export const SCHOLARSHIPS_DATA: Scholarship[] = [
  {
    id: 'chevening-uk',
    name: 'Chevening Scholarships (United Kingdom)',
    provider: 'UK Foreign, Commonwealth and Development Office (FCDO)',
    hostCountries: ['United Kingdom'],
    degreeLevels: ['Master'],
    subjectAreas: [
      'All Subjects',
      'Computer Science & AI',
      'Engineering & Technology',
      'Business, Economics & Finance',
      'Social Sciences & Humanities',
      'Health Sciences & Medicine',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 70, // UK upper second-class (2:1) equivalent (approx 65-70% or 3.0+ CGPA in Pakistan)
    minIeltsScore: 6.5, // University unconditional offer requirement
    requiresWorkExperience: true,
    workExperienceYearsNeeded: 2, // Exactly 2,800 hours / approx 2 years
    applicationDeadlineNotice: 'Applications for 2027/2028 intake are CURRENTLY OPEN. Official deadline: November 3, 2026 at 12:00 UTC (midday GMT). Submit directly through the official Chevening online application system.',
    officialUrl: 'https://www.chevening.org/scholarship/pakistan/',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Applications Open',
    statusDetails: 'APPLICATIONS CURRENTLY OPEN for the 2027/2028 academic cycle (official closing deadline: November 3, 2026 at 12:00 UTC).',
    benefitsSummary: 'Full university tuition fees, monthly living allowance, economy return flight to the UK, and arrival allowances.',
    eligibilityRequirements: [
      'Citizen of Pakistan with commitment to return for minimum 2 years after your award has ended.',
      'Undergraduate degree equivalent to an upper second-class 2:1 honours degree in the UK.',
      'At least two years (equivalent to 2,800 hours) of verified work experience (full-time, part-time, or internships).',
      'Apply to 3 eligible UK university master’s programs and receive an unconditional offer from at least one before the deadline.',
    ],
    notesForPakistaniStudents: 'Work experience hours must be carefully calculated and documented. Leadership potential is a central evaluation pillar.',
  },
  {
    id: 'commonwealth-masters-uk',
    name: 'Commonwealth Master’s Scholarships',
    provider: 'Commonwealth Scholarship Commission in the UK (CSC) & UK FCDO',
    hostCountries: ['United Kingdom'],
    degreeLevels: ['Master'],
    subjectAreas: [
      'All Subjects',
      'Computer Science & AI',
      'Engineering & Technology',
      'Health Sciences & Medicine',
      'Natural & Applied Sciences',
      'Social Sciences & Humanities',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 70, // Upper second class honours (2:1) equivalent
    minIeltsScore: 6.5,
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Applications for 2027/2028 intake are CURRENTLY OPEN (opened September 2026; closes mid-October/November 2026). Check HEC Pakistan nomination portal and CSC UK system for exact cutoffs.',
    officialUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Applications Open',
    statusDetails: 'APPLICATIONS CURRENTLY OPEN for 2027/2028 cycle via CSC UK application system and designated national nominating agencies.',
    benefitsSummary: 'Approved tuition fees, return airfare to UK, monthly stipend (£1,439/mo or £1,774/mo for London), warm clothing allowance, and study travel grant.',
    eligibilityRequirements: [
      'Citizen of or granted refugee status by a Commonwealth country (Pakistan is an eligible Commonwealth nation).',
      'Hold a first degree of at least upper second-class (2:1) honours standard (approx 70% or 3.0+ CGPA in Pakistan).',
      'Be unable to afford to study in the UK without this scholarship.',
      'Nominated through an official nominating agency (e.g. Higher Education Commission - HEC Pakistan).',
    ],
    notesForPakistaniStudents: 'Requires nomination through HEC Pakistan’s portal as well as the CSC online application system.',
  },
  {
    id: 'daad-epos-germany',
    name: 'DAAD EPOS (Development-Related Postgraduate Courses)',
    provider: 'German Academic Exchange Service (Deutscher Akademischer Austauschdienst - DAAD)',
    hostCountries: ['Germany'],
    degreeLevels: ['Master', 'Doctoral'],
    subjectAreas: [
      'Engineering & Technology',
      'Computer Science & AI',
      'Natural & Applied Sciences',
      'Business, Economics & Finance',
      'Social Sciences & Humanities',
      'Health Sciences & Medicine',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 70, // Minimum Bachelor degree with above average results (approx 65-70% / 3.0 CGPA)
    minIeltsScore: 6.0,
    requiresWorkExperience: true,
    workExperienceYearsNeeded: 2, // At least 2 years of relevant professional experience
    applicationDeadlineNotice: 'Course-specific application deadlines: Participating German universities set separate deadlines (typically between August and November/December 2026 for the 2027 intake). Select programs are currently accepting applications.',
    officialUrl: 'https://www2.daad.de/deutschland/stipendien/datenbank/en/21148-scholarship-database/?detail=50076777',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Course-Specific Deadlines',
    statusDetails: 'COURSE-SPECIFIC DEADLINES. Applications are submitted directly to individual EPOS degree courses in Germany. Master’s stipend: €934/month; Doctoral stipend: €1,400/month (updated rate effective February 2026).',
    benefitsSummary: 'Monthly scholarship payment of €934 for Master’s candidates and €1,400 for doctoral candidates (updated rate effective February 2026), health, accident and personal liability insurance coverage, travel allowance, and annual study allowance (€460/yr).',
    eligibilityRequirements: [
      'Hold a recognized 4-year Bachelor’s degree (completed no more than 6 years prior) for Master\'s; Master\'s degree for Doctoral.',
      'At least 2 years of professional work experience in a relevant development field after completing bachelor’s.',
      'English proficiency: IELTS min 6.0 to 6.5 (or TOEFL) depending on specific course guidelines.',
      'Motivation letter demonstrating personal and professional link to development-related issues.',
    ],
    notesForPakistaniStudents: 'Direct application is made directly to the university offering the chosen EPOS course in Germany, stating DAAD scholarship application.',
  },
  {
    id: 'erasmus-mundus',
    name: 'Erasmus Mundus Joint Masters Scholarship',
    provider: 'European Commission (European Union)',
    hostCountries: ['Germany', 'United Kingdom', 'Multiple European Countries'],
    degreeLevels: ['Master'],
    subjectAreas: [
      'All Subjects',
      'Computer Science & AI',
      'Engineering & Technology',
      'Natural & Applied Sciences',
      'Social Sciences & Humanities',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 75,
    minIeltsScore: 6.5,
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Consortium-specific application schedules: Individual Joint Master programmes open applications between October 2026 and January/February 2027 for the September 2027 intake. Consult individual course portals in the Erasmus catalogue.',
    officialUrl: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Course-Specific Deadlines',
    statusDetails: 'CATALOGUE PROGRAMMES OPENING. Each master consortium establishes its own application window; deadlines typically range between December 2026 and February 2027.',
    benefitsSummary: 'Full tuition fee coverage across multiple European partner universities, €1,400 monthly living stipend for 24 months, comprehensive health insurance, and travel allowance.',
    eligibilityRequirements: [
      'Bachelor’s degree or equivalent in a relevant field.',
      'Study across at least two different European countries during the two-year program.',
      'IELTS 6.5 or equivalent English certification.',
    ],
    notesForPakistaniStudents: 'Pakistan is consistently among the top recipient countries worldwide for Erasmus Mundus scholarships.',
  },
  {
    id: 'gks-south-korea',
    name: 'Global Korea Scholarship (GKS - Graduate)',
    provider: 'National Institute for International Education (NIIED) - Ministry of Education, South Korea',
    hostCountries: ['South Korea'],
    degreeLevels: ['Master', 'Doctoral'],
    subjectAreas: [
      'All Subjects',
      'Computer Science & AI',
      'Engineering & Technology',
      'Natural & Applied Sciences',
      'Social Sciences & Humanities',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 80, // GPA minimum 80% or ranking within top 20% of class
    minIeltsScore: 6.0,
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Applications are CURRENTLY CLOSED. The 2027 Graduate intake is expected to open in February 2027 (Embassy Track) and February–March 2027 (University Track), subject to official NIIED notice release.',
    officialUrl: 'https://www.studyinkorea.go.kr/en/scholarship/Gks1NoticeList.do',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Awaiting Announcement',
    statusDetails: 'AWAITING OFFICIAL ANNOUNCEMENT. Applications are currently closed. Opening schedule for 2027 is expected in February 2027, awaiting official NIIED publication.',
    benefitsSummary: '100% full tuition, 1,000,000 KRW monthly stipend, round-trip airfare, 1-year Korean language training, resettlement allowance, and health insurance.',
    eligibilityRequirements: [
      'Pakistani citizenship (applicant and parents must hold non-Korean citizenship).',
      'Cumulative Grade Point Average (CGPA) above 80% on a 100-point scale or rank within the top 20% of previous graduating class.',
      'Under 40 years of age as of date of selection.',
      'Must complete 1 year of Korean language program at designated language institution in Korea before degree study (exempt if TOPIK level 5 or 6).',
    ],
    notesForPakistaniStudents: 'Special quota allocated specifically for Pakistan under both Embassy Track and University Track (R&D focus encourages STEM & AI applicants).',
  },
  {
    id: 'turkiye-burslari',
    name: 'Türkiye Bursları Government Scholarships',
    provider: 'Presidency for Turks Abroad and Related Communities (YTB), Republic of Türkiye',
    hostCountries: ['Turkey'],
    degreeLevels: ['Bachelor', 'Master', 'Doctoral'],
    subjectAreas: [
      'All Subjects',
      'Computer Science & AI',
      'Engineering & Technology',
      'Business, Economics & Finance',
      'Health Sciences & Medicine',
      'Social Sciences & Humanities',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 75, // 70% for Bachelor, 75% for Master/PhD, 90% for Health
    minIeltsScore: 0, // Most courses taught in Turkish (includes 1 yr free language prep)
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Applications are CURRENTLY CLOSED. The 2027 annual application window is expected to run from January 10 to February 20, 2027, awaiting official confirmation by YTB.',
    officialUrl: 'https://www.turkiyeburslari.gov.tr',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Awaiting Announcement',
    statusDetails: 'AWAITING OFFICIAL ANNOUNCEMENT. Applications are currently closed. The annual opening is expected on January 10, 2027 based on recurring convention, awaiting official YTB announcement.',
    benefitsSummary: '100% university placement and tuition fees, monthly stipend, university dormitory accommodation, round-trip flight ticket, health insurance, and 1-year Turkish language course.',
    eligibilityRequirements: [
      'Citizens of all countries except citizens of Turkey.',
      'Minimum academic achievement: 70% for undergraduate; 75% for Master’s and PhD; 90% for medical candidates.',
      'Age limits: Under 21 for Bachelor; under 30 for Master; under 35 for PhD.',
    ],
    notesForPakistaniStudents: 'Over 1,000 Pakistani students apply annually. Free on-campus dormitory accommodation significantly reduces out-of-pocket costs.',
  },
  {
    id: 'kaist-scholarship-korea',
    name: 'KAIST International Graduate Scholarship',
    provider: 'Korea Advanced Institute of Science and Technology (KAIST)',
    hostCountries: ['South Korea'],
    degreeLevels: ['Master', 'Doctoral'],
    subjectAreas: [
      'Computer Science & AI',
      'Engineering & Technology',
      'Natural & Applied Sciences',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 75,
    minIeltsScore: 6.5,
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Spring 2027 intake closed in September 2026. The Fall 2027 graduate application window is expected to open in December 2026, awaiting the release of the official KAIST admissions guide.',
    officialUrl: 'https://admission.kaist.ac.kr/graduate/intl/scholarships',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Awaiting Announcement',
    statusDetails: 'AWAITING FALL INTAKE OPENING. Spring 2027 admissions cycle has concluded; Fall 2027 admissions guide is anticipated in December 2026.',
    benefitsSummary: '100% full tuition waiver, monthly stipend of ₩350,000 for Master (₩400,000 for PhD, plus faculty research lab project subsidies), and medical insurance.',
    eligibilityRequirements: [
      'Hold Bachelor’s degree in science or engineering from an accredited institution for Master\'s; Master\'s for PhD.',
      'English proficiency: IELTS 6.5 or TOEFL iBT 83 minimum.',
      'Strong quantitative and programming background, especially for School of Computing and Kim Jaechul Graduate School of AI.',
    ],
    notesForPakistaniStudents: 'One of the top institutions globally for AI and robotics. Most accepted international graduate students automatically receive tuition waiver and professor research stipend.',
  },
  {
    id: 'fulbright-pakistan',
    name: 'Fulbright Foreign Student Program (Pakistan) - Master\'s & PhD',
    provider: 'United States Educational Foundation in Pakistan (USEFP) & US Department of State',
    hostCountries: ['United States'],
    degreeLevels: ['Master', 'Doctoral'],
    subjectAreas: [
      'All Subjects',
      'Computer Science & AI',
      'Engineering & Technology',
      'Business, Economics & Finance',
      'Natural & Applied Sciences',
      'Social Sciences & Humanities',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 70, // Minimum 16 years of education with 3.0+ CGPA or First Division
    minIeltsScore: 0, // Uses GRE General Test for initial screening
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Application cycle for the 2027 intake CLOSED on April 1, 2026 (04:30 PM PKT). This program is strictly a graduate scholarship (Master\'s and PhD only; not open for Bachelor\'s study). The 2028 intake cycle is expected to open in February 2027 (unannounced, anticipated based on annual convention).',
    officialUrl: 'https://www.usefp.org/scholarships/fulbright-degree.cfm',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Closed',
    statusDetails: 'CLOSED for the 2027 academic cycle (official deadline was April 1, 2026). Strictly graduate-level (Master\'s and PhD); undergraduate/bachelor\'s degree studies are not eligible.',
    benefitsSummary: '100% tuition, monthly living stipend, health insurance, airfare, visa fee assistance, and book allowance.',
    eligibilityRequirements: [
      'Pakistani citizenship residing and working in Pakistan (dual US/Pakistani citizens not eligible).',
      'Minimum 16 years of formal education (4-year Bachelor’s or Master’s) for Master’s applicants; 18 years for PhD applicants.',
      'Strictly graduate level only: Bachelor’s / undergraduate studies are NOT eligible.',
      'Strong academic history with a minimum 3.0 CGPA or high first division.',
      'Graduate Record Examination (GRE General) score required at submission.',
      'Mandatory agreement to return to Pakistan for at least 2 years post-graduation.',
    ],
    notesForPakistaniStudents: 'Cycle for 2027 intake closed on April 1, 2026. Next cycle is anticipated in February 2027. USEFP holds regional informational webinars across Lahore, Islamabad, and Karachi.',
  },
  {
    id: 'australia-awards',
    name: 'Australia Awards Scholarships (Pakistan - Master\'s)',
    provider: 'Australian Department of Foreign Affairs and Trade (DFAT)',
    hostCountries: ['Australia'],
    degreeLevels: ['Master'],
    subjectAreas: [
      'Computer Science & AI',
      'Engineering & Technology',
      'Business, Economics & Finance',
      'Natural & Applied Sciences',
      'Social Sciences & Humanities',
      'Health Sciences & Medicine',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 70,
    minIeltsScore: 6.5, // Min overall 6.5 with no band less than 6.0
    requiresWorkExperience: true,
    workExperienceYearsNeeded: 2,
    applicationDeadlineNotice: 'Applications for the 2027 intake CLOSED on April 30, 2026 at 11:59 PM AEST. In Pakistan, Australia Awards are strictly restricted to Master\'s-level degree study (Undergraduate and PhD studies are not eligible for Pakistan applicants). The 2028 intake cycle is expected to open February 1, 2027 (unannounced, anticipated based on annual convention).',
    officialUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Closed',
    statusDetails: 'CLOSED for the 2027 intake (official deadline was April 30, 2026). Strictly Master\'s level in priority development areas; undergraduate and PhD programs are not offered for Pakistan applicants.',
    benefitsSummary: 'Full tuition fees, return air travel, establishment allowance, Contribution to Living Expenses (CLE), Overseas Student Health Cover (OSHC).',
    eligibilityRequirements: [
      'Citizen of Pakistan and currently residing in Pakistan at time of application.',
      'Strictly Master’s degree level only (Undergraduate/Bachelor’s and PhD studies are not eligible for Pakistan applicants).',
      'Minimum of two years’ verified professional work experience in a field related to your proposed study.',
      'IELTS Academic overall score of at least 6.5 with no band less than 6.0.',
      'Commitment to return to Pakistan for at least two years after completing study in Australia.',
    ],
    notesForPakistaniStudents: '2027 cycle closed on April 30, 2026. Priority areas for Pakistan include economic growth, water security, health, education, and climate resilience.',
  },
  {
    id: 'vanier-cgs-canada',
    name: 'Vanier Canada Graduate Scholarships (Vanier CGS) [Discontinued / Replaced]',
    provider: 'Government of Canada (CIHR, NSERC, SSHRC)',
    hostCountries: ['Canada'],
    degreeLevels: ['Doctoral'],
    subjectAreas: [
      'Natural & Applied Sciences',
      'Engineering & Technology',
      'Health Sciences & Medicine',
      'Social Sciences & Humanities',
    ],
    fundingType: 'Full Funding',
    minAcademicPercentage: 85,
    minIeltsScore: 7.0,
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Program discontinued — Final competition concluded in Fall 2024. No longer accepting new applications.',
    officialUrl: 'https://vanier.gc.ca/en/home-accueil.html',
    lastVerifiedDate: 'October 19, 2026',
    isVerified: true,
    programStatus: 'Discontinued',
    statusDetails: 'Discontinued / Phased Out. As confirmed by the official Government of Canada Tri-Agency portal, Vanier CGS is no longer accepting applications. It is succeeded by the Canada Graduate Research Scholarship – Doctoral (CGRS-D).',
    replacementProgramName: 'Canada Graduate Research Scholarship – Doctoral (CGRS-D)',
    replacementProgramSummary: 'The Government of Canada has harmonized doctoral funding under CIHR, NSERC, and SSHRC into the new Canada Graduate Research Scholarship – Doctoral (CGRS-D), providing CAD $40,000 per year for up to 36 months. Up to 15% of awards are available to international doctoral candidates. Applications are submitted directly to the granting agencies or through Canadian institutions.',
    replacementProgramUrl: 'https://vanier.gc.ca/en/home-accueil.html',
    benefitsSummary: 'Former benefit was $50,000 CAD/year for 3 years. The program is now closed to new applicants; existing award holders remain funded under original terms.',
    eligibilityRequirements: [
      'This program is officially closed to new applicants.',
      'Doctoral candidates seeking Canadian federal funding should consult the new Canada Graduate Research Scholarship – Doctoral (CGRS-D).',
      'Current Vanier CGS award holders continue under their existing terms.',
    ],
    notesForPakistaniStudents: 'Do not submit new applications for Vanier CGS. Refer to the replacement CGRS-D guidelines on the official Government of Canada Tri-Agency portal.',
  },
  {
    id: 'placeholder-unverified-sample',
    name: 'Regional Bilateral Merit Grant (Unverified Placeholder)',
    provider: 'Provincial Department of Higher Education [Pending Primary Source Verification]',
    hostCountries: ['Australia'],
    degreeLevels: ['Master'],
    subjectAreas: ['All Subjects'],
    fundingType: 'Partial Funding',
    minAcademicPercentage: 70,
    minIeltsScore: 6.5,
    requiresWorkExperience: false,
    workExperienceYearsNeeded: 0,
    applicationDeadlineNotice: 'Check official announcement — Details unconfirmed.',
    officialUrl: '#',
    lastVerifiedDate: 'Not yet verified',
    isVerified: false,
    programStatus: 'Not Yet Verified',
    statusDetails: 'Not yet verified from primary official government or university bulletins. Displayed solely in the separate unverified section for editorial audit compliance.',
    benefitsSummary: 'Data for this scholarship has not yet been verified from primary official sources. Displayed as an unverified placeholder per policy; do not rely on these figures for budget calculations.',
    eligibilityRequirements: [
      'Criteria currently pending official confirmation.',
      'Do not rely on this record for financial planning until official verification is published.',
    ],
    notesForPakistaniStudents: 'Per our transparency policy, this placeholder is segregated from confirmed opportunities and not included in active verified totals.',
  },
];

// Helper subsets to guarantee currently open, upcoming, closed, and unverified opportunities are strictly segregated
export const OPEN_VERIFIED_SCHOLARSHIPS: Scholarship[] = SCHOLARSHIPS_DATA.filter(
  (s) =>
    s.isVerified &&
    (s.programStatus === 'Applications Open' || s.programStatus === 'Course-Specific Deadlines')
);

export const UPCOMING_VERIFIED_SCHOLARSHIPS: Scholarship[] = SCHOLARSHIPS_DATA.filter(
  (s) => s.isVerified && s.programStatus === 'Awaiting Announcement'
);

export const CLOSED_VERIFIED_SCHOLARSHIPS: Scholarship[] = SCHOLARSHIPS_DATA.filter(
  (s) => s.isVerified && s.programStatus === 'Closed'
);

export const DISCONTINUED_SCHOLARSHIPS: Scholarship[] = SCHOLARSHIPS_DATA.filter(
  (s) => s.programStatus === 'Discontinued'
);

export const UNVERIFIED_SCHOLARSHIPS: Scholarship[] = SCHOLARSHIPS_DATA.filter(
  (s) => !s.isVerified || s.programStatus === 'Not Yet Verified'
);

// Backward compatibility alias for tests & components
export const ACTIVE_VERIFIED_SCHOLARSHIPS: Scholarship[] = [
  ...OPEN_VERIFIED_SCHOLARSHIPS,
  ...UPCOMING_VERIFIED_SCHOLARSHIPS,
];
