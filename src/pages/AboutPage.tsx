/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Globe2,
  Scale,
  Sparkles,
  ArrowRight,
  Calculator,
  Award,
  BookOpen,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6 text-center">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Our Mission & Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          About GlobalEdu
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl mx-auto">
          Built to replace confusing consultant sales pitches with unvarnished mathematical reality and verified educational funding data.
        </p>
      </div>

      {/* The Problem We Solve */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          The Problem: Foreign Exchange Volatility & Hidden Upfront Demands
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          For international students—especially from Pakistan, where the Rupee (PKR) experiences frequent exchange rate adjustments—studying abroad represents one of the largest financial decisions a family will ever make.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Too often, commercial education agents quote optimistic first-semester tuition fees while failing to prepare families for:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
          <li>
            <strong>Statutory Visa Financial Benchmarks:</strong> Such as the German Sperrkonto (€11,904 benchmark) or Canadian IRCC financial capacity requirement (CAD $23,448 for single applicants outside Quebec applying on or after September 1, 2026), which students must demonstrate to satisfy immigration regulations.
          </li>
          <li>
            <strong>Pre-Departure Cash Outflows:</strong> HEC/IBCC attestations, IELTS test fees, visa appointment slots, airfare, and biometrics that can exceed 4 to 6 Lakh PKR before stepping on a plane.
          </li>
          <li>
            <strong>Disinformation on Scholarships:</strong> Clickbait websites advertising non-existent or expired full-ride scholarships with exaggerated "probabilities" of winning.
          </li>
        </ul>
      </div>

      {/* Our 4 Core Commitments */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Our Editorial & Financial Constitution</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">User-Controlled Currency Rates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never claim to possess private live bank rates. You can freely edit and test exchange rates according to your local bank’s open-market or telegraphic transfer (TT) charges.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">Zero Fabricated Probabilities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scholarship decisions involve holistic human evaluations. Our Eligibility Matcher provides a transparent factual checklist of published requirements met or missed, not fake percentage chances.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">Strict Source Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every scholarship and statutory living requirement is tied to primary official sources (DAAD, USEFP, Chevening, Study in Korea, IRCC). Unverified entries are segregated.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900">100% In-Browser Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your family financial numbers, savings amounts, and academic marks never leave your device. All calculations execute client-side in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-blue-900 text-base">Ready to Plan Your Degree Financially?</h3>
          <p className="text-xs text-blue-800">
            Audit your prospective study destination with real numbers today.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/budget-calculator')}
          className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
        >
          Launch Budget Calculator
        </button>
      </div>
    </div>
  );
};
