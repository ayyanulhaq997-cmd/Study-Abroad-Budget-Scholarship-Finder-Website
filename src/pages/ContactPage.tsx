/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  Flag,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Report an Outdated/Unverified Scholarship',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6 text-center">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Community & Verification Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Contact & Report Unverified Information
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl mx-auto">
          Help us maintain 100% data integrity. Report outdated scholarship deadlines, suggest verified university updates, or share feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Feedback Submitted Successfully</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you for contributing to open and honest study abroad information! Our editorial review team inspects submitted primary source URLs regularly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    category: 'Report an Outdated/Unverified Scholarship',
                    subject: '',
                    message: '',
                  });
                }}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <span>Submit Feedback or Verification Report</span>
              </h2>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Report an Outdated/Unverified Scholarship">Report Outdated Scholarship or Deadline</option>
                  <option value="Suggest a Verified Scholarship Scheme">Suggest a Verified Scholarship Scheme</option>
                  <option value="Update Country/Visa Requirement Data">Update Country / Proof-of-Funds Baseline</option>
                  <option value="General Calculator Feedback">Budget Calculator Feedback</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / University or Scheme Name
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. DAAD EPOS Application Deadline update"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Details & Official Source URL *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please include official government or university links so our editorial team can verify the changes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Information</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <Flag className="w-4 h-4 text-blue-700" />
              <span>Data Integrity Policy</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              GlobalEdu strictly rejects unverified scholarship listings, promotional consulting advertisements, and predatory student loan offers.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If any scholarship deadline, IELTS band requirement, or university fee changed recently, submit the official bulletin link and we update our verified records within 48 hours.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <p className="font-bold text-slate-900 text-sm">Direct Editorial Contact:</p>
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="font-mono text-slate-800">editor@globaledu.app</span>
            </div>
            <p className="text-slate-500 text-xs pt-1">
              For academic institutional partnerships and verified scholarship commission data additions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
