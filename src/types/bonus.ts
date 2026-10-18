/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CasinoBonus {
  id: string;
  casinoName: string;
  welcomeBonus: string;
  wageringMultiplier: number;
  wageringTarget: 'bonus_only' | 'deposit_plus_bonus' | 'spins_winnings' | 'mixed';
  wageringRaw: string;
  minDeposit: string;
  minDepositNumeric: number;
  currency: string;
  matchedPercentage: number | null;
  maxBonusAmount: string;
  freeSpins: number | null;
  validityDays: number | null;
  maxBet: string | null;
  eligibleGames: string[];
  keyTermsSnippet: string;
  aiConfidence: number;
  missingOrAmbiguousFields: string[];
  sourceUrl: string;
  scrapedAt: string;
  rating: number;
  highlightBadge?: string;
}

export interface ScrapeMetadata {
  lastScraped: string;
  sourceUrl: string;
  sourceName: string;
  totalCasinos: number;
  robotsChecked: boolean;
  robotsAllowed: boolean;
  complianceNote: string;
  executionTimeMs: number;
  aiModelUsed: string;
}

export interface ScrapeResult {
  success: boolean;
  metadata: ScrapeMetadata;
  casinos: CasinoBonus[];
  logs: string[];
  error?: string;
}
