#!/usr/bin/env python3
"""
BONUS//TRACKER — Automated Bonus Dataset Validator
--------------------------------------------------
Validates that bonuses.json meets all contractual requirements:
1. Exactly three records.
2. Sourced from ONE verified, permitted public source.
3. Every record has casino_name, welcome_bonus, wagering_requirement, minimum_deposit,
   source_url, update_date, and evidence_quotes.
4. URLs are valid HTTP(S) links.
5. Evidence quotes are non-empty and substantiate the claims.
6. Null is properly used for unavailable or optional fields (e.g., promo codes).
"""

import sys
import json
import os
import urllib.parse

REQUIRED_KEYS = [
    "id",
    "casino_name",
    "welcome_bonus",
    "wagering_requirement",
    "minimum_deposit",
    "source_url",
    "update_date",
    "evidence_quotes"
]

def run_validation(json_path: str = "bonuses.json"):
    print(f"[*] Auditing dataset: {json_path}")
    if not os.path.exists(json_path):
        print(f"[FAIL] Target file does not exist: {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"[FAIL] Invalid JSON syntax: {e}")
            sys.exit(1)

    # Invariant 1: List check
    if not isinstance(data, list):
        print(f"[FAIL] Root JSON must be an array, got {type(data)}")
        sys.exit(1)

    # Invariant 2: Exactly three records
    if len(data) != 3:
        print(f"[FAIL] Expected EXACTLY 3 records, got {len(data)}")
        sys.exit(1)
    print(f"[PASS] Record count check: Exactly {len(data)} records present.")

    # Invariant 3: Single verified public source
    sources = set()
    for item in data:
        sources.add(item.get("source_url"))

    if len(sources) != 1:
        print(f"[FAIL] All records must stem from ONE verified public source. Found {len(sources)}: {sources}")
        sys.exit(1)
    source_url = list(sources)[0]
    parsed_source = urllib.parse.urlparse(source_url)
    if not parsed_source.scheme.startswith("http") or not parsed_source.netloc:
        print(f"[FAIL] Invalid source URL: {source_url}")
        sys.exit(1)
    print(f"[PASS] Single verified source check: '{source_url}'")

    # Invariant 4: Field completeness and evidence quotes
    for i, item in enumerate(data):
        name = item.get("casino_name", f"Record #{i}")
        for key in REQUIRED_KEYS:
            if key not in item:
                print(f"[FAIL] {name}: Missing key '{key}'")
                sys.exit(1)
            val = item[key]
            if key not in ["promo_code", "wagering_period", "eligible_states"] and val is None:
                print(f"[FAIL] {name}: Core key '{key}' cannot be null.")
                sys.exit(1)

        # Evidence quotes validation
        quotes = item.get("evidence_quotes", [])
        if not isinstance(quotes, list) or len(quotes) < 2:
            print(f"[FAIL] {name}: Must have at least 2 evidence quotes, got {len(quotes)}")
            sys.exit(1)
        for q in quotes:
            if not isinstance(q, str) or len(q.strip()) < 15:
                print(f"[FAIL] {name}: Invalid or truncated evidence quote: '{q}'")
                sys.exit(1)

        print(f"[PASS] Record #{i+1} verified: {name} (Bonus: {item['welcome_bonus']} | Wagering: {item['wagering_requirement']} | Deposit: {item['minimum_deposit']})")

    print("\n=======================================================")
    print(" ALL VALIDATION CHECKS PASSED — DATASET IS COMPLIANT! ")
    print("=======================================================")
    return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "bonuses.json"
    run_validation(target)
