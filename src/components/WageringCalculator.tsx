/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, RotateCcw, AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import type { CasinoBonus } from '../types/bonus';

interface WageringCalculatorProps {
  casinos: CasinoBonus[];
  selectedCasinoId?: string;
}

export const WageringCalculator: React.FC<WageringCalculatorProps> = ({ casinos, selectedCasinoId }) => {
  const [activeCasinoId, setActiveCasinoId] = useState<string>(
    selectedCasinoId || casinos[0]?.id || ''
  );
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [spinSize, setSpinSize] = useState<number>(1.0);

  // Sync if selectedCasinoId changes
  React.useEffect(() => {
    if (selectedCasinoId) {
      setActiveCasinoId(selectedCasinoId);
    }
  }, [selectedCasinoId]);

  const activeCasino = useMemo(() => {
    return casinos.find((c) => c.id === activeCasinoId) || casinos[0];
  }, [casinos, activeCasinoId]);

  const calculations = useMemo(() => {
    if (!activeCasino) {
      return {
        bonusCash: 0,
        totalBankroll: 0,
        wageringRequired: 0,
        spinsNeeded: 0,
        estimatedLoss: 0,
        difficultyRating: 'Moderate',
      };
    }

    const matchPct = activeCasino.matchedPercentage || 100;
    const bonusCash = Math.round(depositAmount * (matchPct / 100));
    const totalBankroll = depositAmount + bonusCash;
    
    // Wagering calculation
    let wageringRequired = 0;
    if (activeCasino.wageringTarget === 'deposit_plus_bonus') {
      wageringRequired = (depositAmount + bonusCash) * activeCasino.wageringMultiplier;
    } else {
      // bonus_only or mixed
      wageringRequired = bonusCash * activeCasino.wageringMultiplier;
    }

    const spinsNeeded = Math.ceil(wageringRequired / (spinSize || 1));
    // Assuming standard 96.5% RTP (3.5% house edge)
    const estimatedLoss = Math.round(wageringRequired * 0.035);

    let difficultyRating = 'Friendly';
    if (activeCasino.wageringMultiplier > 45) {
      difficultyRating = 'Extreme';
    } else if (activeCasino.wageringMultiplier > 35) {
      difficultyRating = 'Challenging';
    }

    return {
      bonusCash,
      totalBankroll,
      wageringRequired,
      spinsNeeded,
      estimatedLoss,
      difficultyRating,
    };
  }, [activeCasino, depositAmount, spinSize]);

  if (!activeCasino) return null;

  return (
    <section id="calculator" className="py-14 border-t border-purple-950/40 bg-[#090810]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-mono text-purple-400 tracking-wider uppercase mb-1">
            Financial Simulation Model
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Wagering Turnover & Real Cost Calculator
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Simulate your planned deposit to determine the exact turnover volume required before any winnings can be withdrawn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-purple-900/40 bg-[#0d0b17] p-6 shadow-xl">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-4">
              Select Casino & Stake
            </h3>

            {/* Casino Selector */}
            <div className="mb-5">
              <label className="text-xs text-zinc-400 block mb-2 font-medium">
                Target Casino Operator
              </label>
              <div className="grid grid-cols-3 gap-2">
                {casinos.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCasinoId(c.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center truncate ${
                      activeCasinoId === c.id
                        ? 'border-purple-500 bg-purple-950/60 text-white font-semibold shadow-xs'
                        : 'border-purple-950/80 bg-[#120e22] text-zinc-400 hover:text-zinc-200 hover:border-purple-800/40'
                    }`}
                  >
                    {c.casinoName}
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Input */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Planned Deposit Amount ({activeCasino.currency})</span>
                <span className="font-mono text-white text-sm font-bold">
                  ${depositAmount}
                </span>
              </div>
              <input
                type="range"
                min={activeCasino.minDepositNumeric}
                max={500}
                step={5}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1.5 font-mono">
                <span>Min: ${activeCasino.minDepositNumeric}</span>
                <span>$100</span>
                <span>$250</span>
                <span>Max: $500</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 mt-3">
                {[20, 50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(Math.max(amt, activeCasino.minDepositNumeric))}
                    className={`flex-1 py-1 text-xs rounded border transition-colors ${
                      depositAmount === amt
                        ? 'border-purple-500 bg-purple-600/30 text-purple-200'
                        : 'border-purple-950/80 bg-[#120e22] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Average Spin Bet Size */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Average Bet per Spin</span>
                <span className="font-mono text-white font-bold">
                  ${spinSize.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1.0, 2.0, 5.0].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSpinSize(size)}
                    className={`py-1.5 text-xs font-mono rounded border transition-colors ${
                      spinSize === size
                        ? 'border-purple-500 bg-purple-600/30 text-purple-200 font-bold'
                        : 'border-purple-950/80 bg-[#120e22] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ${size.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-purple-950/50 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Wagering Target: <strong className="text-zinc-300 capitalize">{activeCasino.wageringTarget}</strong></span>
              <span>Multiplier: <strong className="text-purple-300 font-mono">{activeCasino.wageringMultiplier}x</strong></span>
            </div>
          </div>

          {/* Results Summary Display (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-purple-800/40 bg-gradient-to-br from-[#120d22] to-[#0c0a18] p-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4 mb-6">
              <div>
                <span className="text-xs text-purple-400 font-mono uppercase tracking-wider block">
                  Turnover Analysis for {activeCasino.casinoName}
                </span>
                <h3 className="font-['Outfit'] text-xl font-bold text-white mt-0.5">
                  Obligation & Probability Breakdown
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-zinc-400 block">Difficulty</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                  calculations.difficultyRating === 'Extreme'
                    ? 'border-rose-500/40 bg-rose-950/40 text-rose-300'
                    : 'border-purple-500/40 bg-purple-950/40 text-purple-300'
                }`}>
                  {calculations.difficultyRating} ({activeCasino.wageringMultiplier}x)
                </span>
              </div>
            </div>

            {/* Top 3 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg border border-purple-950/80 bg-[#0d0b17] p-4">
                <span className="text-xs text-zinc-400 block mb-1">Bonus Granted</span>
                <span className="text-2xl font-bold font-mono text-purple-300 tabular-nums">
                  +${calculations.bonusCash}
                </span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">
                  {activeCasino.matchedPercentage ? `${activeCasino.matchedPercentage}% match` : 'Flat promo'}
                </span>
              </div>

              <div className="rounded-lg border border-purple-950/80 bg-[#0d0b17] p-4">
                <span className="text-xs text-zinc-400 block mb-1">Starting Bankroll</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  ${calculations.totalBankroll}
                </span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">
                  ${depositAmount} dep + ${calculations.bonusCash} bonus
                </span>
              </div>

              <div className="rounded-lg border border-purple-800/60 bg-purple-950/30 p-4">
                <span className="text-xs text-purple-300 font-medium block mb-1">Total Turnover Needed</span>
                <span className="text-2xl font-bold font-mono text-purple-200 tabular-nums">
                  ${calculations.wageringRequired.toLocaleString()}
                </span>
                <span className="text-[11px] text-purple-400/80 block mt-0.5">
                  ${calculations.bonusCash} × {activeCasino.wageringMultiplier}x
                </span>
              </div>
            </div>

            {/* Spin Volume & Expected Loss Metrics */}
            <div className="rounded-lg border border-purple-950/60 bg-[#0d0b17] p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-zinc-400 block">Total Bets Required (at ${spinSize.toFixed(2)}/spin)</span>
                  <span className="text-lg font-bold font-mono text-zinc-100 tabular-nums">
                    {calculations.spinsNeeded.toLocaleString()} spins
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    At 600 spins/hour, this turnover takes approximately {(calculations.spinsNeeded / 600).toFixed(1)} hours of continuous play.
                  </p>
                </div>

                <div className="sm:border-l sm:border-purple-950/80 sm:pl-6">
                  <span className="text-xs text-zinc-400 block">Statistical House Cost (3.5% Edge)</span>
                  <span className="text-lg font-bold font-mono text-rose-300 tabular-nums">
                    ~${calculations.estimatedLoss}
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Expected math loss over the full turnover cycle.
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Terms Takeaway */}
            <div className="flex items-start gap-2.5 text-xs text-zinc-400 bg-[#0e0c18] border border-purple-950/60 p-3.5 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200">Wagering Math Reality: </span>
                To cash out the ${calculations.bonusCash} bonus, you must wager a total of ${calculations.wageringRequired.toLocaleString()} across eligible games (100% on slots). If you play table games (10% contribution), you would need to wager ${(calculations.wageringRequired * 10).toLocaleString()}.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
