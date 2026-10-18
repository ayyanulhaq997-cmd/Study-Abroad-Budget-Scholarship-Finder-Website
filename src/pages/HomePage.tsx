/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calculator,
  Award,
  Globe2,
  Building2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Banknote,
  FileCheck,
  Scale,
  Compass,
} from 'lucide-react';
import { COUNTRIES_DATA } from '../data/countriesData';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why should I calculate study abroad expenses in PKR rather than only foreign currencies?',
      a: 'Currency exchange fluctuations can dramatically impact your total family expenditure. A 10% change in the EUR/PKR or USD/PKR exchange rate can mean a difference of 10 to 30 Lakh PKR over a two-year degree. Budgeting with realistic PKR conversions prevents unexpected mid-degree funding emergencies.',
    },
    {
      q: 'What is the German Blocked Account (Sperrkonto), and is it recurring?',
      a: 'The Sperrkonto is a mandatory German government requirement for non-EU students to prove they can sustain themselves. The statutory benchmark is currently €992 per month (€11,904 for the first year). Once in Germany, you can withdraw up to €992 each month to pay for rent, food, and health insurance. It must typically be renewed for your second year if required by your local Ausländerbehörde (Foreigners’ Authority).',
    },
    {
      q: 'What is the difference between one-time pre-departure costs and recurring annual costs?',
      a: 'Pre-departure costs occur only once before you board the aircraft: degree attestation (HEC/IBCC/MOFA), IELTS test fees, visa fees, embassy appointments, medical/biometrics, and airfare. Recurring annual costs happen every year of study: tuition fees, living expenses (rent, groceries, transit), and student health insurance.',
    },
    {
      q: 'Are the scholarship deadlines and requirements in this tool guaranteed?',
      a: 'No scholarship deadline or admission outcome is ever guaranteed. GlobalEdu only lists verified scholarships whose eligibility requirements are published by official government or university providers (such as USEFP, Chevening, DAAD, and NIIED). Always verify specific dates and requirements directly on the official portals provided before applying.',
    },
    {
      q: 'How does the Scholarship Eligibility Matcher work?',
      a: 'Unlike tools that generate arbitrary "probability percentages", our Eligibility Matcher evaluates your academic marks, IELTS score, degree level, and work history directly against the published minimum criteria of verified scholarships, giving you a transparent checklist of requirements met, requirements not met, and necessary documentation.',
    },
    {
      q: 'Can I work part-time while studying abroad to cover my costs?',
      a: 'Most countries allow international students to work part-time (e.g. 20 hours/week in the UK and Canada, 140 full days/year in Germany, 48 hours/fortnight in Australia). However, part-time wages should be viewed as supplementary income for day-to-day personal expenses, not as a guaranteed way to pay large tuition fees.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 bg-linear-to-b from-blue-50/60 via-slate-50 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headings & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Transparent Financial Planning for Pakistani & International Scholars</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Plan Your Study Abroad Journey
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Estimate true study costs, compare living requirements in PKR, identify pre-departure funding gaps, and match with verified international scholarships — built without marketing fluff or hidden agendas.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => onNavigate('/budget-calculator')}
                  className="inline-flex items-center justify-center space-x-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-md shadow-blue-700/25 transition-all cursor-pointer"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Calculate My Study Budget</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onNavigate('/scholarships')}
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Explore Scholarships</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 max-w-lg text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>User-Controlled Exchange Rates</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero Double-Counting</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Official Sources</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Calculation Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 sm:p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Quick Cost Snapshot</h2>
                    <p className="text-xs text-slate-500">Typical 1st-Year Financial Benchmarks</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    Verified Guidelines
                  </span>
                </div>

                <div className="space-y-3.5">
                  {COUNTRIES_DATA.slice(0, 4).map((c) => {
                    const sampleFirstYearPKR = (c.typicalTuitionMin + c.statutoryAnnualLivingProof) * c.defaultExchangeRateToPKR + 450000;
                    return (
                      <div
                        key={c.id}
                        onClick={() => onNavigate('/countries')}
                        className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl" aria-hidden="true">{c.flag}</span>
                          <div>
                            <span className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                              {c.name}
                            </span>
                            <span className="text-xs text-slate-500 block">
                              Living Proof: {c.currencySymbol} {c.statutoryAnnualLivingProof.toLocaleString()} /yr
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-slate-900 block">
                            ~{(sampleFirstYearPKR / 100000).toFixed(1)} Lakh PKR
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Est. 1st-Yr Total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('/countries')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Compare All 6 Destinations Side-by-Side</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Higher Education Toolkit
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Four specialized modules crafted to eliminate financial surprises and help you make confident decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Budget Calculator */}
          <div
            onClick={() => onNavigate('/budget-calculator')}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-700 group-hover:text-white transition-all">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                Budget Calculator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Separate pre-departure setup costs from recurring tuition, test your custom exchange rate, and measure funding gaps.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-700">
              <span>Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Country Comparison */}
          <div
            onClick={() => onNavigate('/countries')}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Country Comparison
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Compare Germany, South Korea, USA, Canada, UK, and Australia by statutory living proof, work rights, and PSW visas.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
              <span>Compare Destinations</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Scholarship Finder */}
          <div
            onClick={() => onNavigate('/scholarships')}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                Scholarship Finder
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filter strictly verified scholarships by degree level, subject (including CS & AI), funding type, and authentic official portals.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700">
              <span>Find Verified Grants</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: University Comparison */}
          <div
            onClick={() => onNavigate('/universities')}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                University Comparison
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Benchmark verified international tuition fees, city living costs, and official direct application portals across top institutions.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-700">
              <span>Explore Universities</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* How the Tool Works Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              How the Tool Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              A disciplined four-step financial framework engineered to eliminate hidden study abroad pitfalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="text-base font-bold text-white">Define Target & Timeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your origin (Pakistan / PKR) and destination country. Set study duration (1 to 4 years) based on Master's or Bachelor's track.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="text-base font-bold text-white">Input True Expenses & Rates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Account for document attestations, IELTS, visa, and tickets. Enter your bank or open market exchange rate without relying on black-box estimates.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="text-base font-bold text-white">Audit Pre-Departure Cash Flow</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See exact funds needed before boarding (e.g. Blocked Account Sperrkonto or Canadian GIC) vs recurring costs during your studies.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-base">
                4
              </div>
              <h3 className="text-base font-bold text-white">Check Scholarship Eligibility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify your marks, IELTS, and work experience against published schemes like DAAD, Fulbright, Chevening, and GKS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Reality Spotlight: Blocked Accounts & Proof of Funds */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-semibold uppercase tracking-wider inline-block">
              Crucial Insight for Families
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pre-Departure Proof of Funds: The Hidden Hurdle
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Many students plan for tuition but get surprised by upfront visa liquidity regulations. Germany requires €11,904 in a blocked account; Canada requires CAD $20,635 living proof plus 1st year tuition; the UK requires £9,207–£12,006 held for 28 days.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our budget calculator explicitly computes the exact pre-departure cash required before visa approval, protecting your family from last-minute financial distress.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/budget-calculator')}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <span>Calculate Upfront Cash Requirement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Real questions international students ask when planning study abroad budgets and scholarship applications.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full bg-slate-100 text-slate-600 shrink-0" aria-hidden="true">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
