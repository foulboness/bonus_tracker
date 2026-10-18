/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-purple-950/40 bg-[#06050a] py-10 text-xs text-zinc-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-['Outfit'] font-bold text-zinc-300">
              BONUS<span className="text-purple-500">//</span>TRACKER
            </span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span>Ethical Web Scraping & Comparison</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#comparison" className="hover:text-purple-300 transition-colors">
              Comparison Table
            </a>
            <a href="#calculator" className="hover:text-purple-300 transition-colors">
              Wagering Calculator
            </a>
            <a href="#json-data" className="hover:text-purple-300 transition-colors">
              JSON File
            </a>
            <a href="#compliance" className="hover:text-purple-300 transition-colors">
              Robots.txt & Compliance
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-purple-950/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600">
          <p>
            18+ only. Gambling involves financial risk. Scraped terms are subject to operator changes. Always read full T&Cs at the respective operator.
          </p>
          <p>
            Powered by Gemini 3.8 Flash & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};
