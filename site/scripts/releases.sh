#!/usr/bin/env bash
# Look up signed speaker releases in the aimug-speakers D1 database.
# Usage: scripts/releases.sh [--local | --persist-to DIR] --name "Jane Doe" | --email jane@example.com | --event 2026-11-02 | --unsent
#   --name   matches part of the speaker's name or typed signature (letters, spaces, . and - only)
#   --email  exact email, any case
#   --event  meetup date (YYYY-MM-DD): the preferred one for a pitch, the one given at for a release only; or "any"
#   --unsent rows whose confirmation email never went out (emailed = 0), to send by hand
#   --local  query the local dev database instead of the remote one; --persist-to DIR uses a local copy kept in DIR
# wrangler d1 execute can't bind parameters, so every argument must match a strict pattern before it reaches SQL.
set -euo pipefail
cd "$(dirname "$0")/.."

usage() { sed -n '3,8p' "$0" | sed 's/^# \{0,1\}//' >&2; exit 2; }
db=(--remote) where=
name_re='^[[:alpha:]][[:alpha:] .-]{0,79}$'
email_re='^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$'
event_re='^([0-9]{4}-[0-9]{2}-[0-9]{2}|any)$'

while [ $# -gt 0 ]; do
  case "$1" in
    --local) db=(--local); shift ;;
    --persist-to) [ -d "${2:-}" ] || { echo "--persist-to: not a directory" >&2; exit 2; }; db=(--local --persist-to "$2"); shift 2 ;;
    --unsent) where="emailed = 0"; shift ;;
    --name)
      [[ "${2:-}" =~ $name_re ]] || { echo "--name: letters, spaces, . and - only" >&2; exit 2; }
      where="name LIKE '%$2%' OR signature_name LIKE '%$2%'"; shift 2 ;;
    --email)
      [[ "${2:-}" =~ $email_re ]] || { echo "--email: not a plain email address" >&2; exit 2; }
      where="lower(email) = lower('$2')"; shift 2 ;;
    --event)
      [[ "${2:-}" =~ $event_re ]] || { echo "--event: YYYY-MM-DD or any" >&2; exit 2; }
      where="preferred_event = '$2'"; shift 2 ;;
    *) usage ;;
  esac
done
[ -n "$where" ] || usage

wrangler d1 execute aimug-speakers "${db[@]}" --command "SELECT id, created_at, kind, name, email, talk_title, preferred_event, status, emailed,
  signature_name, minor, guardian_name, release_version, release_sha256 FROM submissions WHERE $where ORDER BY created_at DESC"
