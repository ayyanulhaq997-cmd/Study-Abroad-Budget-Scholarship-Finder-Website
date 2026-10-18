/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6 text-center">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Transparent & Safe
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Privacy Policy & Data Handling
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl mx-auto">
          We believe financial planning for education is deeply personal. GlobalEdu is designed with zero telemetry and zero server-side storage of financial records.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <span className="font-bold text-sm block text-emerald-900">
              Core Guarantee: No Financial or Personal Data is Transmitted to Servers
            </span>
            <p>
              When you enter your family savings, annual budget in PKR, or academic percentages into the Budget Calculator or Scholarship Matcher, that information is processed exclusively inside your web browser’s JavaScript engine. No database records are created.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-blue-700" />
            <span>1. Local Browser Storage (localStorage)</span>
          </h2>
          <p>
            To provide convenience so you do not lose your customized budget numbers when refreshing the tab, GlobalEdu saves your latest calculator inputs in your device’s local browser storage under the key <code>globaledu_study_budget_v1</code>.
          </p>
          <p>
            You can clear this anytime by clicking the <strong>"Reset"</strong> button in the calculator or clearing your browser's site data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-700" />
            <span>2. No Collection of Sensitive Personal Information</span>
          </h2>
          <p>
            GlobalEdu does not ask for or collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
            <li>Bank account numbers, credit card details, or IBANs</li>
            <li>Passports, national ID cards (CNIC/B-Form), or official transcripts</li>
            <li>Government registration numbers or user passwords</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            3. Third-Party Outbound Links
          </h2>
          <p>
            Our scholarship directory and country comparison tools provide direct outbound links to official government and university websites (such as daad.de, usefp.org, chevening.org, and educanada.ca). These external websites operate under their own independent privacy notices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            4. Changes to This Privacy Notice
          </h2>
          <p>
            Any future architectural updates to GlobalEdu will remain bound by this non-intrusive standard. We will never sell, lease, or monetize student financial simulation data to commercial marketing agencies or financial lenders.
          </p>
        </section>
      </div>
    </div>
  );
};
