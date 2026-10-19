/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="flex items-center space-x-3 cursor-pointer group select-none min-h-[48px]"
              aria-label="GlobalEdu Home"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">GlobalEdu</span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering students in Pakistan and across the globe with transparent, un-hyped study abroad financial forecasting, realistic blocked account calculations, and verified scholarship directories.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% In-Browser Privacy • Zero Data Sold • Verified Primary Sources</span>
            </div>
          </div>

          {/* Core Tools - Semantic Crawlable Anchors */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Planning Tools
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="/budget-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/budget-calculator');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Budget Calculator</span>
                </a>
              </li>
              <li>
                <a
                  href="/countries"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/countries');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Country Comparison</span>
                </a>
              </li>
              <li>
                <a
                  href="/scholarships"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/scholarships');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Scholarship Finder</span>
                </a>
              </li>
              <li>
                <a
                  href="/scholarships"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/scholarships');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Eligibility Matcher</span>
                </a>
              </li>
              <li>
                <a
                  href="/universities"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/universities');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>University Directory</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Official Verification Portals */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Verified Portals
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="https://www.daad.de/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 py-1.5 min-h-[40px]"
                >
                  <span>DAAD Germany</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://usefp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 py-1.5 min-h-[40px]"
                >
                  <span>USEFP Fulbright</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.chevening.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 py-1.5 min-h-[40px]"
                >
                  <span>Chevening UK</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.studyinkorea.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 py-1.5 min-h-[40px]"
                >
                  <span>Study in Korea (NIIED)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.educanada.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 py-1.5 min-h-[40px]"
                >
                  <span>EduCanada (IRCC)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Transparency
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Our Methodology</span>
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/privacy');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Privacy Notice</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Report Unverified Data</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact');
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span>Contact &amp; Feedback</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Advisory Disclaimer */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Transparency &amp; Financial Advisory Disclaimer:</strong> GlobalEdu is an independent educational estimation tool and is not an immigration consultancy, financial advisory firm, or official testing agency. All cost estimates (e.g. German Sperrkonto, Canadian IRCC living funds, UKVI maintenance, university tuition ranges) are illustrative estimates derived from published regulatory baselines and official announcements. Foreign exchange rates (e.g., EUR/PKR, USD/PKR) are user-provided or editable reference baselines; they fluctuate daily in the open foreign exchange and banking markets. Scholarship matches signify potential published eligibility criteria alignment, not guaranteed admission or scholarship award. Always cross-verify directly with target universities, embassies, and official granting bodies before making financial commitments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} GlobalEdu. Dedicated to students in Pakistan &amp; worldwide pursuing higher education abroad.</p>
            <p className="flex items-center space-x-1 mt-2 sm:mt-0">
              <span>Built with precision for educational equity</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
