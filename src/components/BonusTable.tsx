/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ExternalLink, 
  Sparkles, 
  Info, 
  Search, 
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import type { CasinoBonus } from '../types/bonus';

interface BonusTableProps {
  casinos: CasinoBonus[];
  onSelectCasinoForTerms: (casino: CasinoBonus) => void;
  onSelectForCalculator: (casino: CasinoBonus) => void;
}

type SortField = 'wageringMultiplier' | 'minDepositNumeric' | 'rating' | 'casinoName';
type SortOrder = 'asc' | 'desc';

export const BonusTable: React.FC<BonusTableProps> = ({
  casinos,
  onSelectCasinoForTerms,
  onSelectForCalculator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('wageringMultiplier');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterType, setFilterType] = useState<'all' | 'spins' | 'match'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Default to asc for wagering & deposit (lower is better for player), desc for rating
      setSortOrder(field === 'rating' ? 'desc' : 'asc');
    }
  };

  const filteredCasinos = useMemo(() => {
    return casinos
      .filter((c) => {
        const matchesSearch =
          c.casinoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.welcomeBonus.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.wageringRaw.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filterType === 'spins') return (c.freeSpins ?? 0) > 0;
        if (filterType === 'match') return (c.matchedPercentage ?? 0) > 0;
        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA ?? 0) - (valB ?? 0) : (valB ?? 0) - (valA ?? 0);
      });
  }, [casinos, searchTerm, sortField, sortOrder, filterType]);

  return (
    <section id="comparison" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-purple-400 tracking-wider uppercase mb-1">
              Live Scraped Dataset · 3 Verified Operators
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Casino Welcome Promotions Comparison
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Extracted directly from public promotion directories and normalized by Gemini AI into uniform wagering ratios.
            </p>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-purple-900/40 bg-[#0e0c18] p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Desktop Table View"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Mobile Cards View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center rounded-lg border border-purple-900/40 bg-[#0e0c18] p-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All (3)
              </button>
              <button
                onClick={() => setFilterType('match')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterType === 'match'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Deposit Matches
              </button>
              <button
                onClick={() => setFilterType('spins')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterType === 'spins'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Free Spins
              </button>
            </div>
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter by casino or bonus text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-purple-950/60 bg-[#0d0b17] text-zinc-200 placeholder-zinc-500 focus:border-purple-500 focus:outline-none transition-colors"
            >
            </input>
          </div>

          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <span>Showing {filteredCasinos.length} of {casinos.length} scraped casinos</span>
            <span aria-hidden="true">·</span>
            <span>All wagering multipliers normalized to 1.0x factor</span>
          </div>
        </div>

        {/* 1. TABLE VIEW */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-xl border border-purple-950/60 bg-[#0d0b17] shadow-xl shadow-purple-950/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-900/40 bg-[#120e22] text-zinc-400 font-medium">
                  <th 
                    scope="col" 
                    className="py-3.5 pl-4 pr-3 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('casinoName')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Casino & Operator</span>
                      <ArrowUpDown className="h-3 w-3 text-purple-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Welcome Bonus
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-3.5 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('wageringMultiplier')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Wagering Multiplier</span>
                      <ArrowUpDown className="h-3 w-3 text-purple-400" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-3.5 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('minDepositNumeric')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Min. Deposit</span>
                      <ArrowUpDown className="h-3 w-3 text-purple-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 hidden lg:table-cell">
                    Game Contribution
                  </th>
                  <th scope="col" className="px-3 py-3.5 hidden md:table-cell">
                    AI Ambiguity Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right pr-4">
                    Analysis & Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/40 text-zinc-300">
                {filteredCasinos.map((casino) => (
                  <tr 
                    key={casino.id}
                    className="hover:bg-purple-950/20 transition-colors group"
                  >
                    {/* Casino Name */}
                    <td className="py-4 pl-4 pr-3 font-medium text-white">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-['Outfit'] text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                            {casino.casinoName}
                          </span>
                          {casino.highlightBadge && (
                            <span className="text-[10px] font-mono text-purple-300 border border-purple-500/30 bg-purple-900/20 px-1.5 py-0.5 rounded">
                              {casino.highlightBadge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                          <span>Rating: <strong className="text-zinc-200 tabular-nums">{casino.rating}</strong>/5.0</span>
                          <span aria-hidden="true">·</span>
                          <span>AI Conf: <strong className="text-purple-300 tabular-nums">{Math.round(casino.aiConfidence * 100)}%</strong></span>
                        </div>
                      </div>
                    </td>

                    {/* Welcome Bonus */}
                    <td className="px-3 py-4 max-w-xs">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-purple-200 leading-snug">
                          {casino.welcomeBonus}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                          {casino.matchedPercentage && (
                            <span>{casino.matchedPercentage}% Match</span>
                          )}
                          {casino.freeSpins && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{casino.freeSpins} Free Spins</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>Max: {casino.maxBonusAmount}</span>
                        </div>
                      </div>
                    </td>

                    {/* Wagering Requirement */}
                    <td className="px-3 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-white bg-purple-950/80 border border-purple-800/40 px-2 py-0.5 rounded tabular-nums">
                            {casino.wageringMultiplier}x
                          </span>
                          <span className="text-[11px] text-zinc-400 capitalize">
                            ({casino.wageringTarget.replace(/_/g, ' ')})
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 mt-1 font-mono truncate max-w-[200px]" title={casino.wageringRaw}>
                          {casino.wageringRaw}
                        </span>
                      </div>
                    </td>

                    {/* Min Deposit */}
                    <td className="px-3 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-zinc-100 tabular-nums">
                          {casino.minDeposit}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {casino.currency} currency
                        </span>
                      </div>
                    </td>

                    {/* Game Contribution */}
                    <td className="px-3 py-4 hidden lg:table-cell text-zinc-400">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300">Slots: 100% turnover</span>
                        <span className="text-[11px] text-zinc-400">Tables: 10% · Live: 0%</span>
                        <span className="text-[11px] text-zinc-400">Max Bet: {casino.maxBet || '$5.00'}</span>
                      </div>
                    </td>

                    {/* Missing / Ambiguous Fields */}
                    <td className="px-3 py-4 hidden md:table-cell">
                      {casino.missingOrAmbiguousFields && casino.missingOrAmbiguousFields.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-[220px]">
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>{casino.missingOrAmbiguousFields.length} Inferred Term{casino.missingOrAmbiguousFields.length > 1 ? 's' : ''}</span>
                          </span>
                          <span className="text-[11px] text-zinc-400 truncate" title={casino.missingOrAmbiguousFields[0]}>
                            {casino.missingOrAmbiguousFields[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-400/90">All terms explicit</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 pl-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectCasinoForTerms(casino)}
                          className="px-2.5 py-1.5 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 rounded-lg transition-colors cursor-pointer"
                          title="View Gemini AI Extraction Analysis"
                        >
                          Deep Terms
                        </button>
                        <button
                          onClick={() => onSelectForCalculator(casino)}
                          className="px-2.5 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors cursor-pointer shadow-xs"
                          title="Calculate Wagering Cost"
                        >
                          Calculate
                        </button>
                        <a
                          href={casino.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                          title="View verified public source URL"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* 2. MOBILE & CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCasinos.map((casino) => (
              <div
                key={casino.id}
                className="flex flex-col justify-between rounded-xl border border-purple-900/40 bg-[#0d0b17] p-5 shadow-lg shadow-purple-950/10 hover:border-purple-700/60 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-['Outfit'] text-lg font-bold text-white">
                        {casino.casinoName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span>Rating: <strong className="text-zinc-300 tabular-nums">{casino.rating}</strong>/5.0</span>
                        <span aria-hidden="true">·</span>
                        <span>AI Confidence: <strong className="text-purple-300 tabular-nums">{Math.round(casino.aiConfidence * 100)}%</strong></span>
                      </div>
                    </div>
                    {casino.highlightBadge && (
                      <span className="text-[10px] font-mono text-purple-300 border border-purple-500/30 bg-purple-950/50 px-2 py-0.5 rounded">
                        {casino.highlightBadge}
                      </span>
                    )}
                  </div>

                  {/* Bonus Highlight */}
                  <div className="rounded-lg border border-purple-950/80 bg-[#120e24] p-3 mb-4">
                    <span className="text-xs text-zinc-400 block mb-0.5">Welcome Package</span>
                    <span className="text-base font-bold text-purple-200 block">
                      {casino.welcomeBonus}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                      {casino.matchedPercentage && <span>{casino.matchedPercentage}% Match</span>}
                      {casino.freeSpins && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{casino.freeSpins} FS</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>Max: {casino.maxBonusAmount}</span>
                    </div>
                  </div>

                  {/* Metric Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2 mb-4 border-t border-purple-950/40">
                    <div>
                      <span className="text-xs text-zinc-500 block mb-0.5">Wagering Requirement</span>
                      <span className="text-base font-mono font-bold text-white tabular-nums">
                        {casino.wageringMultiplier}x
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {casino.wageringTarget.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block mb-0.5">Minimum Deposit</span>
                      <span className="text-base font-mono font-bold text-zinc-200 tabular-nums">
                        {casino.minDeposit}
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {casino.currency}
                      </span>
                    </div>
                  </div>

                  {/* Ambiguity Callout */}
                  {casino.missingOrAmbiguousFields && casino.missingOrAmbiguousFields.length > 0 && (
                    <div className="rounded-md border border-amber-900/30 bg-amber-950/20 p-2.5 mb-4 text-[11px] text-amber-300/90">
                      <div className="flex items-center gap-1 font-semibold mb-0.5">
                        <AlertCircle className="h-3 w-3" />
                        <span>Inferred / Missing Terms:</span>
                      </div>
                      <p className="text-zinc-400 text-[10px] leading-relaxed">
                        {casino.missingOrAmbiguousFields[0]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-purple-950/40">
                  <button
                    onClick={() => onSelectForCalculator(casino)}
                    className="flex-1 min-h-[44px] flex items-center justify-center rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
                  >
                    Calculate Cost
                  </button>
                  <button
                    onClick={() => onSelectCasinoForTerms(casino)}
                    className="min-h-[44px] px-3.5 flex items-center justify-center rounded-lg border border-purple-800/40 bg-purple-950/30 text-xs font-medium text-purple-200 hover:bg-purple-900/40 transition-colors"
                  >
                    Terms
                  </button>
                  <a
                    href={casino.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-purple-900/30 text-zinc-400 hover:text-zinc-200 hover:border-purple-700/50 transition-colors"
                    title="View Source Page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
