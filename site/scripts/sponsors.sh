#!/usr/bin/env bash
# List sponsorship inquiries from the /support/ form (aimug-speakers D1, table sponsor_inquiries), newest first.
# Usage: scripts/sponsors.sh [--local | --persist-to DIR] [--all | --unsent]
#   default   inquiries still marked new
#   --all     every inquiry
#   --unsent  inquiries whose emails never went out (emailed = 0), to follow up by hand
#   --local   query the local dev database instead of the remote one; --persist-to DIR uses a local copy kept in DIR
set -euo pipefail
cd "$(dirname "$0")/.."

db=(--remote) where="status = 'new'"
while [ $# -gt 0 ]; do
  case "$1" in
    --local) db=(--local); shift ;;
    --persist-to) [ -d "${2:-}" ] || { echo "--persist-to: not a directory" >&2; exit 2; }; db=(--local --persist-to "$2"); shift 2 ;;
    --all) where="1 = 1"; shift ;;
    --unsent) where="emailed = 0"; shift ;;
    *) sed -n '3,7p' "$0" | sed 's/^# \{0,1\}//' >&2; exit 2 ;;
  esac
done

wrangler d1 execute aimug-speakers "${db[@]}" --command "SELECT created_at, sponsor_as, interest, name, email, company, budget, status, emailed, id, message
  FROM sponsor_inquiries WHERE $where ORDER BY created_at DESC"
