/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Save,
  RotateCcw,
  Printer,
  Share2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Check,
  Building,
  Plane,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { COUNTRIES_DATA } from '../data/countriesData';
import {
  BudgetCalculationResult,
  BudgetInput,
  Country,
  SavedBudgetProfile,
} from '../types';
import {
  calculateBudget,
  DEFAULT_BUDGET_INPUT,
  DEFAULT_PRE_DEPARTURE_PKR,
  formatCurrency,
  formatPakistaniDenominations,
  getPresetInput,
} from '../services/budgetCalculator';
import { PrintableReportModal } from '../components/PrintableReportModal';

const LOCAL_STORAGE_KEY = 'globaledu_study_budget_v1';
const SAVED_PROFILES_KEY = 'globaledu_saved_profiles_v1';

export const BudgetCalculatorPage: React.FC = () => {
  // Input State initialized from localStorage or defaults
  const [input, setInput] = useState<BudgetInput>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved budget', e);
    }
    return DEFAULT_BUDGET_INPUT;
  });

  // Saved scenarios state
  const [savedProfiles, setSavedProfiles] = useState<SavedBudgetProfile[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_PROFILES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return [];
  });

  // UI States
  const [showPreDepartureDetails, setShowPreDepartureDetails] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [copiedLinkNotice, setCopiedLinkNotice] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  // Active Destination Country metadata
  const activeCountry = useMemo<Country>(() => {
    return (
      COUNTRIES_DATA.find((c) => c.id === input.destinationCountryId) ||
      COUNTRIES_DATA[0]
    );
  }, [input.destinationCountryId]);

  // Save current inputs to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(input));
    } catch (e) {
      console.error('LocalStorage write failed', e);
    }
  }, [input]);

  // Validation
  const validateInputs = () => {
    const errors: Record<string, string> = {};
    if (input.exchangeRateToPKR <= 0) {
      errors.exchangeRate = 'Exchange rate must be greater than zero.';
    }
    if (input.studyDurationYears < 1 || input.studyDurationYears > 8) {
      errors.duration = 'Study duration must be between 1 and 8 years.';
    }
    if (input.annualTuitionForeign < 0) {
      errors.tuition = 'Tuition cannot be negative.';
    }
    if (input.annualLivingForeign < 0) {
      errors.living = 'Living expenses cannot be negative.';
    }
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateInputs();
  }, [input]);

  // Calculation Results
  const result = useMemo<BudgetCalculationResult>(() => {
    return calculateBudget(input, activeCountry);
  }, [input, activeCountry]);

  // Preset Handlers
  const handleApplyPreset = (presetId: string) => {
    const preset = getPresetInput(presetId);
    setInput(preset);
  };

  const handleCountryChange = (countryId: string) => {
    const country = COUNTRIES_DATA.find((c) => c.id === countryId);
    if (!country) return;

    setInput((prev) => ({
      ...prev,
      destinationCountryId: countryId,
      exchangeRateToPKR: country.defaultExchangeRateToPKR,
      annualTuitionForeign: country.typicalTuitionMin,
      annualLivingForeign: country.statutoryAnnualLivingProof,
    }));
  };

  const handleReset = () => {
    if (window.confirm('Reset all values to default Germany Master’s scenario?')) {
      setInput(DEFAULT_BUDGET_INPUT);
    }
  };

  const handleSaveProfile = () => {
    const profileName = prompt(
      'Enter a name for this budget scenario (e.g. "Germany 2-Year Master" or "US State University"):',
      `${activeCountry.name} - ${input.studyDurationYears} Year(s)`
    );
    if (!profileName) return;

    const newProfile: SavedBudgetProfile = {
      id: Date.now().toString(),
      title: profileName,
      savedAt: new Date().toLocaleDateString(),
      destinationCountryName: activeCountry.name,
      input: { ...input },
      result: { ...result },
    };

    const updated = [newProfile, ...savedProfiles.slice(0, 9)];
    setSavedProfiles(updated);
    try {
      localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleLoadProfile = (profile: SavedBudgetProfile) => {
    setInput(profile.input);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedProfiles.filter((p) => p.id !== id);
    setSavedProfiles(updated);
    localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(updated));
  };

  const handleCopyShareSummary = () => {
    const summary = `Study Abroad Budget Plan for ${activeCountry.name} (${input.studyDurationYears} yr): Total Cost: ${formatCurrency(result.totalDegreeCostPKR, 'PKR')} (~${formatCurrency(result.totalDegreeCostForeign, result.destinationCurrencyCode)}). Pre-departure funds needed: ${formatCurrency(result.estimatedBeforeDepartureNeededPKR, 'PKR')}. Calculated on GlobalEdu.`;
    navigator.clipboard.writeText(summary);
    setCopiedLinkNotice(true);
    setTimeout(() => setCopiedLinkNotice(false), 2500);
  };

  // Statutory comparison warning
  const isBelowStatutoryLivingProof =
    activeCountry.statutoryAnnualLivingProof > 0 &&
    input.annualLivingForeign < activeCountry.statutoryAnnualLivingProof;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Interactive Financial Audit Tool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Study Abroad Budget Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Simulate your complete financial lifecycle: one-time pre-departure expenses, annual recurring tuition and living, and measure your exact family funding shortfall in PKR.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleSaveProfile}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Save this calculation scenario to browser"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>{saveSuccessNotice ? 'Saved!' : 'Save Scenario'}</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Print or export PDF report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleCopyShareSummary}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Copy plan summary to clipboard"
          >
            {copiedLinkNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLinkNotice ? 'Copied' : 'Share Plan'}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
            title="Reset calculator values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Shortcuts */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick-Load Verified Presets</span>
          </span>
          <span className="text-[11px] text-slate-500">Click any preset to populate verified standard values:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'germany-master', label: '🇩🇪 Germany Public Uni (Blocked Account)', desc: '0 Tuition, €11,904 Living' },
            { id: 'usa-stem-master', label: '🇺🇸 USA State University (MS STEM)', desc: '$26k Tuition, $15.5k Living' },
            { id: 'uk-one-year-msc', label: '🇬🇧 UK 1-Year Master’s', desc: '£19.5k Tuition, 12 Mo Living' },
            { id: 'canada-master', label: '🇨🇦 Canada University', desc: 'CA$21k Tuition, CA$20.6k Living' },
            { id: 'korea-stem-master', label: '🇰🇷 South Korea STEM / GKS', desc: '$6.5k Tuition, $8k Living' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Study Origin, Destination & Duration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
              <span>Destination & Currency Conversion</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Home Country & Currency
                </label>
                <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 flex items-center justify-between">
                  <span>🇵🇰 Pakistan (PKR - Pakistani Rupee)</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">Default</span>
                </div>
              </div>

              {/* Destination Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Destination Country
                </label>
                <select
                  value={input.destinationCountryId}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
                >
                  {COUNTRIES_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name} ({c.currencyCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exchange Rate Field: USER PROVIDED NOTICE */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center space-x-1.5">
                  <span>Conversion Rate: 1 {activeCountry.currencyCode} in PKR</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                    User-Provided
                  </span>
                </label>
                <span className="text-[11px] text-slate-500">Edit according to your bank or market</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                    PKR
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={input.exchangeRateToPKR}
                    onChange={(e) =>
                      setInput({ ...input, exchangeRateToPKR: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full pl-12 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setInput({ ...input, exchangeRateToPKR: activeCountry.defaultExchangeRateToPKR })
                  }
                  className="px-2.5 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Reset Reference ({activeCountry.defaultExchangeRateToPKR})
                </button>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Note: This is a user-editable rate. Currency rates fluctuate daily; please verify the actual telegraphic transfer (TT) or cash rate with your foreign exchange provider.
              </p>
            </div>

            {/* Study Duration */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Study Duration in Years
                </label>
                <span className="text-xs font-bold text-blue-700 font-mono">
                  {input.studyDurationYears} Year{input.studyDurationYears > 1 ? 's' : ''} ({input.studyDurationYears * 12} Months)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((yearVal) => (
                  <button
                    key={yearVal}
                    type="button"
                    onClick={() => setInput({ ...input, studyDurationYears: yearVal })}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      input.studyDurationYears === yearVal
                        ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {yearVal} {yearVal === 1 ? 'Year (e.g. UK MSc)' : yearVal === 2 ? 'Years (Master’s)' : 'Years'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Annual Recurring Costs (Tuition + Living + Insurance) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                <span>Annual Recurring Expenses ({activeCountry.currencyCode})</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Total: {formatCurrency(result.annualRecurringForeign, activeCountry.currencyCode)}/yr
              </span>
            </div>

            {/* Annual Tuition Fee */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-800">
                  Annual Tuition Fee ({activeCountry.currencyCode})
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  = {formatCurrency(input.annualTuitionForeign * input.exchangeRateToPKR, 'PKR')}/yr
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                  {activeCountry.currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={input.annualTuitionForeign}
                  onChange={(e) =>
                    setInput({ ...input, annualTuitionForeign: Math.max(0, parseFloat(e.target.value) || 0) })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  placeholder="0 (Tuition Free or specify)"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                For Germany public universities, this is typically €0. For USA/UK/Canada/Australia, enter annual international tuition.
              </p>
            </div>

            {/* Annual Living Expenses */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-800">
                  Annual Living Expenses (Rent, Food, Utilities, Transport in {activeCountry.currencyCode})
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  = {formatCurrency(input.annualLivingForeign * input.exchangeRateToPKR, 'PKR')}/yr
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                  {activeCountry.currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={input.annualLivingForeign}
                  onChange={(e) =>
                    setInput({ ...input, annualLivingForeign: Math.max(0, parseFloat(e.target.value) || 0) })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {/* Statutory Warning */}
              {isBelowStatutoryLivingProof && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Official Living Proof Warning: </span>
                    {activeCountry.name} requires proving at least {activeCountry.currencySymbol}{' '}
                    {activeCountry.statutoryAnnualLivingProof.toLocaleString()} per year for student visa issuance ({activeCountry.officialProofOfFundsRequirement}). Entering a lower figure might understate your required embassy proof.
                  </div>
                </div>
              )}
            </div>

            {/* Health Insurance & Miscellaneous */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Annual Health Insurance ({activeCountry.currencyCode})
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                    {activeCountry.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={input.annualHealthInsuranceForeign}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        annualHealthInsuranceForeign: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Annual Semester / Admin Fee ({activeCountry.currencyCode})
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                    {activeCountry.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={input.annualMiscellaneousForeign}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        annualMiscellaneousForeign: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: One-Time Pre-Departure Costs (PKR Base) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                  <span>One-Time Pre-Departure Costs</span>
                </h2>
                <p className="text-xs text-slate-500">Expenses before departure (attestations, visa, IELTS, airfare)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-blue-700 block">
                  {formatCurrency(result.oneTimePreDeparturePKR, 'PKR')}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ~{formatCurrency(result.oneTimePreDepartureForeign, activeCountry.currencyCode)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Itemized breakdown of Pakistan departure setup expenses:
              </span>
              <button
                type="button"
                onClick={() => setShowPreDepartureDetails(!showPreDepartureDetails)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>{showPreDepartureDetails ? 'Collapse Details' : 'Expand & Edit Breakdown'}</span>
                {showPreDepartureDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showPreDepartureDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Document Attestation (HEC, IBCC, MOFA) [PKR]
                  </label>
                  <input
                    type="number"
                    value={input.preDepartureCosts.documentAttestationPKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        preDepartureCosts: {
                          ...input.preDepartureCosts,
                          documentAttestationPKR: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    IELTS / TOEFL Examination Fee [PKR]
                  </label>
                  <input
                    type="number"
                    value={input.preDepartureCosts.ieltsExamFeePKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        preDepartureCosts: {
                          ...input.preDepartureCosts,
                          ieltsExamFeePKR: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    University Application Fees (uni-assist / direct) [PKR]
                  </label>
                  <input
                    type="number"
                    value={input.preDepartureCosts.universityApplicationFeesPKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        preDepartureCosts: {
                          ...input.preDepartureCosts,
                          universityApplicationFeesPKR: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Visa Application & Gerry’s/VFS Biometrics [PKR]
                  </label>
                  <input
                    type="number"
                    value={input.preDepartureCosts.visaAndBiometricFeePKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        preDepartureCosts: {
                          ...input.preDepartureCosts,
                          visaAndBiometricFeePKR: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Airfare Ticket (One-way / Return) [PKR]
                  </label>
                  <input
                    type="number"
                    value={input.preDepartureCosts.airfarePKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        preDepartureCosts: {
                          ...input.preDepartureCosts,
                          airfarePKR: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Initial Setup, SIM & Clothing [PKR]
                  </label>
                  <input
                    type="number"
                    value={input.preDepartureCosts.miscellaneousSetupPKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        preDepartureCosts: {
                          ...input.preDepartureCosts,
                          miscellaneousSetupPKR: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Available Student/Family Funding in PKR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
              <span>Available Family & Personal Resources (PKR)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Available One-Time Lump Sum (PKR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                    PKR
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={input.availableOneTimeFundsPKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        availableOneTimeFundsPKR: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full pl-12 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {formatPakistaniDenominations(input.availableOneTimeFundsPKR)} (Savings, family assets)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Available Annual Sponsorship (PKR/Year)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-mono">
                    PKR
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={input.availableAnnualBudgetPKR}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        availableAnnualBudgetPKR: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full pl-12 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {formatPakistaniDenominations(input.availableAnnualBudgetPKR)} /year recurring
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Results & Audit Dashboard (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Main Financial Audit Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
            {/* Header Status Banner */}
            <div
              className={`p-5 text-white ${
                result.isShortfall
                  ? 'bg-gradient-to-r from-amber-600 to-rose-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">
                <span>{result.isShortfall ? 'Budget Shortfall Identified' : 'Budget Comfortably Funded'}</span>
                <span>{input.studyDurationYears} Year Plan</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {result.isShortfall
                  ? `-${formatCurrency(result.shortfallPKR, 'PKR')}`
                  : `+${formatCurrency(result.surplusPKR, 'PKR')}`}
              </div>
              <div className="text-xs opacity-90 mt-1 font-medium">
                {result.isShortfall
                  ? `Funding gap: ${formatPakistaniDenominations(result.shortfallPKR)}`
                  : `Surplus: ${formatPakistaniDenominations(result.surplusPKR)}`}
              </div>
            </div>

            {/* Core KPI Matrix */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    1st-Year Total Cost
                  </span>
                  <span className="text-sm font-bold text-slate-900 block font-mono">
                    {formatCurrency(result.firstYearTotalPKR, 'PKR')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    ~{formatCurrency(result.firstYearTotalForeign, activeCountry.currencyCode)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Annual Recurring Cost
                  </span>
                  <span className="text-sm font-bold text-slate-900 block font-mono">
                    {formatCurrency(result.annualRecurringPKR, 'PKR')}/yr
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    ~{formatCurrency(result.annualRecurringForeign, activeCountry.currencyCode)}/yr
                  </span>
                </div>
              </div>

              {/* Grand Total Degree Cost */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block">
                    Total Degree Cost ({input.studyDurationYears} Year{input.studyDurationYears > 1 ? 's' : ''})
                  </span>
                  <span className="text-base font-extrabold text-blue-900 font-mono">
                    {formatCurrency(result.totalDegreeCostPKR, 'PKR')}
                  </span>
                  <span className="text-[11px] text-blue-700 block font-medium">
                    {formatPakistaniDenominations(result.totalDegreeCostPKR)}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-blue-800 block">
                    {formatCurrency(result.totalDegreeCostForeign, activeCountry.currencyCode)}
                  </span>
                  <span className="text-[10px] text-blue-600 block">Foreign Currency</span>
                </div>
              </div>

              {/* Crucial Upfront Metric: Needed Before Departure */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                    Est. Needed Before Boarding Flight
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formatCurrency(result.estimatedBeforeDepartureNeededPKR, 'PKR')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Covers one-time setup ({formatCurrency(result.oneTimePreDeparturePKR, 'PKR')}) plus visa proof of funds / blocked account deposit.
                </p>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Expense Distribution</span>
                  <span>100% Total Degree</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  {result.breakdown.map((item, idx) => {
                    const colors = [
                      'bg-blue-600',
                      'bg-indigo-600',
                      'bg-emerald-600',
                      'bg-amber-500',
                      'bg-purple-600',
                    ];
                    return (
                      <div
                        key={item.id}
                        style={{ width: `${Math.max(1, item.percentageOfTotal)}%` }}
                        className={`${colors[idx % colors.length]} transition-all`}
                        title={`${item.label}: ${item.percentageOfTotal.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Pre-Departure</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>Tuition</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Living Expenses</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Insurance & Fees</span>
                  </div>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="pt-2 border-t border-slate-100">
                {result.isShortfall ? (
                  <div className="text-xs text-slate-600 space-y-2">
                    <p className="font-semibold text-slate-800">
                      Recommendation for this shortfall:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                      <li>Target 100% tuition-waiver scholarships or government grants (GKS, DAAD EPOS, Chevening).</li>
                      <li>Consider Germany where public university tuition is €0.</li>
                      <li>Verify part-time work permissions to offset living costs ({activeCountry.partTimeWorkRights}).</li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="font-bold">Funding Capacity Verified:</span> Your planned capital covers baseline requirements. Maintain funds in your bank account for the required tenure (e.g. 28 days for UK) to secure the visa without delays.
                  </div>
                )}
              </div>
            </div>

            {/* Print and Export Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Audit generated locally</span>
              <button
                onClick={() => setShowPrintModal(true)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Audit Statement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Saved Scenarios Card */}
          {savedProfiles.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Your Saved Scenarios ({savedProfiles.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedProfiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleLoadProfile(p)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 block group-hover:text-blue-700">
                        {p.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Saved: {p.savedAt} • {formatCurrency(p.result.totalDegreeCostPKR, 'PKR')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteProfile(p.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                      title="Remove profile"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Report Modal */}
      <PrintableReportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        input={input}
        result={result}
        country={activeCountry}
      />
    </div>
  );
};
