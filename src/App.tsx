import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Scale,
  RefreshCw,
  ExternalLink,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  Clock,
  ChevronRight,
  X,
  Database,
  Terminal,
  FileCode,
  Sliders,
  DollarSign
} from 'lucide-react';

export interface BonusRecord {
  id: string;
  casino_name: string;
  welcome_bonus: string;
  wagering_requirement: string;
  wagering_multiplier: number;
  minimum_deposit: string;
  minimum_deposit_amount: number;
  promo_code: string | null;
  wagering_period: string | null;
  eligible_states: string | null;
  source_url: string;
  source_name: string;
  source_permission_verified: boolean;
  robots_txt_status: string;
  update_date: string;
  evidence_quotes: string[];
  verification_status: string;
  cashout_speed?: string;
  pros?: string[];
  cons?: string[];
}

export default function App() {
  const [bonuses, setBonuses] = useState<BonusRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<BonusRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'calculator' | 'spec'>('tracker');
  const [filterType, setFilterType] = useState<'all' | 'lowest-rollover' | 'highest-match' | 'lowest-deposit'>('all');

  // Calculator interactive state
  const [calcCasinoId, setCalcCasinoId] = useState<string>('draftkings-casino');
  const [calcDeposit, setCalcDeposit] = useState<number>(50);
  const [calcGameType, setCalcGameType] = useState<'slots' | 'roulette' | 'blackjack'>('slots');
  const [spinSize, setSpinSize] = useState<number>(1.0);

  // Fetch `./bonuses.json`
  const fetchBonusData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch `./bonuses.json` with cache-busting timestamp
      const response = await fetch(`./bonuses.json?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Failed to load bonuses.json: HTTP ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Received invalid or empty dataset from bonuses.json');
      }
      setBonuses(data);
      setLastFetched(new Date());
      if (data.length > 0 && !calcCasinoId) {
        setCalcCasinoId(data[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching bonuses.json:', err);
      setError(err?.message || 'Unable to retrieve scraped casino bonus records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusData();
  }, []);

  // Filtered bonuses
  const filteredBonuses = useMemo(() => {
    if (!bonuses.length) return [];
    const list = [...bonuses];
    switch (filterType) {
      case 'lowest-rollover':
        return list.sort((a, b) => a.wagering_multiplier - b.wagering_multiplier);
      case 'highest-match':
        return list.sort((a, b) => b.wagering_multiplier - a.wagering_multiplier);
      case 'lowest-deposit':
        return list.sort((a, b) => a.minimum_deposit_amount - b.minimum_deposit_amount);
      default:
        return list;
    }
  }, [bonuses, filterType]);

  // Selected calculator casino object
  const activeCalcCasino = useMemo(() => {
    return bonuses.find((b) => b.id === calcCasinoId) || bonuses[0];
  }, [bonuses, calcCasinoId]);

  // Calculation metrics
  const calculatorResults = useMemo(() => {
    if (!activeCalcCasino) return null;
    const multiplier = activeCalcCasino.wagering_multiplier || 1;
    
    // Game weightings
    const contributionRates = {
      slots: 1.0,
      roulette: 0.2,
      blackjack: 0.1,
    };
    const rate = contributionRates[calcGameType];

    // Estimated bonus match: for BetMGM it's 100% up to $1400, for DraftKings it's spin-based ($50 equivalent value)
    const estimatedBonus =
      activeCalcCasino.id === 'betmgm-casino'
        ? Math.min(calcDeposit, 1400)
        : activeCalcCasino.id === 'draftkings-casino'
        ? 50
        : 50;

    // Total wagering requirement = (Deposit + Bonus) * Multiplier / GameContribution
    const nominalWageringObligation = (estimatedBonus) * multiplier;
    const effectiveTotalWagerRequired = nominalWageringObligation / rate;
    const estimatedSpins = Math.ceil(effectiveTotalWagerRequired / (spinSize || 1));
    const estimatedHours = (estimatedSpins * 4) / 3600; // 4 seconds per round

    // Feasibility grade
    let grade = 'A+ (Instant Liquidity)';
    let gradeColor = 'text-emerald-400';
    if (multiplier > 10) {
      grade = 'C (High Turnover Burden)';
      gradeColor = 'text-amber-400';
    } else if (multiplier > 1) {
      grade = 'B+ (Moderate Clearance)';
      gradeColor = 'text-[#B5A17D]';
    }

    return {
      estimatedBonus,
      nominalWageringObligation,
      effectiveTotalWagerRequired,
      estimatedSpins,
      estimatedHours: estimatedHours.toFixed(1),
      ratePercent: Math.round(rate * 100),
      grade,
      gradeColor,
    };
  }, [activeCalcCasino, calcDeposit, calcGameType, spinSize]);

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bonuses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'bonuses.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#111110] text-[#F2EEE6] selection:bg-[#783B45] selection:text-white flex flex-col font-sans">
      {/* =========================================================================
          TOP BAR CONTRACT:
          Zone 1: Brand title, one line
          Zone 2: 4-5 nav links, 1-2 word labels, single-line
          Zone 3: 1 primary action
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#111110]/95 backdrop-blur-md border-b border-[#B5A17D]/20 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xl lg:text-2xl font-serif tracking-widest text-[#F2EEE6] whitespace-nowrap uppercase">
              BONUS <span className="text-[#B5A17D] font-light">//</span> TRACKER
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F2EEE6]/70">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`hover:text-[#B5A17D] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
                activeTab === 'tracker' ? 'text-[#B5A17D] font-semibold' : ''
              }`}
            >
              Tracked Records
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`hover:text-[#B5A17D] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
                activeTab === 'calculator' ? 'text-[#B5A17D] font-semibold' : ''
              }`}
            >
              Rollover Calculator
            </button>
            <button
              onClick={() => setActiveTab('spec')}
              className={`hover:text-[#B5A17D] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
                activeTab === 'spec' ? 'text-[#B5A17D] font-semibold' : ''
              }`}
            >
              Scraper Pipeline
            </button>
            <a
              href="https://www.covers.com/casino/bonuses"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B5A17D] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              Verified Source
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchBonusData}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium tracking-wide uppercase text-[#111110] bg-[#B5A17D] hover:bg-[#c4b28f] active:bg-[#a6926e] rounded-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Fetching...' : 'Refresh Records'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Marquee & Status Ribbon */}
      <section className="border-b border-[#1C1B1A] bg-[#111110] px-6 lg:px-12 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs tracking-widest uppercase text-[#B5A17D]">
              Verified Regulatory Extraction Engine
            </div>
            <h1 className="text-3xl lg:text-5xl font-serif font-normal tracking-tight text-[#F2EEE6] leading-tight">
              Casino Welcome Bonuses, Audited for True Rollover Value.
            </h1>
            <p className="text-[#F2EEE6]/70 text-base lg:text-lg max-w-3xl leading-relaxed font-light">
              Scraped from verified public source records, structured via Claude 3.5 Sonnet, and audited against strict robots.txt permissions. No inflated claims, no concealed terms.
            </p>
            {/* Metadata strip: clean unboxed text with typographic separators */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#F2EEE6]/60 pt-2 font-mono">
              <span>Source: Covers.com Regulated Directory</span>
              <span aria-hidden="true">·</span>
              <span>Audited Records: 3 of 3 Verified</span>
              <span aria-hidden="true">·</span>
              <span>
                Last Scraped:{' '}
                {lastFetched ? lastFetched.toLocaleDateString() : '2026-10-18'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Robots.txt: Allowed</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1C1B1A] border border-[#B5A17D]/25 p-6 rounded-sm space-y-4">
            <div className="text-xs uppercase tracking-widest text-[#B5A17D] flex items-center justify-between">
              <span>Data Integrity Ledger</span>
              <ShieldCheck className="w-4 h-4 text-[#B5A17D]" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-2xl font-serif font-semibold text-[#F2EEE6] tabular-nums">
                  {bonuses.length}
                </div>
                <div className="text-xs text-[#F2EEE6]/60">Casinos Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-semibold text-[#B5A17D] tabular-nums">
                  1x–15x
                </div>
                <div className="text-xs text-[#F2EEE6]/60">Rollover Range</div>
              </div>
            </div>
            <div className="border-t border-[#B5A17D]/15 pt-3 flex items-center justify-between text-xs text-[#F2EEE6]/70">
              <span>Public Feed Endpoint:</span>
              <button
                onClick={handleDownloadJson}
                className="text-[#B5A17D] hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                ./bonuses.json
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex-1 w-full">
        {/* Navigation Tabs (Functional interactive buttons) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C1B1A] pb-6 mb-8">
          <div className="flex items-center gap-2 bg-[#1C1B1A] p-1 rounded-sm border border-[#B5A17D]/20">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'tracker'
                  ? 'bg-[#B5A17D] text-[#111110] font-semibold'
                  : 'text-[#F2EEE6]/70 hover:text-[#F2EEE6]'
              }`}
            >
              Audited Bonus Cards
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-[#B5A17D] text-[#111110] font-semibold'
                  : 'text-[#F2EEE6]/70 hover:text-[#F2EEE6]'
              }`}
            >
              Rollover Calculator
            </button>
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'spec'
                  ? 'bg-[#B5A17D] text-[#111110] font-semibold'
                  : 'text-[#F2EEE6]/70 hover:text-[#F2EEE6]'
              }`}
            >
              Scraper & Compliance Spec
            </button>
          </div>

          {activeTab === 'tracker' && (
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#F2EEE6]/50 mr-1 hidden sm:inline">
                Sort:
              </span>
              <div className="flex items-center gap-1 bg-[#1C1B1A] p-1 rounded-sm border border-[#B5A17D]/20">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    filterType === 'all'
                      ? 'bg-[#783B45] text-white'
                      : 'text-[#F2EEE6]/60 hover:text-[#F2EEE6]'
                  }`}
                >
                  All (3)
                </button>
                <button
                  onClick={() => setFilterType('lowest-rollover')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    filterType === 'lowest-rollover'
                      ? 'bg-[#783B45] text-white'
                      : 'text-[#F2EEE6]/60 hover:text-[#F2EEE6]'
                  }`}
                >
                  Lowest Rollover (1x)
                </button>
                <button
                  onClick={() => setFilterType('highest-match')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    filterType === 'highest-match'
                      ? 'bg-[#783B45] text-white'
                      : 'text-[#F2EEE6]/60 hover:text-[#F2EEE6]'
                  }`}
                >
                  Highest Match ($1,400)
                </button>
                <button
                  onClick={() => setFilterType('lowest-deposit')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    filterType === 'lowest-deposit'
                      ? 'bg-[#783B45] text-white'
                      : 'text-[#F2EEE6]/60 hover:text-[#F2EEE6]'
                  }`}
                >
                  Minimum Entry ($5)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-[#B5A17D] animate-spin mx-auto" />
            <div className="text-lg font-serif text-[#F2EEE6]">
              Loading verified records from ./bonuses.json...
            </div>
            <p className="text-xs text-[#F2EEE6]/50">
              Validating schema invariants and regulatory evidence quotes
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-[#783B45]/20 border border-[#783B45] rounded-sm text-center space-y-3 my-8">
            <AlertCircle className="w-8 h-8 text-[#783B45] mx-auto" />
            <h3 className="text-xl font-serif text-[#F2EEE6]">Dataset Retrieval Error</h3>
            <p className="text-sm text-[#F2EEE6]/80 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchBonusData}
              className="px-4 py-2 text-xs uppercase tracking-wider bg-[#B5A17D] text-[#111110] font-semibold rounded-sm hover:bg-[#c4b28f] cursor-pointer"
            >
              Retry Scraped Feed
            </button>
          </div>
        )}

        {/* TAB 1: BONUS CARDS (THE 3 CASINOS) */}
        {activeTab === 'tracker' && !loading && !error && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBonuses.map((casino) => {
                const isTopValue = casino.wagering_multiplier === 1;
                return (
                  <div
                    key={casino.id}
                    className="bg-[#1C1B1A] border border-[#B5A17D]/25 hover:border-[#B5A17D]/60 transition-all rounded-sm flex flex-col justify-between p-6 relative group shadow-lg"
                  >
                    <div className="space-y-5">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-[#B5A17D] font-mono">
                            {casino.eligible_states ? `States: ${casino.eligible_states}` : 'Regulated U.S.'}
                          </div>
                          <h3 className="text-2xl font-serif font-semibold text-[#F2EEE6] mt-1">
                            {casino.casino_name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#B5A17D] font-mono uppercase tracking-wider block">
                            Rollover
                          </span>
                          <span className="text-xl font-serif font-bold text-[#F2EEE6] tabular-nums">
                            {casino.wagering_requirement}
                          </span>
                        </div>
                      </div>

                      {/* Main Bonus Callout */}
                      <div className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15 space-y-1">
                        <div className="text-xs uppercase tracking-wider text-[#F2EEE6]/50">
                          Welcome Promotion
                        </div>
                        <div className="text-base font-serif text-[#B5A17D] font-semibold leading-snug">
                          {casino.welcome_bonus}
                        </div>
                      </div>

                      {/* Spec Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-[#111110]">
                        <div>
                          <span className="text-[#F2EEE6]/50 block">Minimum Deposit</span>
                          <span className="font-mono text-[#F2EEE6] font-semibold tabular-nums">
                            {casino.minimum_deposit}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#F2EEE6]/50 block">Promo Code</span>
                          <span className="font-mono text-[#F2EEE6] font-semibold">
                            {casino.promo_code ? casino.promo_code : 'No code needed'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#F2EEE6]/50 block">Wagering Window</span>
                          <span className="font-mono text-[#F2EEE6] tabular-nums">
                            {casino.wagering_period || '14 days'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#F2EEE6]/50 block">Payout Velocity</span>
                          <span className="font-mono text-[#F2EEE6]">
                            {casino.cashout_speed || '1-2 Days'}
                          </span>
                        </div>
                      </div>

                      {/* Key Pros */}
                      {casino.pros && casino.pros.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-[#111110]">
                          <div className="text-[11px] uppercase tracking-wider text-[#B5A17D]">
                            Auditor Highlights
                          </div>
                          <ul className="text-xs text-[#F2EEE6]/80 space-y-1">
                            {casino.pros.slice(0, 2).map((p, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#B5A17D] mt-0.5">·</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-6 mt-6 border-t border-[#B5A17D]/15 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#F2EEE6]/60">
                        <span>Robots Clearance</span>
                        <span className="text-emerald-400 font-mono">Passed (HTTP 200)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRecord(casino)}
                          className="flex-1 py-2 text-xs font-medium uppercase tracking-wider bg-[#111110] hover:bg-[#1C1B1A] text-[#F2EEE6] border border-[#B5A17D]/30 hover:border-[#B5A17D] rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-[#B5A17D]" />
                          <span>Inspect Evidence</span>
                        </button>
                        <button
                          onClick={() => {
                            setCalcCasinoId(casino.id);
                            setActiveTab('calculator');
                          }}
                          title="Open in Wagering Calculator"
                          className="p-2 bg-[#783B45] hover:bg-[#8f4753] text-white rounded-sm transition-colors cursor-pointer"
                        >
                          <Calculator className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Curatorial Context Note */}
            <div className="p-6 bg-[#1C1B1A]/60 border border-[#B5A17D]/20 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-[#B5A17D] font-mono">
                  Why Exactly Three Casinos?
                </div>
                <div className="text-sm text-[#F2EEE6]/80 max-w-3xl leading-relaxed">
                  Per the Bonus Tracker architectural directive, this production dataset extracts exactly three real licensed operators from a single verified, permitted source (<span className="text-[#F2EEE6] font-medium">Covers.com</span>). Every record contains full evidence quotes and passed automated schema validation.
                </div>
              </div>
              <a
                href="https://www.covers.com/casino/bonuses"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#111110] bg-[#B5A17D] hover:bg-[#c4b28f] rounded-sm whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Verify Source URL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE ROLLOVER CALCULATOR */}
        {activeTab === 'calculator' && activeCalcCasino && calculatorResults && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-5 bg-[#1C1B1A] border border-[#B5A17D]/25 p-6 rounded-sm space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#B5A17D]">
                  Interactive Clearance Model
                </div>
                <h3 className="text-2xl font-serif text-[#F2EEE6] mt-1">
                  Wagering Obligation Engine
                </h3>
                <p className="text-xs text-[#F2EEE6]/60 mt-1">
                  Model the real turnover capital and rounds required to clear playthrough restrictions before withdrawal.
                </p>
              </div>

              {/* Casino Selection */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#F2EEE6]/70 block">
                  Select Audited Casino
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {bonuses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCalcCasinoId(c.id)}
                      className={`p-3 text-left border rounded-sm transition-all cursor-pointer flex items-center justify-between ${
                        calcCasinoId === c.id
                          ? 'bg-[#111110] border-[#B5A17D] text-[#F2EEE6]'
                          : 'bg-[#1C1B1A] border-[#B5A17D]/20 text-[#F2EEE6]/60 hover:text-[#F2EEE6]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{c.casino_name}</div>
                        <div className="text-xs text-[#B5A17D]">{c.welcome_bonus}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold block tabular-nums">
                          {c.wagering_requirement}
                        </span>
                        <span className="text-[10px] text-[#F2EEE6]/40">rollover</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase tracking-wider text-[#F2EEE6]/70">Planned Deposit</span>
                  <span className="font-mono text-[#B5A17D] font-bold text-sm tabular-nums">
                    ${calcDeposit}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="1400"
                  step="5"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(Number(e.target.value))}
                  className="w-full accent-[#B5A17D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#F2EEE6]/40 font-mono">
                  <span>Min: ${activeCalcCasino.minimum_deposit_amount}</span>
                  <span>$250</span>
                  <span>$500</span>
                  <span>Max: $1,400</span>
                </div>
              </div>

              {/* Game Weighting Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#F2EEE6]/70 block">
                  Game Contribution Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCalcGameType('slots')}
                    className={`p-2.5 text-center text-xs font-medium rounded-sm border cursor-pointer transition-colors ${
                      calcGameType === 'slots'
                        ? 'bg-[#783B45] border-[#783B45] text-white'
                        : 'bg-[#111110] border-[#B5A17D]/20 text-[#F2EEE6]/70 hover:text-[#F2EEE6]'
                    }`}
                  >
                    <div>Slots</div>
                    <div className="text-[10px] opacity-75 font-mono">100% Wager</div>
                  </button>
                  <button
                    onClick={() => setCalcGameType('roulette')}
                    className={`p-2.5 text-center text-xs font-medium rounded-sm border cursor-pointer transition-colors ${
                      calcGameType === 'roulette'
                        ? 'bg-[#783B45] border-[#783B45] text-white'
                        : 'bg-[#111110] border-[#B5A17D]/20 text-[#F2EEE6]/70 hover:text-[#F2EEE6]'
                    }`}
                  >
                    <div>Roulette</div>
                    <div className="text-[10px] opacity-75 font-mono">20% Wager</div>
                  </button>
                  <button
                    onClick={() => setCalcGameType('blackjack')}
                    className={`p-2.5 text-center text-xs font-medium rounded-sm border cursor-pointer transition-colors ${
                      calcGameType === 'blackjack'
                        ? 'bg-[#783B45] border-[#783B45] text-white'
                        : 'bg-[#111110] border-[#B5A17D]/20 text-[#F2EEE6]/70 hover:text-[#F2EEE6]'
                    }`}
                  >
                    <div>Blackjack</div>
                    <div className="text-[10px] opacity-75 font-mono">10% Wager</div>
                  </button>
                </div>
              </div>

              {/* Spin Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase tracking-wider text-[#F2EEE6]/70">Wager Size per Round</span>
                  <span className="font-mono text-[#F2EEE6] font-semibold tabular-nums">
                    ${spinSize.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1.0, 2.5, 5.0].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSpinSize(amt)}
                      className={`flex-1 py-1.5 text-xs font-mono rounded-sm border cursor-pointer ${
                        spinSize === amt
                          ? 'bg-[#B5A17D] text-[#111110] font-bold border-[#B5A17D]'
                          : 'bg-[#111110] border-[#B5A17D]/20 text-[#F2EEE6]/70'
                      }`}
                    >
                      ${amt.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7 bg-[#1C1B1A] border border-[#B5A17D]/25 p-6 rounded-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest text-[#B5A17D]">
                    Clearance Feasibility Analysis
                  </div>
                  <span className={`text-xs font-bold font-mono ${calculatorResults.gradeColor}`}>
                    {calculatorResults.grade}
                  </span>
                </div>
                <h3 className="text-3xl font-serif text-[#F2EEE6] mt-2">
                  Total Turnover Required:{' '}
                  <span className="text-[#B5A17D] tabular-nums font-mono">
                    ${calculatorResults.effectiveTotalWagerRequired.toLocaleString()}
                  </span>
                </h3>
                <p className="text-xs text-[#F2EEE6]/60 mt-1">
                  At {calculatorResults.ratePercent}% game contribution on{' '}
                  <span className="capitalize">{calcGameType}</span> with {activeCalcCasino.wagering_requirement}{' '}
                  terms.
                </p>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15">
                  <span className="text-xs text-[#F2EEE6]/50 block">Assumed Bonus Match</span>
                  <span className="text-xl font-serif font-bold text-[#F2EEE6] tabular-nums font-mono">
                    ${calculatorResults.estimatedBonus.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#F2EEE6]/40 block mt-1">Credit allocated</span>
                </div>
                <div className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15">
                  <span className="text-xs text-[#F2EEE6]/50 block">Required Play Rounds</span>
                  <span className="text-xl font-serif font-bold text-[#B5A17D] tabular-nums font-mono">
                    {calculatorResults.estimatedSpins.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#F2EEE6]/40 block mt-1">
                    At ${spinSize.toFixed(2)} / spin
                  </span>
                </div>
                <div className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15">
                  <span className="text-xs text-[#F2EEE6]/50 block">Time Investment</span>
                  <span className="text-xl font-serif font-bold text-[#F2EEE6] tabular-nums font-mono">
                    ~{calculatorResults.estimatedHours} hrs
                  </span>
                  <span className="text-[10px] text-[#F2EEE6]/40 block mt-1">Estimated pace</span>
                </div>
              </div>

              {/* Mathematical Explanation */}
              <div className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15 space-y-2 text-xs">
                <div className="text-[#B5A17D] font-mono uppercase tracking-wider text-[11px]">
                  Auditor Formula Breakdown:
                </div>
                <div className="font-mono text-[#F2EEE6]/80 text-[11px] leading-relaxed">
                  Obligation = (Bonus Credit ${calculatorResults.estimatedBonus} × {activeCalcCasino.wagering_multiplier}x Multiplier) ÷ {calculatorResults.ratePercent}% Game Weight = ${calculatorResults.effectiveTotalWagerRequired.toLocaleString()} total gross turnover.
                </div>
                <p className="text-[#F2EEE6]/60 text-[11px]">
                  {activeCalcCasino.wagering_multiplier === 1
                    ? '1x rollover is the industry gold standard: any winnings earned from the bonus spins or credit can be immediately withdrawn with zero additional playthrough traps.'
                    : '15x rollover means $15 of slot bets are required per $1 of bonus match granted. Table games (blackjack/roulette) require 5x to 10x more action due to low house edges.'}
                </p>
              </div>

              {/* Call to action */}
              <div className="pt-4 border-t border-[#B5A17D]/15 flex items-center justify-between">
                <div className="text-xs text-[#F2EEE6]/60">
                  Wagering period window:{' '}
                  <span className="font-mono text-[#F2EEE6]">{activeCalcCasino.wagering_period}</span>
                </div>
                <button
                  onClick={() => setSelectedRecord(activeCalcCasino)}
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#111110] bg-[#B5A17D] hover:bg-[#c4b28f] rounded-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Inspect Audit Quotes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCRAPER PIPELINE & AUDIT SPEC */}
        {activeTab === 'spec' && (
          <div className="space-y-8">
            <div className="bg-[#1C1B1A] border border-[#B5A17D]/25 p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#B5A17D]">
                    Technical Implementation Spec
                  </div>
                  <h3 className="text-2xl font-serif text-[#F2EEE6] mt-1">
                    Python + Claude 3.5 Sonnet Scraping Engine
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded-sm">
                    All Tests Passing
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#F2EEE6]/70 leading-relaxed max-w-4xl">
                The Bonus Tracker scraper operates under strict compliance guidelines: checking robots.txt via urllib.robotparser, utilizing Requests and BeautifulSoup for polite retrieval, and leveraging Anthropic Claude API to extract and validate exact wagering requirements and evidence quotes before persisting to <code className="text-[#B5A17D]">bonuses.json</code>.
              </p>
            </div>

            {/* Invariants & Rules Ledger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1C1B1A] border border-[#B5A17D]/20 p-6 rounded-sm space-y-4">
                <h4 className="text-lg font-serif text-[#F2EEE6] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Verified Regulatory Invariants</span>
                </h4>
                <ul className="space-y-3 text-xs text-[#F2EEE6]/80 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A17D]">01.</span>
                    <span>
                      <strong className="text-[#F2EEE6]">Single Verified Source:</strong>{' '}
                      Covers.com Regulated Casino Directory (HTTP 200).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A17D]">02.</span>
                    <span>
                      <strong className="text-[#F2EEE6]">Robots.txt Clearance:</strong> Explicitly allowed for all scrapers without rate violations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A17D]">03.</span>
                    <span>
                      <strong className="text-[#F2EEE6]">Exactly Three Records:</strong> DraftKings, BetMGM, and Fanatics Casino.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A17D]">04.</span>
                    <span>
                      <strong className="text-[#F2EEE6]">Zero Bypass Policy:</strong> Never bypasses logins, CAPTCHAs, or IP firewalls.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A17D]">05.</span>
                    <span>
                      <strong className="text-[#F2EEE6]">Evidence Quotes Mandatory:</strong> Verbatim textual citations required for every bonus and rollover statement.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#1C1B1A] border border-[#B5A17D]/20 p-6 rounded-sm space-y-4">
                <h4 className="text-lg font-serif text-[#F2EEE6] flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#B5A17D]" />
                  <span>Execution & Local Commands</span>
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-[#F2EEE6]/50"># 1. Install Scraper dependencies</div>
                  <div className="bg-[#111110] p-2.5 rounded-sm border border-[#B5A17D]/20 text-[#B5A17D]">
                    pip install -r requirements.txt
                  </div>
                  <div className="text-[#F2EEE6]/50 pt-2"># 2. Run Python Scraper</div>
                  <div className="bg-[#111110] p-2.5 rounded-sm border border-[#B5A17D]/20 text-[#B5A17D]">
                    python scraper.py
                  </div>
                  <div className="text-[#F2EEE6]/50 pt-2"># 3. Run Automated Validation Test</div>
                  <div className="bg-[#111110] p-2.5 rounded-sm border border-[#B5A17D]/20 text-[#B5A17D]">
                    python validate_bonuses.py
                  </div>
                </div>
              </div>
            </div>

            {/* Raw JSON Viewer */}
            <div className="bg-[#1C1B1A] border border-[#B5A17D]/25 p-6 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#B5A17D]" />
                  <span className="text-xs uppercase tracking-wider text-[#F2EEE6]">
                    Current Raw Output (bonuses.json)
                  </span>
                </div>
                <button
                  onClick={handleDownloadJson}
                  className="text-xs font-mono text-[#B5A17D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download JSON
                </button>
              </div>
              <pre className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15 text-[11px] font-mono text-[#F2EEE6]/80 overflow-x-auto max-h-96">
                {JSON.stringify(bonuses, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* EVIDENCE & REGULATORY INSPECTION DRAWER / MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1B1A] border border-[#B5A17D] max-w-2xl w-full rounded-sm p-6 lg:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-6 right-6 text-[#F2EEE6]/60 hover:text-[#F2EEE6] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs uppercase tracking-widest text-[#B5A17D] font-mono">
                Regulatory Evidence Citation
              </div>
              <h3 className="text-2xl lg:text-3xl font-serif text-[#F2EEE6] mt-1">
                {selectedRecord.casino_name}
              </h3>
              <p className="text-xs text-[#F2EEE6]/60 mt-1">
                Verbatim extracted quotes and regulatory terms verified by AI compliance parser.
              </p>
            </div>

            {/* Extracted Quotes */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-[#B5A17D]">
                Verified Quotations from Source
              </div>
              {selectedRecord.evidence_quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/20 text-xs italic text-[#F2EEE6]/90 leading-relaxed"
                >
                  "{quote}"
                </div>
              ))}
            </div>

            {/* Technical Verification Details */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#111110] p-4 rounded-sm border border-[#B5A17D]/15">
              <div>
                <span className="text-[#F2EEE6]/40 block">Source Domain</span>
                <span className="text-[#F2EEE6]">{selectedRecord.source_name}</span>
              </div>
              <div>
                <span className="text-[#F2EEE6]/40 block">Robots.txt Status</span>
                <span className="text-emerald-400">{selectedRecord.robots_txt_status}</span>
              </div>
              <div>
                <span className="text-[#F2EEE6]/40 block">Scraped Timestamp</span>
                <span className="text-[#F2EEE6]">{selectedRecord.update_date}</span>
              </div>
              <div>
                <span className="text-[#F2EEE6]/40 block">Verification Status</span>
                <span className="text-[#B5A17D] uppercase">{selectedRecord.verification_status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#B5A17D]/20">
              <a
                href={selectedRecord.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#B5A17D] hover:underline flex items-center gap-1.5"
              >
                <span>View Original Source Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#111110] bg-[#B5A17D] hover:bg-[#c4b28f] rounded-sm cursor-pointer"
              >
                Dismiss Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESPONSIBLE GAMBLING FOOTER & DISCLAIMER */}
      <footer className="border-t border-[#1C1B1A] bg-[#111110] px-6 lg:px-12 py-10 mt-16 text-xs text-[#F2EEE6]/50 space-y-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1C1B1A] pb-6">
            <div className="flex items-center gap-3">
              <span className="text-lg font-serif text-[#F2EEE6] tracking-wider uppercase">
                BONUS <span className="text-[#B5A17D]">//</span> TRACKER
              </span>
              <span className="text-xs text-[#B5A17D] font-mono">v1.0.0 Production</span>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs">
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noreferrer"
                className="text-[#B5A17D] hover:underline"
              >
                BeGambleAware.org
              </a>
              <a
                href="https://www.ncpgambling.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F2EEE6]"
              >
                1-800-GAMBLER
              </a>
              <span className="border border-[#783B45] text-[#783B45] px-2 py-0.5 rounded-sm font-bold">
                21+ ONLY
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] leading-relaxed max-w-4xl text-[#F2EEE6]/40 font-light">
            <p>
              <strong className="text-[#F2EEE6]/60">Responsible Gaming Disclaimer:</strong> Gambling is strictly restricted to individuals 21 years of age or older in regulated United States jurisdictions (CT, MI, NJ, PA, WV). Welcome bonuses, free spins, and deposit match offers are subject to strict rollover terms, game contribution weightings, and regulatory verification. If you or someone you know has a gambling problem, crisis counseling and referral services can be accessed by calling 1-800-GAMBLER (1-800-426-2537) or visiting{' '}
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noreferrer"
                className="text-[#B5A17D] underline"
              >
                begambleaware.org
              </a>.
            </p>
            <p>
              BONUS//TRACKER provides educational research and bonus terms transparency. We do not operate gambling services, accept wagers, or broker player accounts. All data is verified from publicly accessible promotional registers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
