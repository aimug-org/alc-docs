#!/usr/bin/env bash
# Runs check-data.mjs against fixture sites: one that passes, then one per failure rule.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

# fixture <name> <events.yaml body>: a site with speaker "ann", a recap post and a docs folder.
fixture() {
  local d="$tmp/$1"
  mkdir -p "$d/src/data" "$d/src/content/talks" "$d/src/content/blog/2026-01-01-recap" "$d/src/content/docs/jan-2026"
  printf -- '- id: ann\n  name: Ann\n' > "$d/src/data/speakers.yaml"
  printf -- '---\ntitle: Recap\n---\n' > "$d/src/content/blog/2026-01-01-recap/index.md"
  printf '%s\n' "$2" > "$d/src/data/events.yaml"
  echo '{"speakers":["ann"],"event":"2026-01-05"}' > "$d/src/content/talks/ok.json"
}
ev='- id: "2026-01-05"
  start: 2026-01-05T18:00:00-06:00
  end: 2026-01-05T20:00:00-06:00
  lineup: [ann]
  recap: /blog/2026/01/01/recap/
  docs: /docs/jan-2026/'

expect() { # expect <pass|fail> <name> <message fragment>
  local out rc=0
  out="$(node "$here/check-data.mjs" "$tmp/$2" 2>&1)" || rc=$?
  if [[ $1 == pass && $rc -ne 0 ]] || [[ $1 == fail && ( $rc -eq 0 || $out != *"$3"* ) ]]; then
    echo "FAIL $2: $out"; exit 1
  fi
  echo "ok   $2"
}

fixture pass "$ev";                                                    expect pass pass
fixture end "${ev/T20:00/T17:00}";                                     expect fail end "is not after start"
fixture lineup "${ev/\[ann\]/[ann, bob]}";                             expect fail lineup 'lineup speaker "bob"'
fixture talkspk "$ev"; echo '{"speakers":["zed"]}' > "$tmp/talkspk/src/content/talks/x.json"; expect fail talkspk 'speaker "zed"'
fixture talkevt "$ev"; echo '{"event":"2030-01-01"}' > "$tmp/talkevt/src/content/talks/x.json"; expect fail talkevt 'event "2030-01-01"'
fixture recap "${ev/2026\/01\/01\/recap/nope}";                       expect fail recap "recap /blog/nope/"
fixture docs "${ev/jan-2026/nope}";                                    expect fail docs "has no folder"
echo "all check-data tests passed"
