/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Lock, HardDrive, Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import { MONITORED_EDITORIAL_EMAIL } from '../services/contactService';

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
          We believe financial planning for education is deeply personal. GlobalEdu is built with zero telemetry, zero behavioral tracking, and zero remote storage of financial records.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <span className="font-bold text-sm block text-emerald-900">
              Core Guarantee: No Financial or Budget Data is Transmitted to Servers
            </span>
            <p>
              When you enter your family savings, annual budget in PKR, tuition numbers, or academic test scores into the Budget Calculator or Scholarship Matcher, that calculation is processed exclusively inside your web browser’s JavaScript engine. No database records or server-side logs of your budget are created.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-blue-700" />
            <span>1. Local Browser Storage (localStorage)</span>
          </h2>
          <p>
            To provide convenience so you do not lose your customized budget numbers when refreshing the tab, GlobalEdu saves your latest calculator inputs in your device’s local browser storage under the key:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-800 space-y-1">
            <p className="font-semibold text-slate-900">• Current Active Budget Scenario:</p>
            <p className="text-blue-700 pl-3">globaledu_study_budget_v2</p>
            <p className="font-semibold text-slate-900 mt-2">• User-Saved Comparison Scenarios:</p>
            <p className="text-blue-700 pl-3">globaledu_saved_profiles_v2</p>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            These records reside solely on your personal computer or mobile phone. You can clear them anytime by clicking the <strong>"Reset"</strong> button in the calculator or clearing your browser's site cookies and local storage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-700" />
            <span>2. No Collection of Sensitive Personal Information</span>
          </h2>
          <p>
            GlobalEdu does not ask for, process, or store:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
            <li>Bank account numbers, credit card details, or IBANs</li>
            <li>Passports, national ID cards (CNIC/B-Form), or official academic transcripts</li>
            <li>Government registration numbers or user passwords</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-700" />
            <span>3. Contact Form & Feedback Processing</span>
          </h2>
          <p>
            When you submit a verification report or feedback via our Contact page, only the fields you explicitly enter (your name, email address, topic category, subject, details/links, and submission timestamp) are transmitted to our contact processing service to deliver your feedback to the editorial team.
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            No financial calculator data, savings figures, or family budget simulations are ever attached or transmitted with contact submissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            4. Third-Party Outbound Links
          </h2>
          <p>
            Our scholarship directory and country comparison tools provide direct outbound links to official government and university websites (such as daad.de, usefp.org, chevening.org, and educanada.ca). These external websites operate under their own independent privacy notices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            5. Inquiries & Editorial Contact
          </h2>
          <p>
            For privacy inquiries or data requests, you can contact our editorial and development team directly:
          </p>
          <div className="flex items-center space-x-2 text-slate-700 pt-1">
            <Mail className="w-4 h-4 text-blue-700 shrink-0" />
            <a
              href={`mailto:${MONITORED_EDITORIAL_EMAIL}?subject=GlobalEdu%20Privacy%20Inquiry`}
              className="font-mono text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center space-x-1"
            >
              <span>{MONITORED_EDITORIAL_EMAIL}</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
