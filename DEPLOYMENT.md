# BONUS//TRACKER — Production Scaling Plan: 200 Casinos with Daily Updates

This document outlines the technical blueprint and operational roadmap to scale BONUS//TRACKER from 3 casinos to **200 licensed online casinos** across multiple jurisdictions (UK, US, Canada, EU) with daily autonomous synchronization.

---

## 1. Architectural Blueprint: 200-Casino Pipeline

```
                                 ┌─────────────────────────┐
                                 │   Daily Cron Scheduler  │
                                 │   (Airflow / Temporal)  │
                                 └────────────┬────────────┘
                                              │ triggers
                                              ▼
                                 ┌─────────────────────────┐
                                 │  Source Crawler Pool    │
                                 │  - 200 Domain Registry  │
                                 │  - Robots.txt Enforcer  │
                                 │  - Rate Limiter (2 req/s)│
                                 └────────────┬────────────┘
                                              │ raw HTML
                                              ▼
                                 ┌─────────────────────────┐
                                 │  DOM Pre-Filter & Cache │
                                 │  - Strip boilerplate/ads│
                                 │  - SHA-256 Hash Compare │
                                 └────────────┬────────────┘
                         (If content changed) │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Claude Batch API        │
                                 │ - claude-3-5-sonnet     │
                                 │ - 50% discount batching │
                                 │ - Strict JSON Schema    │
                                 └────────────┬────────────┘
                                              │ parsed entities
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Invariant Validator     │
                                 │ - Wagering multipliers  │
                                 │ - Mandatory quotes      │
                                 │ - Null checks           │
                                 └─────┬─────────────┬─────┘
                     (Pass)            │             │ (Fail)
                        ┌──────────────┘             └─────────────┐
                        ▼                                          ▼
         ┌───────────────────────────────┐          ┌───────────────────────────┐
         │ PostgreSQL Database           │          │ Dead-Letter Queue (DLQ)   │
         │ - Append-only audit history   │          │ & Slack Alerting Engine   │
         │ - Trigger terms change alerts │          └───────────────────────────┘
         └──────────────┬────────────────┘
                        │
                        ▼
         ┌───────────────────────────────┐
         │ Edge CDN (Vercel / Cloudflare)│
         │ - Static /bonuses.json cache  │
         │ - Fast globe-wide distribution│
         └───────────────────────────────┘
```

---

## 2. Source Discovery & Robots.txt Governance

Scaling to 200 casinos requires accessing primary regulatory registers and authorized partner feeds:
1. **Jurisdiction Verification**:
   - UK: UKGC Public Register of Licensed Operators
   - US: State Gaming Control Boards (NJ DGE, PA PGCB, MGCB)
   - Canada: iGaming Ontario (iGO)
2. **Robots.txt & Fair Crawling Rules**:
   - Maintain an automated `urllib.robotparser` pool that caches `robots.txt` per domain with 24-hour TTL.
   - Enforce minimum delay of 1.5 seconds between requests per host.
   - Never bypass authentication, CAPTCHAs, or IP bans.
   - If a source blocks bots, flag the record in the registry and route to manual review or authorized API partners.

---

## 3. Cost Optimization: Anthropic Claude Batch API

Running 200 HTML pages through standard Claude API daily would cost ~$6.00/day ($180/month).
By using the **Claude Messages Batch API**:
- **50% Cost Reduction**: Batch endpoints receive 50% price discount.
- **SHA-256 Change Detection**: Only send HTML to Claude if the content hash changed since yesterday. On average, only 15–20% of casino bonuses change monthly.
- **Cost Reduction Result**: Under $15.00/month for 200 casinos with daily checks.

### Batch Request Implementation:
```python
import anthropic

client = anthropic.Anthropic()

# Create batch of changed casinos
requests = [
    {
        "custom_id": f"casino-{c['id']}",
        "params": {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1000,
            "messages": [
                {"role": "user", "content": f"Extract terms schema from {c['clean_html']}"}
            ]
        }
    }
    for c in changed_casinos
]

batch = client.messages.batches.create(requests=requests)
print(f"Batch dispatched: {batch.id}")
```

---

## 4. Invariant Validation & Dead-Letter Queue (DLQ)

When ingesting 200 records, machine learning outputs must be defended by deterministic barriers:
1. **Multipliers must be non-negative integers** (`wagering_multiplier >= 0`).
2. **Deposit must match regex** (`^\$[0-9]+(\.[0-9]{2})?$`).
3. **Evidence quotes must be found as substrings in source HTML** (zero hallucination tolerance).
4. If a record fails validation:
   - Quarantine into `failed_extractions` table in PostgreSQL.
   - Dispatch an urgent webhook alert to `#casino-compliance` in Slack/Discord.
   - Retain previous day's verified record on the public frontend so users never see broken cards.

---

## 5. Database Schema & Migration from Flat JSON

At 200 records with historical audit logs, migrate from flat `bonuses.json` to PostgreSQL:

```sql
CREATE TABLE casinos (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'active'
);

CREATE TABLE bonus_terms (
    id SERIAL PRIMARY KEY,
    casino_id VARCHAR(64) REFERENCES casinos(id),
    welcome_bonus TEXT NOT NULL,
    wagering_requirement TEXT NOT NULL,
    wagering_multiplier INT NOT NULL,
    minimum_deposit TEXT NOT NULL,
    promo_code VARCHAR(64),
    source_url TEXT NOT NULL,
    evidence_quotes JSONB NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_current BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_current_bonuses ON bonus_terms (is_current, wagering_multiplier);
```

An automated build step exports the top 200 verified records to static `/bonuses.json` at build time to preserve instantaneous sub-100ms client load performance.

---

## 6. Real-Time Terms Change Detection & Notification

When a casino modifies its playthrough terms (e.g. BetMGM increases rollover from 15x to 25x):
1. The pipeline identifies the diff:
   ```json
   {
     "casino": "BetMGM Casino",
     "field": "wagering_multiplier",
     "old_value": 15,
     "new_value": 25,
     "severity": "CRITICAL_INCREASE"
   }
   ```
2. Broadcast to user alerts feed:
   - "Alert: BetMGM rollover increased from 15x to 25x. Effective playthrough obligation on $1,000 deposit rose by $10,000."
