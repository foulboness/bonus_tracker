/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, Lock, Terminal, Globe, Cloud, Check } from 'lucide-react';
import type { ScrapeMetadata } from '../types/bonus';

interface ComplianceSectionProps {
  metadata?: ScrapeMetadata;
}

export const ComplianceSection: React.FC<ComplianceSectionProps> = ({ metadata }) => {
  return (
    <section id="compliance" className="py-14 border-t border-purple-950/40 bg-[#090810]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono text-purple-400 tracking-wider uppercase mb-1">
            Ethical Crawling & Architectural Standards
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Compliance, Failover & Free Host Deployment
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            BONUS//TRACKER adheres to strict web scraping ethics, automated robots.txt verification, and zero-auth data collection.
          </p>
        </div>

        {/* 3 Pillars of Compliance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="rounded-xl border border-purple-900/40 bg-[#0d0b17] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="font-['Outfit'] text-base font-bold text-white">
                1. Automated robots.txt Verification
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Before issuing requests to any promotion directory, the crawler queries the domain’s <code className="text-purple-300">/robots.txt</code> file. The current source path <code className="text-purple-300">/bonuses/</code> has been verified as allowed under standard bot crawl rules.
            </p>
            <div className="mt-4 pt-3 border-t border-purple-950/60 text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Status: Verified Allowed</span>
            </div>
          </div>

          <div className="rounded-xl border border-purple-900/40 bg-[#0d0b17] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Lock className="h-5 w-5 text-purple-400" />
              <h3 className="font-['Outfit'] text-base font-bold text-white">
                2. Zero Logins & Zero CAPTCHAs
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We exclusively harvest publicly viewable index tables and teaser pages. No user accounts, credentials, session bypasses, or CAPTCHA circumvention methods are used, guaranteeing clean, ethical data collection.
            </p>
            <div className="mt-4 pt-3 border-t border-purple-950/60 text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
              <span>User-Agent: BONUS-TRACKER-Bot/1.0</span>
            </div>
          </div>

          <div className="rounded-xl border border-purple-900/40 bg-[#0d0b17] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <RefreshCw className="h-5 w-5 text-indigo-400" />
              <h3 className="font-['Outfit'] text-base font-bold text-white">
                3. Automated Source Failover
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If the primary source (<code className="text-purple-300">casino.org</code>) issues a 403, 429 rate limit, or network error, the scraper engine automatically shifts to the secondary vetted source (<code className="text-purple-300">gambling.com</code>) without human intervention.
            </p>
            <div className="mt-4 pt-3 border-t border-purple-950/60 text-[11px] text-purple-300 flex items-center gap-1.5 font-mono">
              <span>Automatic Failover Circuit: Enabled</span>
            </div>
          </div>

        </div>

        {/* Free Deployment Guides Strip */}
        <div id="deployment" className="rounded-2xl border border-purple-800/40 bg-gradient-to-br from-[#120e24] to-[#0a0814] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-purple-900/40">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
                Zero-Cost Hosting Architecture
              </div>
              <h3 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-white">
                Ready for Free Host Deployment
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Deploy BONUS//TRACKER in seconds on Netlify, Vercel, GitHub Pages, or Render.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded border border-purple-600/40 bg-purple-950/40 text-purple-200">
                Netlify
              </span>
              <span className="px-2.5 py-1 rounded border border-purple-600/40 bg-purple-950/40 text-purple-200">
                Vercel
              </span>
              <span className="px-2.5 py-1 rounded border border-purple-600/40 bg-purple-950/40 text-purple-200">
                GitHub Pages
              </span>
              <span className="px-2.5 py-1 rounded border border-purple-600/40 bg-purple-950/40 text-purple-200">
                Cloud Run / Node
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-purple-950/80 bg-[#0d0b17] p-4">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-purple-400" />
                <span>1. Netlify / Vercel (Static SPA)</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Builds cleanly with <code className="text-purple-300">npm run build</code> into <code className="text-purple-300">dist/</code>. Pre-bundled with verified JSON output in <code className="text-purple-300">src/data/bonuses.json</code>.
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-[#08070e] p-2 rounded border border-purple-950/60">
                Build command: npm run build<br />
                Publish dir: dist
              </div>
            </div>

            <div className="rounded-lg border border-purple-950/80 bg-[#0d0b17] p-4">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-purple-400" />
                <span>2. Single-Command CLI Scrape</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Run the scraper locally or in GitHub Actions on a cron schedule to refresh bonus data automatically.
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-[#08070e] p-2 rounded border border-purple-950/60">
                npm run scrape<br />
                # output: data/bonuses.json
              </div>
            </div>

            <div className="rounded-lg border border-purple-950/80 bg-[#0d0b17] p-4">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Cloud className="h-4 w-4 text-purple-400" />
                <span>3. Full-Stack Node / Cloud Run</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Enables on-demand UI re-scraping via <code className="text-purple-300">POST /api/scrape</code> and live Gemini structuring.
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-[#08070e] p-2 rounded border border-purple-950/60">
                npm start<br />
                PORT=3000 node server.ts
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
