#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
BASE_URL="${CRAWL_BASE_URL:-http://localhost:3000}"
DB=".data/dev-db.sqlite"
BATCH="${CRAWL_DETAIL_BATCH:-50}"
PAUSE="${CRAWL_DETAIL_PAUSE_SEC:-120}"
COOLDOWN="${CRAWL_DETAIL_COOLDOWN_SEC:-180}"

remaining() {
  sqlite3 "$DB" "SELECT COUNT(*) FROM tenders WHERE source='zakazky-gov' AND detail_fetched_at IS NULL;"
}

echo "Full detail ingestion → $BASE_URL (batch=$BATCH, pause=${PAUSE}s, cooldown=${COOLDOWN}s)"
echo "Waiting ${COOLDOWN}s for API rate limit cooldown..."
sleep "$COOLDOWN"

round=1
while true; do
  left=$(remaining)
  if [ "$left" -eq 0 ]; then
    echo "Done — all tenders have detail."
    break
  fi

  echo "--- Round $round: $left remaining ---"
  result=$(curl -s --max-time 7200 -X POST "$BASE_URL/api/crawl/zakazky-gov/detail?limit=$BATCH")
  echo "$result"

  processed=$(echo "$result" | sed -n 's/.*"tendersFound":\([0-9]*\).*/\1/p')
  if [ -z "$processed" ] || [ "$processed" -eq 0 ]; then
    echo "No progress this round; waiting ${PAUSE}s before retry..."
  fi

  left=$(remaining)
  if [ "$left" -eq 0 ]; then
    echo "Done — all tenders have detail."
    break
  fi

  echo "Still $left remaining; pausing ${PAUSE}s..."
  sleep "$PAUSE"
  round=$((round + 1))
done

sqlite3 "$DB" <<'SQL'
SELECT
  (SELECT COUNT(*) FROM tenders WHERE source='zakazky-gov') AS total,
  (SELECT COUNT(*) FROM tenders WHERE source='zakazky-gov' AND detail_fetched_at IS NOT NULL) AS detail_fetched,
  (SELECT COUNT(*) FROM tender_documents) AS documents;
SQL
