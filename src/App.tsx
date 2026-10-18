/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BudgetCalculatorPage } from './pages/BudgetCalculatorPage';
import { CountryComparisonPage } from './pages/CountryComparisonPage';
import { ScholarshipFinderPage } from './pages/ScholarshipFinderPage';
import { UniversityComparisonPage } from './pages/UniversityComparisonPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';

export default function App() {
  // Sync router with browser pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      const p = window.location.pathname;
      return p === '' ? '/' : p;
    }
    return '/';
  });

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update Page Title and SEO Meta Description according to route
  useEffect(() => {
    let title = 'GlobalEdu - Study Abroad Budget & Scholarship Finder';
    let description =
      'Estimate international study costs, compare countries and universities, calculate budget shortfalls in PKR, and explore verified scholarships.';

    switch (currentPath) {
      case '/budget-calculator':
        title = 'Study Abroad Budget Calculator (PKR & Foreign Currencies) | GlobalEdu';
        description =
          'Calculate pre-departure costs, German blocked account requirements, living expenses, tuition, and family funding gaps in Pakistani Rupee.';
        break;
      case '/countries':
        title = 'Compare Study Destinations (Germany, US, UK, Canada, Korea, Australia) | GlobalEdu';
        description =
          'Compare statutory living proof requirements, tuition brackets, part-time work rights, and post-study work visas across 6 top countries.';
        break;
      case '/scholarships':
        title = 'Verified Scholarship Finder & Eligibility Matcher | GlobalEdu';
        description =
          'Search verified government and university scholarships (Fulbright, Chevening, DAAD, GKS) with factual eligibility checklists.';
        break;
      case '/universities':
        title = 'University Directory & International Tuition Comparison | GlobalEdu';
        description =
          'Benchmark verified international tuition fees, city living costs, and official direct application portals across top institutions.';
        break;
      case '/about':
        title = 'About Our Mission & Transparency Methodology | GlobalEdu';
        description =
          'Learn how GlobalEdu eliminates financial blind spots for international students through honest mathematical auditing and verified data.';
        break;
      case '/contact':
        title = 'Contact & Report Unverified Information | GlobalEdu';
        description =
          'Submit feedback, report outdated scholarship deadlines, or suggest verified primary sources to our editorial review team.';
        break;
      case '/privacy':
        title = 'Privacy Policy & Data Security | GlobalEdu';
        description =
          'GlobalEdu executes 100% in-browser calculations with zero tracking and zero server-side storage of family financial records.';
        break;
      default:
        title = 'GlobalEdu - Study Abroad Budget & Scholarship Finder for International Students';
        break;
    }

    document.title = title;

    // Update meta tag
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [currentPath]);

  // Navigate handler that updates browser history
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render appropriate page view
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} />;
      case '/budget-calculator':
        return <BudgetCalculatorPage />;
      case '/countries':
        return <CountryComparisonPage onNavigate={handleNavigate} />;
      case '/scholarships':
        return <ScholarshipFinderPage onNavigate={handleNavigate} />;
      case '/universities':
        return <UniversityComparisonPage onNavigate={handleNavigate} />;
      case '/about':
        return <AboutPage onNavigate={handleNavigate} />;
      case '/contact':
        return <ContactPage />;
      case '/privacy':
        return <PrivacyPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Navigation */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Comprehensive Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
