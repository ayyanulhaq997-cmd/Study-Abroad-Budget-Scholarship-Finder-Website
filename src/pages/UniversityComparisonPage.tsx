/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  ExternalLink,
  Search,
  Check,
  Scale,
  Calculator,
  ArrowRight,
  GraduationCap,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import { UNIVERSITIES_DATA } from '../data/universitiesData';
import { University } from '../types';

interface UniversityComparisonPageProps {
  onNavigate: (path: string) => void;
}

export const UniversityComparisonPage: React.FC<UniversityComparisonPageProps> = ({
  onNavigate,
}) => {
  const [selectedUniIds, setSelectedUniIds] = useState<string[]>([
    'tum-germany',
    'kaist-korea',
    'manchester-uk',
  ]);
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelectUni = (id: string) => {
    if (selectedUniIds.includes(id)) {
      if (selectedUniIds.length > 1) {
        setSelectedUniIds(selectedUniIds.filter((u) => u !== id));
      }
    } else {
      if (selectedUniIds.length < 4) {
        setSelectedUniIds([...selectedUniIds, id]);
      } else {
        alert('You can compare up to 4 universities side-by-side.');
      }
    }
  };

  const filteredUniversities = UNIVERSITIES_DATA.filter((u) => {
    if (filterCountry !== 'All' && u.country !== filterCountry) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchCity = u.city.toLowerCase().includes(q);
      const matchPrograms = u.popularPrograms.some((p) => p.toLowerCase().includes(q));
      if (!matchName && !matchCity && !matchPrograms) return false;
    }
    return true;
  });

  const selectedUniversities = UNIVERSITIES_DATA.filter((u) =>
    selectedUniIds.includes(u.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Institutional Benchmarking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          University Comparison Directory
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Evaluate verified international tuition ranges, local city living costs, departmental scholarship opportunities, and official direct application portals across top institutions.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <p>
            <strong>Data Integrity Standard:</strong> Unknown or program-variable fees are explicitly stated as "Varies by faculty / department" rather than fabricated. Check the official portal links provided for exact course fee schedules.
          </p>
        </div>
      </div>

      {/* University Selection and Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Universities to Compare (Selected: {selectedUniIds.length} / 4 max):
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <label className="text-slate-500 font-medium">Filter by Country:</label>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="All">All Countries</option>
              <option value="Germany">Germany</option>
              <option value="South Korea">South Korea</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        {/* Chips for selection */}
        <div className="flex flex-wrap gap-2">
          {filteredUniversities.map((u) => {
            const isSelected = selectedUniIds.includes(u.id);
            return (
              <button
                key={u.id}
                onClick={() => toggleSelectUni(u.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{u.name}</span>
                <span className="text-[10px] opacity-75">({u.country})</span>
                {isSelected ? <Check className="w-3 h-3" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-700" />
            <span>Side-by-Side University Comparison</span>
          </h2>
          <span className="text-xs text-slate-500">
            {selectedUniversities.length} Institutions Selected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-white">
              <tr>
                <th className="py-4 px-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[11px] w-48 bg-slate-50/50">
                  Parameter
                </th>
                {selectedUniversities.map((u) => (
                  <th
                    key={u.id}
                    className="py-4 px-4 text-left font-extrabold text-slate-900 border-l border-slate-200 min-w-[240px]"
                  >
                    <span className="text-base block text-blue-900">{u.name}</span>
                    <span className="text-xs font-medium text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{u.city}, {u.country}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* Row 1: Annual International Tuition Range */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  International Tuition (Annual)
                </td>
                {selectedUniversities.map((u) => (
                  <td key={u.id} className="py-3 px-4 border-l border-slate-200">
                    {u.typicalAnnualTuitionMin !== null ? (
                      <span className="font-bold text-slate-900 block font-mono">
                        {u.currencySymbol} {u.typicalAnnualTuitionMin.toLocaleString()} – {u.currencySymbol} {u.typicalAnnualTuitionMax?.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-medium text-amber-700 block text-xs">
                        Varies by department / faculty
                      </span>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {u.tuitionNote}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Row 2: Estimated City Living Cost */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Est. City Living Cost (Annual)
                </td>
                {selectedUniversities.map((u) => (
                  <td key={u.id} className="py-3 px-4 border-l border-slate-200">
                    <span className="font-bold text-blue-700 block font-mono">
                      ~{u.currencySymbol} {u.estimatedCityLivingAnnual.toLocaleString()} /yr
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Based in {u.city} accommodation & living standards
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 3: Known University & Departmental Scholarships */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Internal & Known Scholarships
                </td>
                {selectedUniversities.map((u) => (
                  <td key={u.id} className="py-3 px-4 border-l border-slate-200">
                    <ul className="space-y-1 text-xs text-slate-700">
                      {u.knownScholarships.map((sch, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <Sparkles className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                          <span>{sch}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 4: High Demand Programs */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Popular STEM & Graduate Disciplines
                </td>
                {selectedUniversities.map((u) => (
                  <td key={u.id} className="py-3 px-4 border-l border-slate-200">
                    <div className="flex flex-wrap gap-1">
                      {u.popularPrograms.map((prog, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {prog}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 5: Admission Requirements Overview */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Admissions Summary
                </td>
                {selectedUniversities.map((u) => (
                  <td key={u.id} className="py-3 px-4 border-l border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {u.admissionRequirementsSummary}
                  </td>
                ))}
              </tr>

              {/* Row 6: Official Application Portal */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Official Direct Application Portal
                </td>
                {selectedUniversities.map((u) => (
                  <td key={u.id} className="py-3.5 px-4 border-l border-slate-200">
                    <a
                      href={u.officialAdmissionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                    >
                      <span>Visit Admissions Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      {u.lastVerifiedDate}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Directory of all Universities */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          All Verified Institutional Records
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIVERSITIES_DATA.map((u) => (
            <div
              key={u.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-base text-slate-900">{u.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {u.country}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{u.city}</span>
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Indicative Tuition:</span>
                    <span className="font-semibold text-slate-800">
                      {u.typicalAnnualTuitionMin !== null
                        ? `${u.currencySymbol} ${u.typicalAnnualTuitionMin.toLocaleString()} – ${u.currencySymbol} ${u.typicalAnnualTuitionMax?.toLocaleString()}`
                        : 'Varies by faculty'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Living in {u.city}:</span>
                    <span className="font-semibold text-blue-700">
                      ~{u.currencySymbol} {u.estimatedCityLivingAnnual.toLocaleString()} /yr
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={u.officialAdmissionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                >
                  <span>Official Admissions Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
