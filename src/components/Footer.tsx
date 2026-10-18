/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Globe2,
  ExternalLink,
  Heart,
  ArrowRight,
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
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">GlobalEdu</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering students in Pakistan and across the globe with transparent, un-hyped study abroad financial forecasting, realistic blocked account calculations, and verified scholarship directories.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% In-Browser Privacy • Zero Data Sold • Verified Primary Sources</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Planning Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/budget-calculator')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Budget Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/countries')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Country Comparison</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/scholarships')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Scholarship Finder</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/scholarships')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Eligibility Matcher</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/universities')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>University Directory</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Verification Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Verified Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.daad.de/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>DAAD Germany</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://usefp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>USEFP Fulbright</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.chevening.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>Chevening UK</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.studyinkorea.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>Study in Korea (NIIED)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.educanada.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>EduCanada (IRCC)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Transparency
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Our Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Privacy Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Report Unverified Data
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Advisory Disclaimer */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Transparency & Financial Advisory Disclaimer:</strong> GlobalEdu is an independent educational estimation tool and is not an immigration consultancy, financial advisory firm, or official testing agency. All cost estimates (e.g. German Sperrkonto, Canadian IRCC living funds, UKVI maintenance, university tuition ranges) are illustrative estimates derived from published regulatory baselines and official announcements. Foreign exchange rates (e.g., EUR/PKR, USD/PKR) are user-provided or editable reference baselines; they fluctuate daily in the open foreign exchange and banking markets. Scholarship matches signify potential published eligibility criteria alignment, not guaranteed admission or scholarship award. Always cross-verify directly with target universities, embassies, and official granting bodies before making financial commitments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} GlobalEdu. Dedicated to students in Pakistan & worldwide pursuing higher education abroad.</p>
            <p className="flex items-center space-x-1 mt-2 sm:mt-0">
              <span>Built with precision for educational equity</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
