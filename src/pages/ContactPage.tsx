/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  Flag,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  ContactFormInput,
  MONITORED_EDITORIAL_EMAIL,
  createMailtoLink,
  submitContactForm,
  validateContactForm,
} from '../services/contactService';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    category: 'Report an Outdated/Unverified Scholarship',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Spam prevention: Track mount time to detect instant automated bot submissions
  const mountTimeRef = useRef<number>(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Client-side input validation and spam checks
    const validation = validateContactForm(formData, mountTimeRef.current);
    if (!validation.isValid) {
      setErrorMsg(validation.errorMessage || 'Validation failed. Please check your inputs.');
      return;
    }

    // 2. Begin submission flow with loading state
    setIsSubmitting(true);

    try {
      // 3. Dispatch to secure form endpoint (serverless /api/contact or VITE_CONTACT_FORM_ENDPOINT)
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        setConfirmationNotice(
          result.message || 'Thank you! Your feedback has been verified and received by our editorial team.'
        );
      } else {
        // Only display success after the service confirms delivery.
        // If not delivered, display the error and provide the mailto fallback.
        setErrorMsg(
          result.error ||
            'Submission delivery could not be confirmed by the server. Please contact us via direct email.'
        );
      }
    } catch (err: any) {
      setErrorMsg(
        'An unexpected network error occurred while submitting your message. Please use direct email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoFallbackUrl = createMailtoLink(formData, MONITORED_EDITORIAL_EMAIL);

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
              <h2 className="text-xl font-bold text-slate-900">Submission Confirmed</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {confirmationNotice}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      category: 'Report an Outdated/Unverified Scholarship',
                      subject: '',
                      message: '',
                      honeypot: '',
                    });
                    mountTimeRef.current = Date.now();
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <span>Submit Feedback or Verification Report</span>
              </h2>

              {/* Error State Banner with Direct Mailto Fallback */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span className="font-medium leading-relaxed">{errorMsg}</span>
                  </div>
                  <div className="pt-1">
                    <a
                      href={mailtoFallbackUrl}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-700 text-white rounded-md text-xs font-semibold hover:bg-rose-800 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Report via Email Client</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Spam Honeypot Field (Visually hidden from human users) */}
              <div
                className="hidden"
                aria-hidden="true"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
              >
                <label htmlFor="hp_website">Leave this field blank</label>
                <input
                  type="text"
                  id="hp_website"
                  name="hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="contact_name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="contact_name"
                  type="text"
                  required
                  aria-required="true"
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="contact_email"
                  type="email"
                  required
                  aria-required="true"
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="contact_category" className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic Category
                </label>
                <select
                  id="contact_category"
                  disabled={isSubmitting}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:opacity-50"
                >
                  <option value="Report an Outdated/Unverified Scholarship">Report Outdated Scholarship or Deadline</option>
                  <option value="Suggest a Verified Scholarship Scheme">Suggest a Verified Scholarship Scheme</option>
                  <option value="Update Country/Visa Requirement Data">Update Country / Proof-of-Funds Baseline</option>
                  <option value="General Calculator Feedback">Budget Calculator Feedback</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact_subject" className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / University or Scheme Name
                </label>
                <input
                  id="contact_subject"
                  type="text"
                  disabled={isSubmitting}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. DAAD EPOS Application Deadline update"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="contact_message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Details & Official Source URL *
                </label>
                <textarea
                  id="contact_message"
                  required
                  aria-required="true"
                  rows={4}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please include official government or university links so our editorial team can verify the changes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Verification Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Information</span>
                  </>
                )}
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

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2.5">
            <p className="font-bold text-slate-900 text-sm">Direct Editorial Contact:</p>
            <div className="flex items-center space-x-2 text-slate-700">
              <Mail className="w-4 h-4 text-blue-700 shrink-0" />
              <a
                href={`mailto:${MONITORED_EDITORIAL_EMAIL}?subject=GlobalEdu%20Editorial%20Inquiry`}
                className="font-mono text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center space-x-1"
                title="Send email to editorial contact"
              >
                <span>{MONITORED_EDITORIAL_EMAIL}</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            </div>
            <p className="text-slate-500 text-xs pt-1 leading-relaxed">
              Active, monitored contact for academic institutional updates, verified primary source corrections, and partnership inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
