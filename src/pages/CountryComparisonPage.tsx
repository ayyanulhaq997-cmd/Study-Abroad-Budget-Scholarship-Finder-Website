/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe2,
  ExternalLink,
  Check,
  Scale,
  Calculator,
  ArrowRight,
  ShieldAlert,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';
import { COUNTRIES_DATA } from '../data/countriesData';
import { Country } from '../types';
import { formatCurrency, formatPakistaniDenominations } from '../services/budgetCalculator';

interface CountryComparisonPageProps {
  onNavigate: (path: string) => void;
}

export const CountryComparisonPage: React.FC<CountryComparisonPageProps> = ({
  onNavigate,
}) => {
  // Allow multi-selection for side-by-side comparison (default 3 countries)
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>([
    'germany',
    'south-korea',
    'uk',
  ]);

  // Allow live editing of illustrative tuition & living for comparison
  const [customRates, setCustomRates] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    COUNTRIES_DATA.forEach((c) => {
      map[c.id] = c.defaultExchangeRateToPKR;
    });
    return map;
  });

  const toggleSelectCountry = (id: string) => {
    if (selectedCountryIds.includes(id)) {
      if (selectedCountryIds.length > 1) {
        setSelectedCountryIds(selectedCountryIds.filter((c) => c !== id));
      }
    } else {
      if (selectedCountryIds.length < 4) {
        setSelectedCountryIds([...selectedCountryIds, id]);
      } else {
        alert('You can compare up to 4 countries side-by-side simultaneously.');
      }
    }
  };

  const selectedCountries = COUNTRIES_DATA.filter((c) =>
    selectedCountryIds.includes(c.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <Globe2 className="w-4 h-4" />
          <span>Cross-Border Higher Education Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Study Abroad Country Comparison
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Compare 6 premier study destinations across annual tuition ranges, statutory living expense requirements, student part-time work rights, post-study work visas, and verified official government portals.
        </p>

        {/* Verification & Illustrative Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Transparency Notice:</strong> Values below are illustrative estimates based on published government proof-of-funds baselines (e.g. German Sperrkonto, Canadian IRCC regulations). They are not guaranteed prices and vary by institution and city. Exchange rates are editable user estimates.
          </p>
        </div>
      </div>

      {/* Country Selection Chips */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Destinations to Compare (Selected: {selectedCountryIds.length} / 4 max):
          </span>
          <span className="text-xs text-slate-500">Click to toggle countries into the comparison table</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {COUNTRIES_DATA.map((c) => {
            const isSelected = selectedCountryIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleSelectCountry(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span>{c.name}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Table / Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-700" />
            <span>Side-by-Side Financial & Visa Matrix</span>
          </h2>
          <span className="text-xs text-slate-500">
            {selectedCountries.length} countries side-by-side
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-white">
              <tr>
                <th className="py-4 px-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[11px] w-48 bg-slate-50/50">
                  Parameter
                </th>
                {selectedCountries.map((c) => (
                  <th
                    key={c.id}
                    className="py-4 px-4 text-left font-extrabold text-slate-900 border-l border-slate-200 min-w-[220px]"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <span className="text-base block">{c.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          Currency: {c.currencyCode} ({c.currencySymbol})
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* Row 1: Typical Annual Tuition Range */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Annual Tuition Range
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200">
                    <span className="font-bold text-slate-900 block font-mono">
                      {c.currencySymbol} {c.typicalTuitionMin.toLocaleString()} – {c.currencySymbol} {c.typicalTuitionMax.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 block font-mono mt-0.5">
                      ~PKR {((c.typicalTuitionMin * (customRates[c.id] || c.defaultExchangeRateToPKR)) / 100000).toFixed(1)}L – {((c.typicalTuitionMax * (customRates[c.id] || c.defaultExchangeRateToPKR)) / 100000).toFixed(1)}L /yr
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Statutory Living Expense Benchmark */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Statutory Living Proof (Annual)
                </td>
                {selectedCountries.map((c) => {
                  const livingPKR = c.statutoryAnnualLivingProof * (customRates[c.id] || c.defaultExchangeRateToPKR);
                  return (
                    <td key={c.id} className="py-3 px-4 border-l border-slate-200">
                      <span className="font-bold text-blue-700 block font-mono">
                        {c.currencySymbol} {c.statutoryAnnualLivingProof.toLocaleString()} /yr
                      </span>
                      <span className="text-xs font-semibold text-slate-700 block font-mono">
                        ≈ {formatCurrency(livingPKR, 'PKR')}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1 leading-snug">
                        {c.officialProofOfFundsRequirement}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Estimated 1st-Year Total (Tuition + Living + Pre-departure) */}
              <tr className="bg-blue-50/30">
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-100/60">
                  Est. 1st-Year All-In Total
                  <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                    (Includes ~PKR 4.5L pre-departure)
                  </span>
                </td>
                {selectedCountries.map((c) => {
                  const rate = customRates[c.id] || c.defaultExchangeRateToPKR;
                  const firstYearPKR = (c.typicalTuitionMin + c.statutoryAnnualLivingProof) * rate + 450000;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-200">
                      <span className="text-base font-extrabold text-blue-900 block font-mono">
                        {formatCurrency(firstYearPKR, 'PKR')}
                      </span>
                      <span className="text-xs font-bold text-slate-600 block">
                        {formatPakistaniDenominations(firstYearPKR)}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Part-Time Work Rights */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Part-Time Work Permission
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-start space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{c.partTimeWorkRights}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 5: Post-Study Work Visa (PSW) */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Post-Study Work Visa (PSW)
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-start space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{c.postStudyWorkVisa}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 6: Visa Processing Duration */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Typical Visa Timeline
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.visaProcessingWeeks}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 7: Popular STEM & Business Disciplines */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  High-Demand Fields
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200">
                    <div className="flex flex-wrap gap-1">
                      {c.popularSubjects.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 8: Verified Official Government Links */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Verified Official Portals
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 border-l border-slate-200">
                    <div className="space-y-1.5">
                      {c.officialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 hover:underline"
                        >
                          <span className="truncate max-w-[190px]">{link.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 9: Direct Action into Budget Calculator */}
              <tr className="bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-100/60">
                  Action
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200">
                    <button
                      onClick={() => onNavigate('/budget-calculator')}
                      className="w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Audit {c.name} in Calculator</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Destination Detail Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          In-Depth Destination Intelligence & Key Advisories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRIES_DATA.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{c.flag}</span>
                    <h4 className="font-bold text-base text-slate-900">{c.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {c.currencyCode}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Blocked/Living Proof:</span>
                  <span className="font-semibold text-slate-900">
                    {c.currencySymbol} {c.statutoryAnnualLivingProof.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Part-time rights:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[160px] text-right">
                    {c.partTimeWorkRights.split('(')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
