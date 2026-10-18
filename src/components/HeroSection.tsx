/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Cpu, Database, ArrowRight } from 'lucide-react';
import type { ScrapeMetadata } from '../types/bonus';

interface HeroSectionProps {
  metadata?: ScrapeMetadata;
  onOpenScraper: () => void;
  onScrollToCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ metadata, onOpenScraper, onScrollToCalculator }) => {
  const formattedDate = metadata?.lastScraped
    ? new Date(metadata.lastScraped).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Recent';

  return (
    <section className="relative overflow-hidden pt-12 pb-14 border-b border-purple-950/30">
      {/* Subtle purple gradient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-purple-900/15 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Quiet editorial kicker */}
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-4 tracking-wide uppercase">
            <span>Automated Promotion Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash Extraction</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Robots.txt Compliant
            </span>
          </div>

          <h1 className="font-['Outfit'] text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Scraped casino promotions, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300">
              unpacked without the marketing fog.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            Free-text welcome bonuses often hide demanding turnover terms. BONUS//TRACKER autonomously scrapes live
            promotions from public directories, converts unstructured bonus legalese into normalized multipliers using
            Gemini AI, and outputs pristine JSON.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#comparison"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-sm shadow-purple-900/30"
            >
              <span>Explore Scraped Table</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={onScrollToCalculator}
              className="inline-flex items-center gap-2 rounded-lg border border-purple-800/40 bg-purple-950/30 px-4 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-900/40 hover:border-purple-700/60 transition-colors cursor-pointer"
            >
              <span>Launch Turnover Calculator</span>
            </button>
          </div>
        </div>

        {/* 4-Item Scraper Health & Telemetry Strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-8 border-t border-purple-950/40">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-1">Monitored Casinos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {metadata?.totalCasinos || 3}
              </span>
              <span className="text-xs text-zinc-400">Casinos</span>
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5">Top public tier</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-1">AI Parser Engine</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-purple-300">
                {metadata?.aiModelUsed || 'gemini-3.8-flash'}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5">Schema-enforced JSON</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-1">Public Source</span>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-sm font-semibold text-zinc-200 truncate">
                {metadata?.sourceName || 'Casino.org'}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5">No login / No captcha</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-1">Last Pipeline Sync</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-mono font-medium text-emerald-400">
                {formattedDate}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5">Automated single-command</span>
          </div>
        </div>
      </div>
    </section>
  );
};
