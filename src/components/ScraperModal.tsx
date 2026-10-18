/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, RefreshCw, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, Play } from 'lucide-react';
import type { ScrapeResult } from '../types/bonus';

interface ScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrapeSuccess: (result: ScrapeResult) => void;
}

export const ScraperModal: React.FC<ScraperModalProps> = ({
  isOpen,
  onClose,
  onScrapeSuccess,
}) => {
  const [selectedSource, setSelectedSource] = useState<'primary' | 'fallback'>('primary');
  const [customUrl, setCustomUrl] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'BONUS//TRACKER Scraper Console ready.',
    'Select source target and click "Execute Live Scraper Pipeline".',
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunScrape = async () => {
    setIsExecuting(true);
    setErrorMsg(null);
    setLogs((prev) => [
      ...prev,
      '------------------------------------------------------------',
      `[${new Date().toLocaleTimeString()}] Triggering scrape job via POST /api/scrape...`,
    ]);

    try {
      const targetSource =
        customUrl.trim() ||
        (selectedSource === 'fallback'
          ? 'https://www.gambling.com/online-casinos/bonuses'
          : 'https://www.casino.org/bonuses/');

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: targetSource,
          forceFallback: selectedSource === 'fallback',
        }),
      });

      const data: ScrapeResult = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Scraper failed to return valid data.');
      }

      setLogs((prev) => [
        ...prev,
        ...(data.logs || []),
        `[SUCCESS] Cataloged ${data.casinos.length} online casinos in ${data.metadata.executionTimeMs}ms.`,
        `JSON file synchronization verified: data/bonuses.json updated.`,
      ]);

      onScrapeSuccess(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setLogs((prev) => [...prev, `[ERROR] Scraper pipeline failed: ${msg}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-purple-900/50 bg-[#0e0c18] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-purple-950/40 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-300">
            <RefreshCw className={`h-5 w-5 ${isExecuting ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">
              Single-Command & Live UI Automation
            </div>
            <h3 className="font-['Outfit'] text-2xl font-bold text-white mt-0.5">
              Live Scraper Control Console
            </h3>
          </div>
        </div>

        {/* Source Configuration */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              Select Public Promotions Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setSelectedSource('primary'); setCustomUrl(''); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSource === 'primary' && !customUrl
                    ? 'border-purple-500 bg-purple-950/50 text-white'
                    : 'border-purple-950/80 bg-[#120e22] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-xs text-purple-200">Primary Source (Recommended)</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">casino.org/bonuses/</div>
                <div className="text-[10px] text-emerald-400 mt-1">robots.txt Verified Allowed</div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedSource('fallback'); setCustomUrl(''); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSource === 'fallback' && !customUrl
                    ? 'border-purple-500 bg-purple-950/50 text-white'
                    : 'border-purple-950/80 bg-[#120e22] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-xs text-purple-200">Secondary Fallback Source</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">gambling.com/online-casinos/bonuses</div>
                <div className="text-[10px] text-zinc-400 mt-1">Auto-switched if blocked</div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Or Custom Target URL (optional override)
            </label>
            <input
              type="url"
              placeholder="https://www.casino.org/bonuses/"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-purple-950/80 bg-[#120e22] text-zinc-200 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span>Pipeline Logs & Telemetry</span>
            </span>
            <span className="text-[11px] text-zinc-500">Gemini 3.8 Flash Parser</span>
          </div>

          <div className="rounded-xl border border-purple-950/80 bg-[#0a0812] p-4 font-mono text-xs text-purple-200/90 max-h-56 overflow-y-auto space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes('[SUCCESS]')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('[ERROR]')
                    ? 'text-rose-400 font-semibold'
                    : log.includes('Gemini')
                    ? 'text-purple-300'
                    : 'text-zinc-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-rose-900/40 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-950/60">
          <div className="text-[11px] text-zinc-500 font-mono">
            CLI Equivalent: <code className="text-purple-300">npm run scrape</code>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleRunScrape}
              disabled={isExecuting}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition-colors cursor-pointer shadow-sm shadow-purple-900/40"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Execute Live Scraper</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
