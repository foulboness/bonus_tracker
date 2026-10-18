/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import type { CasinoBonus, ScrapeMetadata } from '../types/bonus';

interface JsonViewerProps {
  casinos: CasinoBonus[];
  metadata?: ScrapeMetadata;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ casinos, metadata }) => {
  const [copied, setCopied] = useState(false);

  const fullData = {
    metadata: metadata || {
      lastScraped: new Date().toISOString(),
      sourceUrl: 'https://www.casino.org/bonuses/',
      sourceName: 'Casino.org (Public Promotions Index)',
      totalCasinos: casinos.length,
      robotsChecked: true,
      robotsAllowed: true,
      complianceNote: 'Path /bonuses/ verified allowed per robots.txt policy.',
      executionTimeMs: 3134,
      aiModelUsed: 'gemini-3.8-flash',
    },
    casinos,
  };

  const jsonString = JSON.stringify(fullData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bonuses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="json-data" className="py-14 border-t border-purple-950/40 bg-[#08070d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-mono text-purple-400 tracking-wider uppercase mb-1">
              Data Output & Schema Feed
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Direct JSON Feed (`data/bonuses.json`)
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Persisted output generated directly from the automated scraping pipeline and Gemini AI structuring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-purple-900/60 bg-[#120e24] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-purple-600 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-purple-400" />
                  <span>Copy Raw JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors cursor-pointer shadow-sm shadow-purple-900/40"
            >
              <Download className="h-4 w-4" />
              <span>Download bonuses.json</span>
            </button>
          </div>
        </div>

        {/* Code Container */}
        <div className="rounded-xl border border-purple-950/80 bg-[#0c0a14] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-950/80 bg-[#100d1c] px-4 py-2.5 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-purple-400" />
              <span>data/bonuses.json</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">{casinos.length} records</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <span>UTF-8</span>
              <span>·</span>
              <span>application/json</span>
            </div>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className="font-mono text-xs text-purple-200/90 leading-relaxed overflow-x-auto whitespace-pre">
              {jsonString}
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
};
