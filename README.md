# BONUS//TRACKER 

A production-grade online casino welcome bonus tracker, rollover calculation engine, and verified regulatory terms extraction platform.

Built with a **Python Scraper (Requests + BeautifulSoup)**, **Anthropic Claude API (Claude 3.5 Sonnet)**, **Google Studio** for regulatory bonus terms extraction, a **Noir Casino Luxury frontend (React + Tailwind CSS)**, and automated validation for static deployment on **Vercel** or **GitHub Pages**.

---

## 1. Architecture Overview

```
┌────────────────────────────────┐
│  Verified Public Source        │
│  (Covers.com Regulated Register│
│  Robots.txt: Allowed)          │
└───────────────┬────────────────┘
                │ Requests + BeautifulSoup
                ▼
┌────────────────────────────────┐
│  scraper.py                    │
│  - robots.txt check            │
│  - HTML extraction             │
│  - Claude 3.5 Sonnet / Parser  │
│  - Strict Invariant Validation │
└───────────────┬────────────────┘
                │ writes
                ▼
┌────────────────────────────────┐
│  bonuses.json & public/        │
│  (3 Verified Casino Records)   │
└───────────────┬────────────────┘
                │ fetched via fetch('./bonuses.json')
                ▼
┌────────────────────────────────┐
│  Noir Casino Luxury Frontend   │
│  - 3 Luxury Casino Cards       │
│  - Interactive Rollover Engine │
│  - Evidence Audit Drawer       │
│  - 18+ Responsible Disclaimer  │
└────────────────────────────────┘
```

---

## 2. Setup Guide (Windows 11 & VS Code)

### Prerequisites on Windows 11:
1. **Python 3.10+**: Download from [python.org](https://www.python.org/downloads/). During installation, **check the box "Add Python to PATH"**.
2. **Node.js (LTS)**: Download from [nodejs.org](https://nodejs.org/).
3. **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).
4. **Git for Windows**: Download from [gitforwindows.org](https://gitforwindows.org/).

---

### Step 1: Open the Project in VS Code
1. Open **VS Code**.
2. Click **File > Open Folder...** and select this project directory.
3. Open a new terminal in VS Code by pressing ``Ctrl + ` `` (or **Terminal > New Terminal**).

---

### Step 2: Configure Environment Variables
1. Make a copy of `.env.example` named `.env`:
   - On Windows PowerShell:
     ```powershell
     copy .env.example .env
     ```
2. Open `.env` and configure your API key (if you wish to use Claude 3.5 Sonnet):
   ```ini
   ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
   SOURCE_URL=https://www.covers.com/casino/bonuses
   USER_AGENT="BonusTrackerBot/1.0 (Educational research; +https://github.com/bonus-tracker)"
   ```
   *(Note: If you do not have an Anthropic API key yet, the scraper includes a verified deterministic BeautifulSoup parser that extracts the same verified fields without crashing).*

---

### Step 3: Install Dependencies
In the VS Code terminal, run:

```bash
# 1. Install Node.js frontend dependencies
npm install

# 2. Install Python scraper dependencies
pip install -r requirements.txt
```

---

### Step 4: Run the Scraper & Validation Suite

```bash
# 1. Run the Python scraper
python scraper.py
# (or via npm shortcut):
npm run scrape

# 2. Run the automated schema validation suite
python validate_bonuses.py
# (or via npm shortcut):
npm run validate
```

Both commands will output:
- `Robots.txt permission: ALLOWED`
- `Successfully retrieved HTML content`
- `All 3 records passed validation successfully!`
- `Saved 3 records to bonuses.json and public/bonuses.json`

---

### Step 5: Run the Frontend Locally

```bash
npm run dev
```

Open your browser to `http://localhost:3000`. You will see the **Noir Casino Luxury** interface fetching `./bonuses.json` and rendering:
- The 3 audited online casinos (**DraftKings Casino**, **BetMGM Casino**, and **Fanatics Casino**).
- Full rollover terms, minimum deposit values, states, and promo codes.
- Interactive **Wagering Obligation Calculator** with game contribution rates.
- **Inspect Evidence** drawer displaying verbatim source quotes.
- Mandatory **21+ Responsible Gaming Disclaimer** (1-800-GAMBLER, BeGambleAware.org).

---

## 3. GitHub & Vercel Deployment Guide

### Deploying to GitHub:
1. Initialize Git and commit the project:
   ```bash
   git init
   git add .
   git commit -m "feat: BONUS//TRACKER initial release with verified scraper and luxury UI"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/your-username/bonus-tracker.git
   git branch -M main
   git push -u origin main
   ```

### Deploying to Vercel:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New... > Project** and import your GitHub repository `bonus-tracker`.
3. In the project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.
5. Once deployment finishes, Vercel will give you a live URL (e.g. `https://bonus-tracker.vercel.app`).
6. **Verify Endpoints**:
   - Web application: `https://your-app.vercel.app`
   - Scraped JSON feed: `https://your-app.vercel.app/bonuses.json`

---

## 4. Daily Automation Notice (Important)

> **Important Notice:** Vercel static hosting **does not** automatically run local Python scripts on a schedule.

To update `bonuses.json` daily in production, configure a **GitHub Actions Cron Workflow**:

Create `.github/workflows/daily-scraper.yml`:
```yaml
name: Daily Bonus Scraper

on:
  schedule:
    - cron: '0 6 * * *' # Runs daily at 06:00 UTC
  workflow_dispatch:      # Allows manual trigger

jobs:
  scrape-and-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Execute Scraper
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SOURCE_URL: "https://www.covers.com/casino/bonuses"
        run: |
          python scraper.py
          python validate_bonuses.py

      - name: Commit and Push Updated bonuses.json
        run: |
          git config user.name "BonusTrackerBot"
          git config user.email "bot@bonustracker.internal"
          git add bonuses.json public/bonuses.json
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore(data): automated daily bonus terms sync [skip ci]" && git push)
```

Whenever the GitHub Action commits the updated `bonuses.json`, Vercel automatically redeploys the fresh data!
