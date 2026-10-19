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
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  Landmark,
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

  // Live editable illustrative exchange rates
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

  const handleRateChange = (countryId: string, value: string) => {
    const num = parseFloat(value);
    setCustomRates((prev) => ({
      ...prev,
      [countryId]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const resetAllRates = () => {
    const map: Record<string, number> = {};
    COUNTRIES_DATA.forEach((c) => {
      map[c.id] = c.defaultExchangeRateToPKR;
    });
    setCustomRates(map);
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
          Compare 6 premier study destinations across annual tuition ranges, statutory visa living-funds benchmarks, student work rights, post-study work visas, and verified official government portals.
        </p>

        {/* Verification & Illustrative Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <div className="leading-relaxed space-y-1">
            <p>
              <strong>Audited Standards & Statutory Distinction:</strong> Statutory proof-of-funds amounts are strict legal immigration thresholds (e.g. German Sperrkonto €11,904, Canadian IRCC CAD $23,448, UKVI London £13,761 / outside London £10,539, Australian Home Affairs AUD $29,710), whereas actual living costs vary by city and student housing choices.
            </p>
            <p className="text-[11px] text-blue-800">
              Exchange rates below are editable illustrative estimates. Converted values are never silently fabricated.
            </p>
          </div>
        </div>
      </div>

      {/* Country Selection Chips */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Destinations to Compare (Selected: {selectedCountryIds.length} / 4 max):
          </span>
          <span className="text-xs text-slate-500">Click to toggle countries into the comparison matrix</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {COUNTRIES_DATA.map((c) => {
            const isSelected = selectedCountryIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleSelectCountry(c.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer border ${
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

      {/* Interactive User-Editable Exchange Rate Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Exchange Rates Used for Converted Illustrative Estimates (PKR)
            </span>
          </div>
          <button
            onClick={resetAllRates}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Default Rates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
          {COUNTRIES_DATA.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-xl border transition-all ${
                selectedCountryIds.includes(c.id)
                  ? 'bg-blue-50/40 border-blue-200'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <span>{c.flag}</span>
                  <span>{c.currencyCode}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1 {c.currencyCode} =</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={customRates[c.id] ?? c.defaultExchangeRateToPKR}
                  onChange={(e) => handleRateChange(c.id, e.target.value)}
                  className="w-full pr-10 pl-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <span className="absolute inset-y-0 right-0 pr-2 flex items-center font-bold text-slate-400 text-[10px]">
                  PKR
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Illustrative estimate</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Table / Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Scale className="w-5 h-5 text-blue-700" />
              <span>Side-by-Side Financial & Visa Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing {selectedCountries.length} destinations with explicit separation of statutory visa proof vs actual living costs.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 text-slate-700">
            {selectedCountries.length} countries displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-white">
              <tr>
                <th className="py-4 px-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[11px] w-52 bg-slate-50/50">
                  Parameter
                </th>
                {selectedCountries.map((c) => (
                  <th
                    key={c.id}
                    className="py-4 px-4 text-left font-extrabold text-slate-900 border-l border-slate-200 min-w-[240px]"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <span className="text-base block">{c.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          Billing Currency: {c.currencyCode} ({c.currencySymbol})
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
                  <span className="text-[10px] text-slate-500 block font-normal">Original currency</span>
                </td>
                {selectedCountries.map((c) => {
                  const rate = customRates[c.id] || c.defaultExchangeRateToPKR;
                  const minPKR = c.typicalTuitionMin * rate;
                  const maxPKR = c.typicalTuitionMax * rate;
                  return (
                    <td key={c.id} className="py-3 px-4 border-l border-slate-200">
                      <span className="font-bold text-slate-900 block font-mono">
                        {c.currencySymbol} {c.typicalTuitionMin.toLocaleString()} – {c.currencySymbol} {c.typicalTuitionMax.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-600 block font-mono mt-0.5">
                        ≈ {formatCurrency(minPKR, 'PKR')} – {formatCurrency(maxPKR, 'PKR')}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        (At 1 {c.currencyCode} = {rate} PKR)
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Actual Estimated Annual Living Expenses */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Actual Living Expenses
                  <span className="text-[10px] text-slate-500 block font-normal">Estimated annual range</span>
                </td>
                {selectedCountries.map((c) => {
                  const rate = customRates[c.id] || c.defaultExchangeRateToPKR;
                  const minLivingPKR = c.typicalLivingMin * rate;
                  const maxLivingPKR = c.typicalLivingMax * rate;
                  return (
                    <td key={c.id} className="py-3 px-4 border-l border-slate-200">
                      <span className="font-semibold text-slate-900 block font-mono">
                        {c.currencySymbol} {c.typicalLivingMin.toLocaleString()} – {c.currencySymbol} {c.typicalLivingMax.toLocaleString()} /yr
                      </span>
                      <span className="text-xs text-slate-600 block font-mono mt-0.5">
                        ≈ {formatCurrency(minLivingPKR, 'PKR')} – {formatCurrency(maxLivingPKR, 'PKR')}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Varies by city, rent, and lifestyle.
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Statutory Proof-of-Funds (Visa Legal Benchmark) */}
              <tr className="bg-amber-50/20">
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-amber-50/40">
                  Statutory Visa Living Proof
                  <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                    Official Legal Benchmark
                  </span>
                </td>
                {selectedCountries.map((c) => {
                  const rate = customRates[c.id] || c.defaultExchangeRateToPKR;
                  const proofPKR = c.statutoryAnnualLivingProof * rate;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-200">
                      {c.id === 'uk' ? (
                        <div className="space-y-1">
                          <div>
                            <span className="font-bold text-blue-700 block font-mono">
                              London: £13,761 (£1,529/mo × 9)
                            </span>
                            <span className="text-xs font-semibold text-slate-700 font-mono">
                              ≈ {formatCurrency(13761 * rate, 'PKR')}
                            </span>
                          </div>
                          <div className="pt-1 border-t border-slate-200">
                            <span className="font-bold text-slate-900 block font-mono">
                              Outside London: £10,539 (£1,171/mo × 9)
                            </span>
                            <span className="text-xs font-semibold text-slate-700 font-mono">
                              ≈ {formatCurrency(10539 * rate, 'PKR')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-blue-700 block font-mono">
                            {c.currencySymbol} {c.statutoryAnnualLivingProof.toLocaleString()} /yr
                          </span>
                          <span className="text-xs font-semibold text-slate-700 block font-mono">
                            ≈ {formatCurrency(proofPKR, 'PKR')}
                          </span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        {c.officialProofOfFundsRequirement}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Transparent First-Year All-In Total Calculation */}
              <tr className="bg-blue-50/30">
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-100/60">
                  Est. 1st-Year Financial All-In
                  <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                    Tuition (min) + Statutory Proof + ~PKR 4.5L pre-departure
                  </span>
                </td>
                {selectedCountries.map((c) => {
                  const rate = customRates[c.id] || c.defaultExchangeRateToPKR;
                  // First-year total calculation
                  const firstYearPKR =
                    (c.typicalTuitionMin + c.statutoryAnnualLivingProof) * rate + 450000;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-200 space-y-1">
                      <span className="text-base font-extrabold text-blue-900 block font-mono">
                        {formatCurrency(firstYearPKR, 'PKR')}
                      </span>
                      <span className="text-xs font-bold text-slate-600 block">
                        {formatPakistaniDenominations(firstYearPKR)}
                      </span>
                      {c.id === 'south-korea' && (
                        <div className="mt-1.5 p-2 rounded bg-white border border-blue-200 text-[11px] text-blue-950 font-mono leading-tight">
                          <strong>Audited Calculation:</strong>
                          <br />
                          PKR 4,472,000 (Living Proof) + PKR 1,120,000 (Tuition) + PKR 450,000 (Pre-departure) ={' '}
                          <strong>PKR 6,042,000</strong>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Part-Time Work Permission & Official Rules */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Part-Time Work Permission
                  <span className="text-[10px] text-slate-500 block font-normal">Official regulations & exceptions</span>
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
                    <div className="flex items-start space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{c.partTimeWorkRights}</span>
                    </div>
                    {c.workRightsOfficialSource && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <strong>Source: </strong>{c.workRightsOfficialSource}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 6: Post-Study Work Visa (PSW) Duration & Criteria */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Post-Study Work Visa (PSW)
                  <span className="text-[10px] text-slate-500 block font-normal">Duration & qualification levels</span>
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
                    <div className="flex items-start space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{c.postStudyWorkVisa}</span>
                    </div>
                    {c.postStudyOfficialSource && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <strong>Source: </strong>{c.postStudyOfficialSource}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 7: Visa Processing Duration */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Visa Processing Timeline
                  <span className="text-[10px] text-slate-500 block font-normal">Variable estimates</span>
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

              {/* Row 8: Verified Official Government Sources & Last Verified Date */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 bg-slate-50/50">
                  Verified Official Portals
                  <span className="text-[10px] text-slate-500 block font-normal">Last verified: October 19, 2026</span>
                </td>
                {selectedCountries.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 border-l border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="font-semibold flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                      <span className="font-mono text-[10px]">{c.lastVerifiedDate}</span>
                    </div>

                    <div className="space-y-1">
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
                  Calculator Action
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            In-Depth Destination Intelligence & Key Advisories
          </h2>
          <span className="text-xs text-slate-500">6 Verified Countries</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRIES_DATA.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{c.flag}</span>
                    <h3 className="font-bold text-base text-slate-900">{c.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {c.currencyCode} ({c.currencySymbol})
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.notes}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold text-slate-700">Statutory Living Proof:</span>
                    <span className="font-bold text-blue-700 font-mono">
                      {c.currencySymbol} {c.statutoryAnnualLivingProof.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold text-slate-700">Part-Time Work:</span>
                    <span className="font-medium text-slate-900 text-right truncate max-w-[170px]">
                      {c.partTimeWorkRights.split('(')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold text-slate-700">PSW Duration:</span>
                    <span className="font-medium text-slate-900 text-right truncate max-w-[170px]">
                      {c.postStudyWorkVisa.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last verified: {c.lastVerifiedDate}</span>
                  <a
                    href={c.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                  >
                    <span>View official source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
