/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { executeScraper, loadStoredBonuses } from './src/services/scraperEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: Retrieve current scraped bonuses & metadata
app.get('/api/bonuses', (_req: Request, res: Response) => {
  const data = loadStoredBonuses();
  if (!data) {
    return res.status(404).json({ error: 'No scraped bonus data found. Please run the scraper.' });
  }
  return res.json(data);
});

// API: Trigger live re-scrape on demand
app.post('/api/scrape', async (req: Request, res: Response) => {
  try {
    const { sourceUrl, forceFallback } = req.body || {};
    const result = await executeScraper({ sourceUrl, forceFallback });
    return res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
});

// API: Health & Compliance status
app.get('/api/status', (_req: Request, res: Response) => {
  const data = loadStoredBonuses();
  return res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    lastScraped: data?.metadata?.lastScraped || null,
    totalCasinos: data?.casinos?.length || 0,
    complianceChecked: data?.metadata?.robotsChecked ?? false,
  });
});

async function startServer() {
  if (!isProduction) {
    // Mount Vite middleware for local development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BONUS//TRACKER] Server running at http://localhost:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer();
