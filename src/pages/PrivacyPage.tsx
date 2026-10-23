/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Lock,
  HardDrive,
  Mail,
  ExternalLink,
  Cookie,
  Server,
  Globe,
} from 'lucide-react';
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
          We believe financial planning for international education is deeply personal. GlobalEdu is built with transparent data boundaries, local browser processing, and zero server-side storage of student financial profiles.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* Core Guarantee Banner */}
        <div className="flex items-start space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <span className="font-bold text-sm block text-emerald-900">
              Core Guarantee: No Financial or Budget Data is Transmitted to Remote Servers
            </span>
            <p>
              When you enter family savings, annual budgets in PKR, tuition figures, or test scores into the Budget Calculator or Scholarship Matcher, those calculations run 100% inside your web browser’s local JavaScript engine. No database records or permanent server logs of your budget simulations are created.
            </p>
          </div>
        </div>

        {/* Section 1: Local Storage */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-blue-700" />
            <span>1. Local Browser Storage (localStorage)</span>
          </h2>
          <p>
            To provide convenience so you do not lose customized budget figures when refreshing or revisiting the site, GlobalEdu stores your inputs locally on your device under two documented keys:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-800 space-y-1">
            <p className="font-semibold text-slate-900">• Current Active Budget Scenario:</p>
            <p className="text-blue-700 pl-3">globaledu_study_budget_v2</p>
            <p className="font-semibold text-slate-900 mt-2">• User-Saved Comparison Scenarios:</p>
            <p className="text-blue-700 pl-3">globaledu_saved_profiles_v2</p>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            These records reside solely in your personal device’s browser storage. You can delete them at any time by clicking the <strong>"Reset"</strong> button in the calculator or clearing your browser's site cookies and local storage data.
          </p>
        </section>

        {/* Section 2: Personal Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-700" />
            <span>2. No Collection of Sensitive Personal Information</span>
          </h2>
          <p>
            GlobalEdu is an informational and calculation utility. We do not ask for, process, or store:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
            <li>Bank account details, credit card numbers, or IBANs</li>
            <li>Passport copies, national identity cards (CNIC/B-Form), or official transcripts</li>
            <li>Government registration numbers or user passwords</li>
          </ul>
        </section>

        {/* Section 3: Contact Form Submissions */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-700" />
            <span>3. Contact Form & Feedback Processing</span>
          </h2>
          <p>
            When you submit a verification report or feedback via our Contact page, only the fields you explicitly provide (your full name, email address, topic category, optional subject, and message details) are sent to our contact dispatch endpoint to route your message to our editorial team.
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            No financial calculator data, family savings numbers, or budget simulations are ever attached or transmitted with contact submissions.
          </p>
        </section>

        {/* Section 4: Advertising Partners & Cookies (Google AdSense) */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Cookie className="w-5 h-5 text-blue-700" />
            <span>4. Third-Party Advertising & Cookies (Google AdSense)</span>
          </h2>
          <p>
            To support ongoing research and free access to verified scholarship and tuition guides, GlobalEdu may partner with third-party advertising vendors, including Google AdSense, to display relevant advertisements to visitors:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>
              <strong>Advertising Cookies:</strong> Third-party vendors, including Google, use cookies or web beacons to serve ads based on a user’s prior visits to this website or other websites across the internet.
            </li>
            <li>
              <strong>Ad Personalization & Opt-Out:</strong> Google's use of advertising cookies enables it and its partners to serve personalized or contextual ads. Visitors may opt out of personalized advertising at any time by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-medium hover:underline inline-flex items-center space-x-0.5"
              >
                <span>Google Ads Settings</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>. Alternatively, visitors can manage or opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-medium hover:underline inline-flex items-center space-x-0.5"
              >
                <span>aboutads.info</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>.
            </li>
            <li>
              <strong>How Google Uses Data:</strong> For complete details regarding how Google collects and processes data when advertising technologies are active, review{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-medium hover:underline inline-flex items-center space-x-0.5"
              >
                <span>Google’s Advertising Privacy Policies</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>.
            </li>
            <li>
              <strong>Consent Mechanism Requirement:</strong> A privacy policy statement alone is not a valid legal consent mechanism. Under Google’s EU User Consent Policy and statutory data privacy frameworks (including GDPR, UK GDPR, and the ePrivacy Directive), websites that serve ads to visitors in the European Economic Area (EEA), United Kingdom, or Switzerland must implement an active, Google-certified Consent Management Platform (CMP) integrated with the IAB Europe Transparency and Consent Framework (TCF v2.2) to collect and pass verifiable consent signals before ads or measurement cookies are loaded. GlobalEdu does not currently load active commercial ad scripts, ad network tags, or a certified CMP. Prior to serving any commercial advertisements to users in regions requiring consent, a compliant Google-certified CMP will be integrated and configured to block ad tags until consent is granted.
            </li>
          </ul>
        </section>

        {/* Section 5: Server Infrastructure & Operational Logs */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Server className="w-5 h-5 text-blue-700" />
            <span>5. Server Infrastructure & Operational Logs</span>
          </h2>
          <p>
            GlobalEdu is hosted on modern cloud edge infrastructure (Vercel) and uses an external transactional email provider (Resend) for verified contact dispatch. Technical logs are generated during standard network operations:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>
              <strong>Hosting Edge Logs (Vercel):</strong> When you access this website or call the contact endpoint, edge routers automatically log standard technical request metadata (such as IP address, HTTP method, requested URL path, browser User-Agent, referer, response status code, and timestamp) for network diagnostics, operational stability, and DDoS mitigation.
            </li>
            <li>
              <strong>Contact & Email Dispatch Logs (Resend):</strong> When you submit a message through the contact form, the serverless endpoint processes the submission, and Resend logs operational transmission records (such as sender and recipient addresses, message subject line, client IP, timestamp, and delivery/bounce status) necessary to maintain deliverability and prevent mail server abuse.
            </li>
            <li>
              <strong>Rate Limiting Data:</strong> Transient client IP hashes or addresses may be temporarily evaluated in-memory or via an Upstash Redis rate limiter to prevent spam flooding (strictly enforcing a 5-request per 10-minute threshold).
            </li>
            <li>
              <strong>Client-Side Calculator Isolation:</strong> All financial budget calculations, pre-departure line items, foreign currency conversions, and profile saves remain 100% within your client browser (stored only in your local device’s localStorage under <code>globaledu_study_budget_v2</code> and <code>globaledu_saved_profiles_v2</code>). This data is never sent across the network and never appears in server or hosting logs.
            </li>
          </ul>
        </section>

        {/* Section 6: Third-Party Links */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-700" />
            <span>6. Third-Party Outbound Links</span>
          </h2>
          <p>
            Our scholarship directory, country comparison tables, and university fee benchmarks provide direct outbound links to official government and university websites (such as daad.de, usefp.org, chevening.org, and educanada.ca). Once you navigate away from GlobalEdu to an external website, their independent privacy notices and terms apply.
          </p>
        </section>

        {/* Section 7: Editorial Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            7. Inquiries & Editorial Contact
          </h2>
          <p>
            For privacy inquiries, data deletion questions, or editorial feedback, you can contact our team directly at our monitored editorial address:
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
