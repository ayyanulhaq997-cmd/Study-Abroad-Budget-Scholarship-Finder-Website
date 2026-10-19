/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Calculator,
  Globe2,
  Award,
  Building2,
  Menu,
  X,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: Globe2 },
    { path: '/budget-calculator', label: 'Budget Calculator', icon: Calculator, badge: 'Smart' },
    { path: '/countries', label: 'Country Comparison', icon: Globe2 },
    { path: '/scholarships', label: 'Scholarships', icon: Award },
    { path: '/universities', label: 'Universities', icon: Building2 },
    { path: '/about', label: 'About', icon: HelpCircle },
    { path: '/contact', label: 'Contact', icon: FileText },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand as crawlable anchor */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
            className="flex items-center space-x-3 cursor-pointer group select-none min-h-[48px] py-1"
            aria-label="GlobalEdu Home"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-800 transition-colors">
              <GraduationCap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">GlobalEdu</span>
                <span className="text-xs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800">
                  PK
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none">
                Study Abroad Budget &amp; Scholarships
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links as crawlable anchors */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.path);
                  }}
                  className={`relative flex items-center space-x-1.5 px-3.5 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Button & PKR indicator */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
              <span className="font-medium">PKR Optimized</span>
            </div>
            <a
              href="/budget-calculator"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/budget-calculator');
              }}
              className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold px-4 py-2.5 min-h-[44px] rounded-lg shadow-sm shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" aria-hidden="true" />
              <span>Calculate Budget</span>
            </a>
          </div>

          {/* Mobile Menu Button - 48x48px tap target */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation-menu" className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg">
          <div className="py-2.5 mb-2 px-3 bg-blue-50 rounded-lg text-xs text-blue-900 flex items-center justify-between">
            <span className="font-medium">Free Study Abroad Financial Planning Tool</span>
            <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">100% In-Browser</span>
          </div>
          {navLinks.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.path);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 min-h-[48px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
          <div className="pt-3">
            <a
              href="/budget-calculator"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/budget-calculator');
              }}
              className="w-full flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 min-h-[48px] px-4 rounded-lg shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Budget Calculator</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
