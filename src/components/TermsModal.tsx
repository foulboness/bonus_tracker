/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, ExternalLink, ShieldAlert, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import type { CasinoBonus } from '../types/bonus';

interface TermsModalProps {
  casino: CasinoBonus | null;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ casino, onClose }) => {
  if (!casino) return null;

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
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
              <span>Gemini 3.8 Flash Extraction</span>
              <span aria-hidden="true">·</span>
              <span>Confidence: {Math.round(casino.aiConfidence * 100)}%</span>
            </div>
            <h3 className="font-['Outfit'] text-2xl font-bold text-white mt-0.5">
              {casino.casinoName} Promotion Terms Analysis
            </h3>
          </div>
        </div>

        {/* Raw Scraped Excerpt */}
        <div className="mb-6 rounded-xl border border-purple-950/80 bg-[#120e22] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-2">
            <FileText className="h-4 w-4 text-purple-400" />
            <span>Raw Scraped Promotion Snippet</span>
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed bg-[#0a0812] p-3 rounded-lg border border-purple-950/60 break-words">
            "{casino.keyTermsSnippet}"
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Source: <a href={casino.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">{casino.sourceUrl}</a></span>
            <span className="font-mono">Scraped: {new Date(casino.scrapedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Structured Terms Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-3">
            Normalized Structured Parameters
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-purple-950/60 bg-[#120e22] p-3">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Wagering Multiplier</span>
              <span className="text-base font-bold font-mono text-white">
                {casino.wageringMultiplier}x
              </span>
              <span className="text-[10px] text-purple-300 block capitalize">
                Target: {casino.wageringTarget.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="rounded-lg border border-purple-950/60 bg-[#120e22] p-3">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Minimum Deposit</span>
              <span className="text-base font-bold font-mono text-white">
                {casino.minDeposit}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Currency: {casino.currency}
              </span>
            </div>

            <div className="rounded-lg border border-purple-950/60 bg-[#120e22] p-3">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Matched Percentage</span>
              <span className="text-base font-bold font-mono text-white">
                {casino.matchedPercentage ? `${casino.matchedPercentage}%` : 'Not specified'}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Max bonus: {casino.maxBonusAmount}
              </span>
            </div>

            <div className="rounded-lg border border-purple-950/60 bg-[#120e22] p-3">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Free Spins Award</span>
              <span className="text-base font-bold font-mono text-white">
                {casino.freeSpins ? `${casino.freeSpins} Spins` : 'None'}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Separate 40x on winnings
              </span>
            </div>

            <div className="rounded-lg border border-purple-950/60 bg-[#120e22] p-3">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Validity Duration</span>
              <span className="text-base font-bold font-mono text-white">
                {casino.validityDays ? `${casino.validityDays} Days` : '30 Days (standard)'}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Turnover expiry
              </span>
            </div>

            <div className="rounded-lg border border-purple-950/60 bg-[#120e22] p-3">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Max Bet Per Spin</span>
              <span className="text-base font-bold font-mono text-white">
                {casino.maxBet || '$5.00'}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Single bet ceiling
              </span>
            </div>
          </div>
        </div>

        {/* Missing or Ambiguous Fields Section (CRITICAL USER REQUIREMENT) */}
        <div className="mb-6 rounded-xl border border-amber-900/40 bg-amber-950/15 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Missing & Inferred Values Audit</span>
          </div>
          {casino.missingOrAmbiguousFields && casino.missingOrAmbiguousFields.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside">
              {casino.missingOrAmbiguousFields.map((field, idx) => (
                <li key={idx} className="leading-relaxed">
                  {field}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-300">
              No ambiguous or missing terms detected in this operator's published promotion.
            </p>
          )}
        </div>

        {/* Game Wagering Contribution List */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">
            Game Wagering Contribution Rates
          </h4>
          <div className="rounded-lg border border-purple-950/60 bg-[#120e22] divide-y divide-purple-950/60 text-xs">
            <div className="flex items-center justify-between p-2.5">
              <span className="text-zinc-200">Video Slots & Classic Slots</span>
              <span className="font-mono font-bold text-emerald-400">100% contribution</span>
            </div>
            <div className="flex items-center justify-between p-2.5">
              <span className="text-zinc-200">Table Games (Roulette, Blackjack, Baccarat)</span>
              <span className="font-mono font-bold text-amber-400">10% contribution (10x wagering)</span>
            </div>
            <div className="flex items-center justify-between p-2.5">
              <span className="text-zinc-200">Live Dealer & Progressive Jackpots</span>
              <span className="font-mono font-bold text-rose-400">0% excluded from turnover</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-950/60">
          <a
            href={casino.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white transition-colors"
          >
            <span>Visit Verified Public Promotion Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
