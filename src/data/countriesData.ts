/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country } from '../types';

export const COUNTRIES_DATA: Country[] = [
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    code: 'DE',
    currencyCode: 'EUR',
    currencySymbol: '€',
    defaultExchangeRateToPKR: 305.50, // User-editable reference
    exchangeRateDate: 'User-editable reference (illustrative estimate: 1 EUR = 305.50 PKR)',
    typicalTuitionMin: 0,
    typicalTuitionMax: 3000,
    typicalLivingMin: 10800,
    typicalLivingMax: 14400,
    officialProofOfFundsRequirement: 'Blocked Account (Sperrkonto) mandatory for German student visa: €11,904 per year (€992 per month) as the official 2026 living-funds statutory benchmark.',
    statutoryAnnualLivingProof: 11904,
    statutoryProofDetails: '€11,904 per year (€992/month) deposited into an approved blocked account (Sperrkonto). This is a statutory visa baseline, distinct from actual living costs which vary by city.',
    visaProcessingWeeks: 'Variable estimates: typically 6 to 12 weeks (embassy wait times through German missions in Islamabad/Karachi vary by season)',
    partTimeWorkRights: '140 full days or 280 half days per calendar year (or up to 20 hours per week during term); unrestricted during official university vacations.',
    workRightsOfficialSource: 'Section 16b (3) of the German Residence Act (Aufenthaltsgesetz - AufenthG), updated under the Skilled Immigration Act (Fachkräfteeinwanderungsgesetz).',
    postStudyWorkVisa: 'Up to 18-month Job Seeker Residence Permit (Aufenthaltserlaubnis zur Arbeitsplatzsuche) upon degree completion.',
    postStudyOfficialSource: 'Section 20 (3) no. 1 of the German Residence Act (AufenthG).',
    popularSubjects: ['Computer Science & AI', 'Mechanical Engineering', 'Renewable Energy', 'Automotive Engineering', 'Data Science'],
    officialLinks: [
      {
        title: 'Federal Foreign Office (German Visa Regulations)',
        url: 'https://pakistan.diplo.de/pk-en/service/visa-einreise',
        sourceType: 'Government',
      },
      {
        title: 'Make it in Germany (Federal Government Portal)',
        url: 'https://www.make-it-in-germany.com/en/study-training/studies-in-germany',
        sourceType: 'Government',
      },
      {
        title: 'DAAD - German Academic Exchange Service',
        url: 'https://www.daad.de/en/',
        sourceType: 'Official Agency',
      },
    ],
    notes: 'Most public universities do not charge general tuition, requiring only a mandatory semester fee (Semesterbeitrag: €150–€400/semester including public transit pass). However, the federal state of Baden-Württemberg charges €1,500/semester for non-EU students, and Technical University of Munich (TUM) charges non-EU tuition fees.',
    lastVerifiedDate: 'October 19, 2026',
    officialSourceUrl: 'https://www.make-it-in-germany.com/en/study-training/studies-in-germany',
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    flag: '🇰🇷',
    code: 'KR',
    currencyCode: 'KRW',
    currencySymbol: '₩',
    defaultExchangeRateToPKR: 0.208, // 1 KRW ≈ 0.208 PKR (or 1,350 KRW = $1 USD, $1 USD = 280 PKR)
    exchangeRateDate: 'User-editable reference (illustrative estimate: 1 KRW ≈ 0.208 PKR; documented conversion: ₩1,350 ≈ $1 USD, $1 USD ≈ 280 PKR)',
    typicalTuitionMin: 4000000, // ₩4,000,000 KRW/yr (national/public universities)
    typicalTuitionMax: 12000000, // ₩12,000,000 KRW/yr (private / STEM / medical universities)
    typicalLivingMin: 9600000, // ₩800,000/mo = ₩9,600,000 KRW/yr
    typicalLivingMax: 15600000, // ₩1,300,000/mo = ₩15,600,000 KRW/yr
    officialProofOfFundsRequirement: 'D-2 Student Visa bank balance requirement is set by the Ministry of Justice / Korea Immigration Service: typically ₩16,000,000 to ₩20,000,000 KRW for universities in the Seoul Metropolitan Area (approx. ₩14,000,000 to ₩18,000,000 KRW for universities outside Seoul), or documented foreign currency equivalent. There is no single universal bank amount.',
    statutoryAnnualLivingProof: 20000000, // Seoul benchmark in KRW (approx. $14,800–$16,000 USD depending on exchange rate)
    statutoryProofDetails: 'Typically ₩16,000,000–₩20,000,000 KRW depending on campus location (Seoul vs. Regional). Documented conversion: ₩21,500,000 KRW ≈ $16,000 USD at 1,343 KRW/USD (PKR 4,472,000 at 279.50 PKR/USD).',
    visaProcessingWeeks: 'Variable estimates: typically 3 to 6 weeks at the Embassy of the Republic of Korea in Islamabad',
    partTimeWorkRights: 'Part-time work is NOT automatic. It requires formal S-3 Part-time Work Permission from the Korea Immigration Service and university endorsement. Permitted hours depend on degree level, academic standing, and Korean language proficiency (TOPIK): typically 10 to 25 hours per week during term for eligible students, unrestricted during vacations.',
    workRightsOfficialSource: 'Ministry of Justice (Korea Immigration Service) Regulations on Stay and Part-Time Work Permission for International Students (D-2).',
    postStudyWorkVisa: 'D-10-1 (Job Seeker Visa): Granted conditionally rather than as a universal flat period. Initial grant is 6 months. For international graduates of accredited domestic Korean universities: Master’s and Doctoral degree holders are exempt from the points system and can extend stay in 6-month increments up to 2 years total (and up to 3 years for PhD holders in advanced technology / high-tech fields); Bachelor’s degree holders from Korean institutions are points-exempt with GPA ≥ 3.0 (or TOPIK level 4+) and can extend up to 2 years (or up to 1 year if below 3.0 via points). For graduates of foreign (overseas) universities: must score at least 60 points out of 190 (with ≥ 20 basic points) under the D-10 Points-Based System, with duration capped at up to 1 year, unless holding a degree from a Times Higher Education Top 200 / QS Top 500 university or Fortune 500 employment experience (eligible up to 2 years). Extensions require verifiable documentation of active job search activities.',
    postStudyOfficialSource: 'Ministry of Justice Enforcement Decree of the Immigration Control Act (Article 10, Attached Table 1-2 D-10 Job Search Qualification), Korea Immigration Service HiKorea Manual on Stay Qualification Management (www.hikorea.go.kr), and NIIED Study in Korea Portal (www.studyinkorea.go.kr).',
    popularSubjects: ['Artificial Intelligence', 'Robotics', 'Electrical Engineering', 'Semiconductors', 'Biotechnology'],
    officialLinks: [
      {
        title: 'HiKorea (Official Korean Immigration Service Portal)',
        url: 'https://www.hikorea.go.kr',
        sourceType: 'Government',
      },
      {
        title: 'HiKorea D-10 Job Search Visa Guidelines (Ministry of Justice)',
        url: 'https://www.hikorea.go.kr/info/InfoStayD10.pt',
        sourceType: 'Government',
      },
      {
        title: 'Study in Korea (NIIED Ministry of Education)',
        url: 'https://www.studyinkorea.go.kr',
        sourceType: 'Government',
      },
      {
        title: 'Embassy of the Republic of Korea in Pakistan',
        url: 'https://overseas.mofa.go.kr/pk-en/index.do',
        sourceType: 'Government',
      },
    ],
    notes: 'Korean tuition and living costs are originally billed in KRW. Converted amounts to USD or PKR must state explicit exchange rates. Audited 1st-year baseline calculation: PKR 4,472,000 (Living / Financial Proof) + PKR 1,120,000 (Tuition: ₩5.4M @ 0.208) + PKR 450,000 (Pre-departure Costs) = PKR 6,042,000. Many universities award 30%–100% scholarships based on GPA and TOPIK.',
    lastVerifiedDate: 'October 19, 2026',
    officialSourceUrl: 'https://www.studyinkorea.go.kr',
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    code: 'US',
    currencyCode: 'USD',
    currencySymbol: '$',
    defaultExchangeRateToPKR: 279.50, // User-editable reference
    exchangeRateDate: 'User-editable reference (illustrative estimate: 1 USD = 279.50 PKR)',
    typicalTuitionMin: 20000,
    typicalTuitionMax: 48000,
    typicalLivingMin: 13000,
    typicalLivingMax: 22000,
    officialProofOfFundsRequirement: 'Form I-20 Cost of Attendance (COA): Under 8 CFR 214.2(f)(1)(i)(B), there is no universal federal dollar amount. Financial evidence must cover 100% of the first-year tuition, mandatory institutional fees, and estimated living expenses certified by the specific SEVP-approved school on Form I-20, net of verified scholarships or assistantships.',
    statutoryAnnualLivingProof: 16000, // Illustrative institutional COA living component
    statutoryProofDetails: 'Determined institution-by-institution on Form I-20 by the Designated School Official (DSO). Ranges from ~$12,000 to $25,000+ depending on campus location and housing type.',
    visaProcessingWeeks: 'Variable estimates: typically 4 to 12 weeks (subject to F-1 interview appointment slot availability at US Embassy Islamabad or Consulate Karachi)',
    partTimeWorkRights: 'On-campus work is permitted up to 20 hours per week during academic terms (full-time during official school recesses) per 8 CFR 214.2(f)(9)(i). Off-campus work is strictly prohibited during the first academic year and requires prior specific authorization (CPT authorized by DSO, or OPT / severe economic hardship authorized with a USCIS Employment Authorization Document).',
    workRightsOfficialSource: '8 CFR 214.2(f)(9) - US Department of Homeland Security / USCIS F-1 Employment Regulations.',
    postStudyWorkVisa: 'Optional Practical Training (OPT): 12 months for eligible degree graduates, plus 24-month STEM OPT Extension (total 36 months for qualifying STEM degree recipients).',
    postStudyOfficialSource: '8 CFR 214.2(f)(10) - USCIS Optional Practical Training Regulations.',
    popularSubjects: ['Computer Science', 'Artificial Intelligence', 'Data Engineering', 'Business Analytics', 'Biomedical Sciences'],
    officialLinks: [
      {
        title: 'Study in the States (US Dept of Homeland Security)',
        url: 'https://studyinthestates.dhs.gov',
        sourceType: 'Government',
      },
      {
        title: 'EducationUSA Pakistan (Official US State Department Advising)',
        url: 'https://educationusa.pk',
        sourceType: 'Official Agency',
      },
      {
        title: 'USEFP (United States Educational Foundation in Pakistan)',
        url: 'https://usefp.org',
        sourceType: 'Official Agency',
      },
    ],
    notes: 'No universal federal bank requirement exists for the US F-1 student visa. The amount is determined strictly by the certified institution on Form I-20. Graduate assistantships (RA/TA) at research universities frequently waive 100% of tuition and provide a monthly living stipend. F-1 applicants must demonstrate non-immigrant intent.',
    lastVerifiedDate: 'October 19, 2026',
    officialSourceUrl: 'https://studyinthestates.dhs.gov',
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
    currencyCode: 'CAD',
    currencySymbol: 'CA$',
    defaultExchangeRateToPKR: 203.20, // User-editable reference
    exchangeRateDate: 'User-editable reference (illustrative estimate: 1 CAD = 203.20 PKR)',
    typicalTuitionMin: 18000,
    typicalTuitionMax: 38000,
    typicalLivingMin: 21000,
    typicalLivingMax: 27000,
    officialProofOfFundsRequirement: 'IRCC mandatory living-funds requirement: CAD $23,448 for a single applicant for study permit applications submitted on or after 1 September 2026 (excluding tuition and transportation/flights).',
    statutoryAnnualLivingProof: 23448,
    statutoryProofDetails: 'CAD $23,448 per year for a single applicant (indexed by IRCC to Statistics Canada Low-Income Cut-Off - LICO). Additional funds required if accompanying family members are included.',
    visaProcessingWeeks: 'Variable estimates: typically 7 to 12 weeks for Pakistani applicants under standard study permit queues',
    partTimeWorkRights: 'Eligible full-time post-secondary students may work off-campus up to 24 hours per week during regular academic sessions (updated from 20 hours per IRCC regulations), and full-time during scheduled academic breaks (reading weeks and summer breaks).',
    workRightsOfficialSource: 'Immigration, Refugees and Citizenship Canada (IRCC) - Student Off-Campus Work Regulations.',
    postStudyWorkVisa: 'Post-Graduation Work Permit (PGWP): up to 3 years depending on program duration, credential level, and field of study at eligible Designated Learning Institutions (DLIs).',
    postStudyOfficialSource: 'IRCC Post-Graduation Work Permit Program (PGWP) Guidelines.',
    popularSubjects: ['Software Engineering', 'AI & Machine Learning', 'Data Science', 'Business Administration', 'Environmental Sciences'],
    officialLinks: [
      {
        title: 'IRCC Study Permit Official Guidance',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
        sourceType: 'Government',
      },
      {
        title: 'EduCanada (Official Government of Canada Education Portal)',
        url: 'https://www.educanada.ca',
        sourceType: 'Government',
      },
    ],
    notes: 'Provincial/Territorial Attestation Letters (PAL/TAL) are required for most undergraduate study permit applications under federal enrollment caps, but exemptions exist (including master’s and doctoral degree applicants, visiting/exchange students, and study permit extensions). Applicants must check eligibility for their specific program.',
    lastVerifiedDate: 'October 19, 2026',
    officialSourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    currencyCode: 'GBP',
    currencySymbol: '£',
    defaultExchangeRateToPKR: 355.00, // User-editable reference
    exchangeRateDate: 'User-editable reference (illustrative estimate: 1 GBP = 355.00 PKR)',
    typicalTuitionMin: 16000,
    typicalTuitionMax: 32000,
    typicalLivingMin: 11000,
    typicalLivingMax: 18000,
    officialProofOfFundsRequirement: 'UK Visas and Immigration (UKVI) financial maintenance requirement: £1,529 per month for courses in London (up to 9 months = £13,761) or £1,171 per month outside London (up to 9 months = £10,539). Funds must be held continuously for at least 28 consecutive days.',
    statutoryAnnualLivingProof: 13761, // London benchmark
    statutoryLivingProofLondon: 13761, // £1,529 x 9
    statutoryLivingProofNonLondon: 10539, // £1,171 x 9
    statutoryProofDetails: 'London: £1,529/month × 9 months = £13,761. Outside London: £1,171/month × 9 months = £10,539. Required funds must be held in an acceptable bank account for a consecutive 28-day period ending no more than 31 days before application.',
    visaProcessingWeeks: 'Variable estimates: standard decision is typically 3 weeks from biometric enrollment at VFS Global in Pakistan',
    partTimeWorkRights: 'Up to 20 hours per week during term time for degree-level studies at higher education providers; full-time during official vacation periods.',
    workRightsOfficialSource: 'UKVI Student Visa Guidance, Appendix Student (ST 26.1).',
    postStudyWorkVisa: 'Graduate Route (PSW): 2 years for degree graduates (3 years for PhD) applying before 1 Jan 2027. Effective 1 January 2027: 18 months for eligible bachelor’s and master’s graduates, and 3 years for doctoral graduates.',
    postStudyOfficialSource: 'UK Home Office - Graduate Visa Regulations & Statement of Changes in Immigration Rules.',
    popularSubjects: ['Computer Science', 'Data Analytics', 'Fintech & Finance', 'Law', 'Global Public Health'],
    officialLinks: [
      {
        title: 'UK Visas and Immigration (Student Visa Official Guidance)',
        url: 'https://www.gov.uk/student-visa',
        sourceType: 'Government',
      },
      {
        title: 'Study UK (British Council Official Portal)',
        url: 'https://study-uk.britishcouncil.org',
        sourceType: 'Official Agency',
      },
      {
        title: 'British Council Pakistan',
        url: 'https://www.britishcouncil.pk',
        sourceType: 'Official Agency',
      },
    ],
    notes: 'Most UK Master’s degrees are completed in 1 calendar year (12 months), reducing overall tuition and living expenses compared to 2-year programs in other destinations. Financial maintenance funds must strictly satisfy the 28-day rule.',
    lastVerifiedDate: 'October 19, 2026',
    officialSourceUrl: 'https://www.gov.uk/student-visa',
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    defaultExchangeRateToPKR: 180.50, // User-editable reference
    exchangeRateDate: 'User-editable reference (illustrative estimate: 1 AUD = 180.50 PKR)',
    typicalTuitionMin: 24000,
    typicalTuitionMax: 46000,
    typicalLivingMin: 25000,
    typicalLivingMax: 33000,
    officialProofOfFundsRequirement: 'Department of Home Affairs financial capacity requirement: AUD $29,710 for 12 months living expenses (for a single student applicant), plus full first-year tuition and return travel allowance (approx. AUD $2,000).',
    statutoryAnnualLivingProof: 29710,
    statutoryProofDetails: 'AUD $29,710 per year for a single applicant (legislative instrument under Subclass 500). Additional funds required for accompanying spouse (AUD $10,394) and child (AUD $4,449).',
    visaProcessingWeeks: 'Variable estimates: typically 4 to 8 weeks for Higher Education sector (subject to Home Affairs processing queues)',
    partTimeWorkRights: '48 hours per fortnight (two-week period) while course is in session; unrestricted during scheduled course holidays. Exceptions: Master by research and PhD students have unrestricted work rights once their course commences; mandatory course-integrated work placements do not count toward the 48-hour limit.',
    workRightsOfficialSource: 'Condition 8105 - Australian Migration Regulations 1994 / Department of Home Affairs.',
    postStudyWorkVisa: 'Subclass 485 (Post-Higher Education Work stream): Bachelor’s (including Honours): 2 years; Master’s by Coursework or Extended: 2 years; Master’s by Research: 3 years; Doctoral (PhD): 3 years. Designated regional study adds 1 to 2 additional years.',
    postStudyOfficialSource: 'Department of Home Affairs - Subclass 485 Temporary Graduate Visa (Post-Higher Education Work stream).',
    popularSubjects: ['Information Technology', 'Cybersecurity', 'Civil Engineering', 'Mining Engineering', 'Accounting & Finance'],
    officialLinks: [
      {
        title: 'Department of Home Affairs (Subclass 500 Student Visa)',
        url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
        sourceType: 'Government',
      },
      {
        title: 'Study Australia (Australian Trade and Investment Commission)',
        url: 'https://www.studyaustralia.gov.au',
        sourceType: 'Government',
      },
    ],
    notes: 'Australia assesses student visa applications under the Genuine Student (GS) requirement. Applicants must prove genuine access to funds held in their name or eligible sponsors.',
    lastVerifiedDate: 'October 19, 2026',
    officialSourceUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
  },
];
