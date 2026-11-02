#!/usr/bin/env bash
# Runs check-releases.mjs against fixture files: a lineup entry as an object, an unreleased speaker, and
# releasePending (Colin's per-talk exception: listed with a warning, never a release for publishing).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
printf -- '- id: ann\n  release: r1\n- id: bob\n' > "$tmp/speakers.yaml"

expect() { # expect <exit code> <name> <lineup> [output fragment]
  printf -- '- id: "2099-01-05"\n  start: 2099-01-05T18:00:00-06:00\n  end: 2099-01-05T20:00:00-06:00\n  lineup: %s\n' "$3" > "$tmp/events.yaml"
  local out rc=0
  out="$(node "$here/check-releases.mjs" "$tmp/events.yaml" "$tmp/speakers.yaml" 2>&1)" || rc=$?
  if [[ $rc -ne $1 || ( -n "${4:-}" && $out != *"$4"* ) ]]; then echo "FAIL $2 (exit $rc): $out"; exit 1; fi
  echo "ok   $2"
}

expect 0 released  '[{ speaker: ann, title: T }]'
expect 1 unreleased '[{ speaker: bob, title: T }]' '2099-01-05: bob'
expect 0 pending   '[{ speaker: bob, title: T, releasePending: true }]' 'release pending: 2099-01-05: bob'
echo "all check-releases tests passed"
