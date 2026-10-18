/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Terminal, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenScraper: () => void;
  isScraping: boolean;
  lastScraped?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScraper, isScraping, lastScraped }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/40 bg-[#08070d]/90 backdrop-blur-md">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary Action) */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="flex items-center gap-2 whitespace-nowrap shrink-0 group">
          <span className="font-['Outfit'] text-xl font-extrabold tracking-tight text-white group-hover:text-purple-300 transition-colors">
            BONUS<span className="text-purple-500">//</span>TRACKER
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-purple-400/80 border border-purple-500/30 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <a href="#comparison" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Comparison
          </a>
          <a href="#calculator" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Turnover Calculator
          </a>
          <a href="#json-data" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            JSON Feed
          </a>
          <a href="#compliance" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Compliance
          </a>
          <a href="#deployment" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Deployment
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenScraper}
            disabled={isScraping}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-900/40 hover:from-purple-500 hover:to-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
            title="Execute live scraper pipeline with Gemini structuring"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'Scraping Live...' : 'Run Live Scrape'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
