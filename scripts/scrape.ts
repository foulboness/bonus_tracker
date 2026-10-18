/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dotenv from 'dotenv';
import { executeScraper } from '../src/services/scraperEngine.ts';

// Load .env variables
dotenv.config();

async function main() {
  console.log('\n======================================================');
  console.log('🎰 BONUS//TRACKER — Automated Casino Bonus Scraper');
  console.log('======================================================');
  console.log('• Checking robots.txt compliance');
  console.log('• Extracting welcome promotions & wagering terms');
  console.log('• AI-structuring free text via Gemini 3.8 Flash');
  console.log('• Exporting structured records to data/bonuses.json');
  console.log('------------------------------------------------------\n');

  try {
    const result = await executeScraper();

    console.log('\n✅ Scrape & AI Extraction Pipeline Completed Successfully!');
    console.log(`⏱  Execution Time: ${result.metadata.executionTimeMs}ms`);
    console.log(`🌐 Source: ${result.metadata.sourceName} (${result.metadata.sourceUrl})`);
    console.log(`🤖 AI Model: ${result.metadata.aiModelUsed}`);
    console.log(`📋 Compliance: ${result.metadata.complianceNote}\n`);

    console.log('Extracted & AI-Structured Casino Promotions:');
    console.table(
      result.casinos.map((c) => ({
        Casino: c.casinoName,
        'Welcome Bonus': c.welcomeBonus,
        Wagering: `${c.wageringMultiplier}x (${c.wageringTarget})`,
        'Min Dep': c.minDeposit,
        'Free Spins': c.freeSpins ?? 'N/A',
        'Match %': c.matchedPercentage ? `${c.matchedPercentage}%` : 'N/A',
        Rating: `${c.rating}/5.0`,
      }))
    );

    console.log('\n💾 JSON Output persisted to:');
    console.log('  -> data/bonuses.json');
    console.log('  -> src/data/bonuses.json\n');
    process.exit(0);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Scraper execution failed:', message);
    process.exit(1);
  }
}

main();
