/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  Sparkles,
  BookOpen,
  GraduationCap,
  Globe2,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import {
  SCHOLARSHIPS_DATA,
  ACTIVE_VERIFIED_SCHOLARSHIPS,
  DISCONTINUED_SCHOLARSHIPS,
  UNVERIFIED_SCHOLARSHIPS,
} from '../data/scholarshipsData';
import {
  DegreeLevel,
  FundingType,
  Scholarship,
  SubjectCategory,
} from '../types';
import {
  evaluateEligibility,
  matchAllScholarships,
  UserEligibilityProfile,
} from '../services/eligibilityMatcher';

interface ScholarshipFinderPageProps {
  onNavigate: (path: string) => void;
}

export const ScholarshipFinderPage: React.FC<ScholarshipFinderPageProps> = ({
  onNavigate,
}) => {
  // Navigation Tabs: Directory vs Matcher
  const [activeTab, setActiveTab] = useState<'finder' | 'matcher'>('finder');

  // Filter States for Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterDegree, setFilterDegree] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterFundingType, setFilterFundingType] = useState<string>('All');
  const [filterMaxIelts, setFilterMaxIelts] = useState<number>(9);
  const [filterMinPercentage, setFilterMinPercentage] = useState<number>(0);
  const [showUnverifiedSection, setShowUnverifiedSection] = useState<boolean>(true);

  // Profile States for Eligibility Matcher
  const [matcherProfile, setMatcherProfile] = useState<UserEligibilityProfile>({
    academicPercentage: 76,
    ieltsScore: 6.5,
    degreeLevel: 'Master',
    subjectArea: 'Computer Science & AI',
    preferredDestination: 'All',
    workExperienceYears: 2,
    isPakistaniCitizen: true,
  });

  // Helper filter function for any scholarship list
  const applyFilters = (scholarships: Scholarship[]) => {
    return scholarships.filter((s) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesProvider = s.provider.toLowerCase().includes(query);
        const matchesNotes = s.notesForPakistaniStudents?.toLowerCase().includes(query) || false;
        const matchesBenefits = s.benefitsSummary.toLowerCase().includes(query);
        if (!matchesName && !matchesProvider && !matchesNotes && !matchesBenefits) return false;
      }

      // Country filter
      if (filterCountry !== 'All') {
        const hasCountry =
          s.hostCountries.includes('Multiple') ||
          s.hostCountries.includes('Multiple European Countries') ||
          s.hostCountries.some((c) => c.toLowerCase() === filterCountry.toLowerCase());
        if (!hasCountry) return false;
      }

      // Degree Level
      if (filterDegree !== 'All') {
        const hasDegree =
          s.degreeLevels.includes(filterDegree as DegreeLevel) || s.degreeLevels.includes('Any');
        if (!hasDegree) return false;
      }

      // Subject Area
      if (filterSubject !== 'All') {
        const hasSubject =
          s.subjectAreas.includes('All Subjects') ||
          s.subjectAreas.includes(filterSubject as SubjectCategory);
        if (!hasSubject) return false;
      }

      // Funding Type
      if (filterFundingType !== 'All') {
        if (s.fundingType !== filterFundingType) return false;
      }

      // IELTS requirement
      if (s.minIeltsScore > filterMaxIelts) return false;

      // Min percentage requirement
      if (filterMinPercentage > 0 && s.minAcademicPercentage > filterMinPercentage) return false;

      return true;
    });
  };

  // Active verified scholarships (kept strictly separated from unverified records by default)
  const filteredActiveScholarships = useMemo(() => {
    return applyFilters(ACTIVE_VERIFIED_SCHOLARSHIPS);
  }, [
    searchQuery,
    filterCountry,
    filterDegree,
    filterSubject,
    filterFundingType,
    filterMaxIelts,
    filterMinPercentage,
  ]);

  // Discontinued scholarships (e.g. Vanier CGS replaced by CGRS-D)
  const filteredDiscontinuedScholarships = useMemo(() => {
    return applyFilters(DISCONTINUED_SCHOLARSHIPS);
  }, [
    searchQuery,
    filterCountry,
    filterDegree,
    filterSubject,
    filterFundingType,
    filterMaxIelts,
    filterMinPercentage,
  ]);

  // Unverified scholarships (kept in a separate section with explicit warnings)
  const filteredUnverifiedScholarships = useMemo(() => {
    return applyFilters(UNVERIFIED_SCHOLARSHIPS);
  }, [
    searchQuery,
    filterCountry,
    filterDegree,
    filterSubject,
    filterFundingType,
    filterMaxIelts,
    filterMinPercentage,
  ]);

  // Evaluated Matcher Results (strictly evaluated against active verified opportunities first)
  const matchResults = useMemo(() => {
    return matchAllScholarships(matcherProfile);
  }, [matcherProfile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Verified Higher Education Funding Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Scholarship Finder & Eligibility Matcher
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Search authentic government and university scholarships verified against official primary sources (e.g., USEFP, Chevening, DAAD, NIIED). Unverified records are segregated and clearly labeled.
        </p>

        {/* Editorial Standards Advisory Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              <strong>Editorial Transparency:</strong> We only publish active scholarships verified against primary government or university bulletins. Baseline eligibility indicates initial qualification to apply, not guaranteed admission or scholarship award.
            </span>
          </div>
          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 shrink-0">
            Official Sources Grounded
          </span>
        </div>
      </div>

      {/* Primary Switcher Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('finder')}
          className={`flex items-center space-x-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'finder'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Verified Directory ({filteredActiveScholarships.length} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('matcher')}
          className={`flex items-center space-x-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'matcher'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span>Interactive Eligibility Matcher</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
            Baseline Checklist
          </span>
        </button>
      </div>

      {/* TAB 1: SCHOLARSHIP DIRECTORY */}
      {activeTab === 'finder' && (
        <div className="space-y-8">
          {/* Search and Multi-Parameter Filter Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center w-5 h-5 text-slate-400 my-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by scholarship title, university or provider (e.g. Fulbright, Chevening, DAAD, GKS)..."
                className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Destination Country */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Country</label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="All">All Host Countries</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Australia">Australia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              {/* Degree Level */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Eligible Degree</label>
                <select
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="All">All Degrees</option>
                  <option value="Master">Master’s Degree</option>
                  <option value="PhD">PhD / Doctoral</option>
                  <option value="Bachelor">Bachelor’s / Undergraduate</option>
                </select>
              </div>

              {/* Subject Area */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Area</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="All">All Subject Areas</option>
                  <option value="Computer Science & AI">Computer Science & AI</option>
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Business, Economics & Finance">Business & Economics</option>
                  <option value="Natural & Applied Sciences">Natural Sciences</option>
                  <option value="Health Sciences & Medicine">Health Sciences</option>
                  <option value="Social Sciences & Humanities">Social Sciences</option>
                </select>
              </div>

              {/* Funding Type */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Funding Coverage</label>
                <select
                  value={filterFundingType}
                  onChange={(e) => setFilterFundingType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="All">All Funding Types</option>
                  <option value="Full Funding">Full Funding (Tuition + Stipend)</option>
                  <option value="Partial Funding">Partial Funding / Stipends</option>
                  <option value="Tuition Waiver">Tuition Fee Waiver</option>
                </select>
              </div>
            </div>

            {/* Quick Toggle Controls */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Displaying:</span>
                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  {filteredActiveScholarships.length} Active Verified Opportunities
                </span>
                {filteredUnverifiedScholarships.length > 0 && (
                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-200">
                    {filteredUnverifiedScholarships.length} Unverified Segregated
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCountry('All');
                  setFilterDegree('All');
                  setFilterSubject('All');
                  setFilterFundingType('All');
                  setFilterMaxIelts(9);
                  setFilterMinPercentage(0);
                }}
                className="text-xs text-slate-500 hover:text-blue-700 font-medium cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Section 1: ACTIVE VERIFIED SCHOLARSHIPS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Verified Opportunities ({filteredActiveScholarships.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified active programs with confirmed official sources and application links.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                Primary Source Grounding
              </span>
            </div>

            {/* Active Scholarships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredActiveScholarships.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Top Bar: Verification Badge & Funding Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Officially Verified (Active)</span>
                      </span>

                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {s.fundingType}
                      </span>
                    </div>

                    {/* Title & Provider */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {s.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Provided by: {s.provider}
                      </p>
                    </div>

                    {/* Key Metadata Pill Bar */}
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center space-x-1">
                        <Globe2 className="w-3 h-3 text-slate-400" />
                        <span>{s.hostCountries.join(', ')}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center space-x-1">
                        <GraduationCap className="w-3 h-3 text-slate-400" />
                        <span>{s.degreeLevels.join(', ')}</span>
                      </span>
                      {s.minIeltsScore > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          IELTS: {s.minIeltsScore}+
                        </span>
                      )}
                      {s.requiresWorkExperience && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          Work Experience ({s.workExperienceYearsNeeded || 2} yrs)
                        </span>
                      )}
                    </div>

                    {/* Benefits Summary */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Coverage & Precise Limitations:</span>
                      <p className="leading-relaxed">{s.benefitsSummary}</p>
                    </div>

                    {/* Published Minimum Requirements */}
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
                        Published Minimum Requirements:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {s.eligibilityRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Notes for Pakistani Applicants */}
                    {s.notesForPakistaniStudents && (
                      <div className="text-xs text-blue-900 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                        <strong className="text-blue-800">Pakistani Applicant Guidance: </strong>
                        {s.notesForPakistaniStudents}
                      </div>
                    )}
                  </div>

                  {/* Footer: Deadline, Verification Date & Official Link */}
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.applicationDeadlineNotice}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        Last verified: {s.lastVerifiedDate}
                      </span>
                    </div>

                    <a
                      href={s.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                    >
                      <span>View official source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}

              {filteredActiveScholarships.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">No Matching Active Scholarships Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try broadening your search keywords or resetting filters. We do not invent unverified scholarship records to populate empty searches.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCountry('All');
                      setFilterDegree('All');
                      setFilterSubject('All');
                      setFilterFundingType('All');
                    }}
                    className="px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: DISCONTINUED & TRANSITIONED PROGRAMS (e.g. Vanier CGS replaced by CGRS-D) */}
          {filteredDiscontinuedScholarships.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Program Transitions & Discontinued Grants</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Programs that no longer accept new competition cohorts, with details on successor schemes.
                  </p>
                </div>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                  Closed to New Applicants
                </span>
              </div>

              <div className="space-y-4">
                {filteredDiscontinuedScholarships.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-50/80 rounded-2xl border border-slate-300 p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            Discontinued
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Former Administrator: {s.provider}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        Last verified: {s.lastVerifiedDate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-2">
                      <p>
                        <strong>Official Status Notice: </strong>
                        {s.statusDetails}
                      </p>

                      {s.replacementProgramName && (
                        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1.5 mt-3">
                          <span className="font-bold text-blue-900 block text-xs">
                            Replacement Program: {s.replacementProgramName}
                          </span>
                          <p className="text-xs text-blue-900 leading-relaxed">
                            {s.replacementProgramSummary}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 italic">
                        {s.applicationDeadlineNotice}
                      </span>
                      <a
                        href={s.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <span>View official source announcement</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: UNVERIFIED SCHOLARSHIPS (Kept in a clearly separate section) */}
          {filteredUnverifiedScholarships.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-bold text-amber-950">
                      Pending Verification Records ({filteredUnverifiedScholarships.length})
                    </h2>
                    <p className="text-xs text-amber-900 mt-0.5">
                      The records below are currently pending primary official source verification. Their details, funding amounts, and criteria are NOT confirmed facts and are excluded from active verified calculations.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUnverifiedSection(!showUnverifiedSection)}
                  className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline shrink-0 cursor-pointer"
                >
                  {showUnverifiedSection ? 'Hide Unverified Section' : 'Show Unverified Section'}
                </button>
              </div>

              {showUnverifiedSection && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredUnverifiedScholarships.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl border border-dashed border-amber-300 p-6 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            <span>Not yet verified</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Status: Unconfirmed
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-800">{s.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Provider: {s.provider}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 text-xs text-amber-900 space-y-1">
                          <span className="font-bold block">Advisory:</span>
                          <p className="leading-relaxed">{s.benefitsSummary}</p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                            Status Note:
                          </span>
                          <ul className="text-xs text-slate-500 space-y-1">
                            {s.eligibilityRequirements.map((r, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Last verified: Not yet verified</span>
                        <span className="italic text-slate-400">Official source unconfirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ELIGIBILITY MATCHER */}
      {activeTab === 'matcher' && (
        <div className="space-y-8">
          {/* Matcher Configuration Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-700" />
                <span>Enter Your Academic & Professional Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We compare these metrics strictly against published baseline requirements without fabricating arbitrary percentage scores.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Academic Percentage */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Academic Graduation Percentage (% or CGPA Equivalent)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={matcherProfile.academicPercentage}
                    onChange={(e) =>
                      setMatcherProfile({
                        ...matcherProfile,
                        academicPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-slate-400">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  e.g. 75% typically corresponds to ~3.2/4.0 CGPA in Pakistan
                </span>
              </div>

              {/* IELTS Band */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  IELTS Academic Overall Band (Optional)
                </label>
                <select
                  value={matcherProfile.ieltsScore}
                  onChange={(e) =>
                    setMatcherProfile({
                      ...matcherProfile,
                      ieltsScore: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value={0}>Not Taken / Not Available</option>
                  <option value={5.5}>5.5</option>
                  <option value={6.0}>6.0</option>
                  <option value={6.5}>6.5</option>
                  <option value={7.0}>7.0</option>
                  <option value={7.5}>7.5</option>
                  <option value={8.0}>8.0</option>
                  <option value={8.5}>8.5</option>
                  <option value={9.0}>9.0</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Select 0 if planning to take later or if course accepts GRE / university language prep
                </span>
              </div>

              {/* Target Degree Level */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Target Degree Level
                </label>
                <select
                  value={matcherProfile.degreeLevel}
                  onChange={(e) =>
                    setMatcherProfile({
                      ...matcherProfile,
                      degreeLevel: e.target.value as DegreeLevel,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Master">Master’s Degree (1 or 2 Years)</option>
                  <option value="PhD">PhD / Doctoral</option>
                  <option value="Bachelor">Bachelor’s / Undergraduate</option>
                  <option value="Any">Any / Open</option>
                </select>
              </div>

              {/* Academic Subject Field */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Target Academic Subject
                </label>
                <select
                  value={matcherProfile.subjectArea}
                  onChange={(e) =>
                    setMatcherProfile({
                      ...matcherProfile,
                      subjectArea: e.target.value as SubjectCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="All Subjects">All Subjects</option>
                  <option value="Computer Science & AI">Computer Science & AI</option>
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Business, Economics & Finance">Business & Economics</option>
                  <option value="Natural & Applied Sciences">Natural Sciences</option>
                  <option value="Health Sciences & Medicine">Health Sciences</option>
                  <option value="Social Sciences & Humanities">Social Sciences</option>
                </select>
              </div>

              {/* Work Experience */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Verified Post-Graduation Work Experience
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={matcherProfile.workExperienceYears}
                    onChange={(e) =>
                      setMatcherProfile({
                        ...matcherProfile,
                        workExperienceYears: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-slate-400">
                    Years
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Mandatory for Chevening (2 yrs / 2,800 hrs), DAAD EPOS (2 yrs), and Australia Awards (2 yrs)
                </span>
              </div>

              {/* Preferred Destination */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Preferred Destination
                </label>
                <select
                  value={matcherProfile.preferredDestination}
                  onChange={(e) =>
                    setMatcherProfile({
                      ...matcherProfile,
                      preferredDestination: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="All">All Countries</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Australia">Australia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Important Advisory on Baseline Eligibility */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1">
            <span className="font-bold block text-blue-900 text-sm">
              Baseline Eligibility Notice:
            </span>
            <p className="leading-relaxed">
              This checklist assesses <strong>baseline eligibility criteria</strong> (minimum graduation percentage, language benchmarks, degree level, and work experience hours). Meeting baseline requirements means you are eligible to submit an application; it does <strong>not</strong> guarantee admission to the host university or selection for a scholarship award. Final decisions are made competitively by independent official selection panels.
            </p>
          </div>

          {/* Results Checklist List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Factual Baseline Eligibility Checks ({matchResults.length} Schemes Evaluated)
              </h2>
              <span className="text-xs text-slate-500">
                Evaluated against official published rules
              </span>
            </div>

            <div className="space-y-4">
              {matchResults.map((item) => {
                const s = item.scholarship;
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-base text-slate-900">{s.name}</h3>
                          <span className="text-xs text-slate-500 font-medium">({s.hostCountries.join(', ')})</span>
                        </div>
                        <p className="text-xs text-slate-500">{s.provider}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            item.overallStatus === 'Baseline Criteria Met' || item.overallStatus === 'Likely Eligible'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : item.overallStatus === 'Partially Eligible'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {item.overallStatus === 'Baseline Criteria Met' || item.overallStatus === 'Likely Eligible'
                            ? 'Baseline Criteria Met (Potential Match)'
                            : item.overallStatus === 'Partially Eligible'
                            ? 'Information Needed (Incomplete Profile)'
                            : 'Baseline Criteria Not Met'}
                        </span>
                      </div>
                    </div>

                    {/* Three-Column Factual Status Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Section 1: Requirements Met */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                        <span className="font-bold text-emerald-900 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Requirements Met ({item.requirementsMet.length})</span>
                        </span>
                        {item.requirementsMet.length > 0 ? (
                          <ul className="space-y-2 text-emerald-950">
                            {item.requirementsMet.map((c) => (
                              <li key={c.id} className="leading-snug">
                                <strong className="block text-emerald-900">{c.label}</strong>
                                <span className="text-[11px] text-emerald-800">{c.details}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 italic text-[11px]">None met yet.</p>
                        )}
                      </div>

                      {/* Section 2: Requirements Not Met */}
                      <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
                        <span className="font-bold text-rose-900 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Requirements Not Met ({item.requirementsNotMet.length})</span>
                        </span>
                        {item.requirementsNotMet.length > 0 ? (
                          <ul className="space-y-2 text-rose-950">
                            {item.requirementsNotMet.map((c) => (
                              <li key={c.id} className="leading-snug">
                                <strong className="block text-rose-900">{c.label}</strong>
                                <span className="text-[11px] text-rose-800">{c.details}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-emerald-700 font-medium text-[11px]">No disqualifications detected.</p>
                        )}
                      </div>

                      {/* Section 3: Information Still Needed */}
                      <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                        <span className="font-bold text-amber-900 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Information Needed ({item.informationNeeded.length})</span>
                        </span>
                        {item.informationNeeded.length > 0 ? (
                          <ul className="space-y-2 text-amber-950">
                            {item.informationNeeded.map((c) => (
                              <li key={c.id} className="leading-snug">
                                <strong className="block text-amber-900">{c.label}</strong>
                                <span className="text-[11px] text-amber-800">{c.details}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 italic text-[11px]">All criteria verified from your inputs.</p>
                        )}
                      </div>
                    </div>

                    {/* Official Source Link Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs border-t border-slate-100 gap-2">
                      <span className="text-slate-500">
                        Coverage: <strong>{s.fundingType}</strong> • Last verified: {s.lastVerifiedDate}
                      </span>
                      {s.officialUrl !== '#' ? (
                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <span>View official source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Official source unconfirmed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
