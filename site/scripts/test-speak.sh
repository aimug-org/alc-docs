#!/usr/bin/env bash
# End-to-end check of /speak/, /speak/release/ and /api/speak against fresh local D1 databases: build, apply the
# schema, run `wrangler pages dev dist` three ways, curl each case, print a pass/fail table, stop everything.
#   A: full config, with email going to a local mock of the Resend API (most cases)
#   B: no email configured (emailed = 2, and the concurrency case on a fresh rate-limit budget)
#   C: no IP_SALT (must fail closed)
# Local only: never touches the remote database and never sends real email. The servers run from a scratch copy
# of the site, so a .dev.vars with real secrets is never loaded.
# Usage: bash scripts/test-speak.sh   (PORT=8799 by default; uses PORT to PORT+3)
set -euo pipefail
cd "$(dirname "$0")/.."
SITE=$PWD
command -v jq >/dev/null || { echo "jq is required" >&2; exit 1; }

PORT=${PORT:-8799}
URL="http://127.0.0.1:$PORT" URL_B="http://127.0.0.1:$((PORT + 1))" URL_C="http://127.0.0.1:$((PORT + 2))" MOCK_PORT=$((PORT + 3))
SALT=test-salt
STATE=$(mktemp -d "${TMPDIR:-/tmp}/aimug-speak-test.XXXXXX")
PIDS=()
cleanup() {
  for p in "${PIDS[@]}"; do kill "$p" 2>/dev/null || true; wait "$p" 2>/dev/null || true; done
  rm -rf "$STATE"
}
trap cleanup EXIT

echo "Building..."
npm run build >"$STATE/build.log" 2>&1 || { tail -40 "$STATE/build.log"; echo "Build failed" >&2; exit 1; }

# The site as Pages sees it, minus .dev.vars.
mkdir "$STATE/run" && ln -s "$SITE/dist" "$SITE/functions" "$STATE/run/" && cp wrangler.toml "$STATE/run/"

d1() { local db=$1; shift; wrangler d1 execute aimug-speakers --local --persist-to "$STATE/$db" "$@" 2>/dev/null; }
# --command, not --file: wrangler 4.12 --local --file crashes now and then on Node 26 (FileHandle GC error).
for db in a b; do d1 "$db" --command "$(grep -v '^--' functions/schema.sql)" >/dev/null; done
query() { d1 "${DB:-a}" --json --command "$1" | jq -r '.[0].results[0] | to_entries | map(.value) | @tsv'; }
count() { query "SELECT COUNT(*) FROM submissions WHERE email = '$1'"; }

# A stand-in for the Resend API: logs each request body, answers 500 for any message mentioning fail@example.com.
python3 -c '
import http.server, sys
class H(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        open(sys.argv[2], "ab").write(body + b"\n")
        ok = self.headers.get("Authorization") == "Bearer test-key" and b"fail@example.com" not in body
        self.send_response(200 if ok else 500); self.end_headers(); self.wfile.write(b"{}")
    def log_message(self, *a): pass
http.server.HTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
' "$MOCK_PORT" "$STATE/mail.log" &
PIDS+=($!)

serve() { # name port [wrangler args...]
  local name=$1 port=$2; shift 2
  (cd "$STATE/run" && exec wrangler pages dev dist --port "$port" --inspector-port $((port + 1000)) --persist-to "$STATE/$name" "$@") >"$STATE/$name.log" 2>&1 &
  PIDS+=($!)
}
echo "Starting three wrangler pages dev servers on $PORT to $((PORT + 2))..."
serve a "$PORT" --binding "IP_SALT=$SALT" --binding RESEND_API_KEY=test-key --binding "RESEND_API_URL=http://127.0.0.1:$MOCK_PORT/emails" --binding NOTIFY_TO=organizers@example.com
serve b $((PORT + 1)) --binding "IP_SALT=$SALT"
serve c $((PORT + 2))
for u in "$URL" "$URL_B" "$URL_C"; do
  for _ in $(seq 1 80); do curl -fs -o /dev/null "$u/speak/" && break; sleep 0.5; done
  curl -fs -o /dev/null "$u/speak/" || { tail -20 "$STATE"/*.log; echo "a server did not start" >&2; exit 1; }
done

ms() { echo $(( $(date +%s) * 1000 )); }
VERSION=$(node --input-type=module -e "import { RELEASE_VERSION } from './functions/_lib/release.js'; process.stdout.write(RELEASE_VERSION)")
# A valid pitch; jq merges overrides, e.g. body '{agreed:false}'.
body() {
  local o=${1:-'{}'}
  jq -nc --argjson t "$(( $(ms) - 10000 ))" --arg v "$VERSION" "{
    talk_title: \"Evals for coding agents\", abstract: \"How we test coding agents before they touch production.\",
    format: \"thunderstorm\", preferred_event: \"any\", name: \"Test Speaker\", email: \"test@example.com\",
    signature_name: \"Test Speaker\", agreed: true, minor: false, website: \"\", t: \$t, release_version: \$v
  } + $o"
}
# post BODY [curl args...] -> CODE, RESP, and the response headers in $STATE/h. CT overrides the Content-Type.
post() {
  RESP=$(curl -s -D "$STATE/h" -o - -w '\n%{http_code}' -H "Content-Type: ${CT:-application/json}" "${@:2}" --data-binary "$1" "${BASE:-$URL}/api/speak") || true
  CODE=${RESP##*$'\n'}; RESP=${RESP%$'\n'*}
}
says() { [[ "$(jq -r '.error // empty' <<<"$RESP" 2>/dev/null)" == *"$1"* ]]; } # the error names the right problem
secure() { grep -qi '^x-content-type-options: nosniff' "$STATE/h" && grep -qi '^x-frame-options: deny' "$STATE/h"; }
emailed() { # poll: email runs after the response
  local v
  for _ in $(seq 1 20); do v=$(query "SELECT emailed FROM submissions WHERE id = '$1'"); [ "$v" = "$2" ] && break; sleep 0.25; done
  echo "$v"
}

ROWS=() FAILS=0
record() { # name, expected, actual, ok(0/1)
  local mark=PASS; [ "$4" = 1 ] || { mark=FAIL; FAILS=$((FAILS + 1)); }
  ROWS+=("$(printf '%-44s %-32s %-32s %s' "$1" "$2" "$3" "$mark")")
}

EXPECT_SHA=$(node --input-type=module -e "import { RELEASE_TEXT } from './functions/_lib/release.js'; process.stdout.write(RELEASE_TEXT)" | shasum -a 256 | cut -d' ' -f1)
EXPECT_IP=$(printf '%s' "${SALT}127.0.0.1" | shasum -a 256 | cut -d' ' -f1)
RELEASE_SNIPPET="public-access TV (cable and streaming), without payment"

# 0. The page shows the release text the server hashes, and sends the version it shows.
grep -qF "$RELEASE_SNIPPET" dist/speak/index.html && grep -qF "Draft wording, pending lawyer review" dist/speak/index.html \
  && grep -qF "name=\"release_version\" value=\"$VERSION\"" dist/speak/index.html \
  && record "page: release text, draft label, version" "present" "present" 1 || record "page: release text, draft label, version" "present" "missing" 0

# 1. Valid submit (mixed-case Content-Type, same-origin Origin): 200, the row, both emails, emailed = 1.
CT='Application/JSON; charset=UTF-8' post "$(body '{email:"valid1@example.com", tag_ok:true}')" -H "Origin: $URL"
ID=$(jq -r '.id // empty' <<<"$RESP")
record "valid submit" "200 ok+id" "$CODE ${ID:0:8}" "$([ "$CODE" = 200 ] && [ -n "$ID" ] && echo 1)"
record "  security headers on 200" "nosniff, DENY" "$(secure && echo 'nosniff, DENY' || echo missing)" "$(secure && echo 1)"
IFS=$'\t' read -r SHA VER IPH AGREED TAG STATUS KIND < <(query "SELECT release_sha256, release_version, ip_hash, agreed, tag_ok, status, kind FROM submissions WHERE id = '$ID'") || true
record "  row release_sha256" "${EXPECT_SHA:0:12}" "${SHA:0:12}" "$([ "$SHA" = "$EXPECT_SHA" ] && echo 1)"
record "  row kind/version/agreed/tag_ok/status" "pitch/$VERSION/1/1/new" "$KIND/$VER/$AGREED/$TAG/$STATUS" "$([ "$KIND/$VER/$AGREED/$TAG/$STATUS" = "pitch/$VERSION/1/1/new" ] && echo 1)"
record "  row ip_hash is salted hash, not raw IP" "${EXPECT_IP:0:12}" "${IPH:0:12}" "$([ "$IPH" = "$EXPECT_IP" ] && echo 1)"
E=$(emailed "$ID" 1)
MAIL=$(grep -F 'valid1@example.com' "$STATE/mail.log" || true)
record "  emails sent: speaker + organizers" "emailed=1, 2 messages" "emailed=$E, $(grep -c . <<<"$MAIL") messages" \
  "$([ "$E" = 1 ] && [ "$(grep -c . <<<"$MAIL")" = 2 ] && grep -qF 'organizers@example.com' <<<"$MAIL" && echo 1)"
COPY=$(jq -c 'select(.to == ["valid1@example.com"])' <<<"$MAIL" 2>/dev/null || true)
NOTICE=$(jq -c 'select(.to == ["organizers@example.com"])' <<<"$MAIL" 2>/dev/null || true)
record "  speaker copy: release text, takedown line" "present" "$(jq -r .text <<<"$COPY" | grep -F 'To take a recording down' >/dev/null && grep -qF "$RELEASE_SNIPPET" <<<"$COPY" && echo present || echo missing)" \
  "$(jq -r .text <<<"$COPY" | grep -F 'To take a recording down' >/dev/null && grep -qF "$RELEASE_SNIPPET" <<<"$COPY" && echo 1)"
record "  reply_to: copy -> inbox, notice -> speaker" "speakers@aimug.org, valid1@" "$(jq -r .reply_to <<<"$COPY"), $(jq -r .reply_to <<<"$NOTICE" | cut -d@ -f1)@" \
  "$([ "$(jq -r .reply_to <<<"$COPY")" = speakers@aimug.org ] && [ "$(jq -r .reply_to <<<"$NOTICE")" = valid1@example.com ] && echo 1)"

# 2. No-JS form post: 303 to /speak/thanks/. Its email fails at the mock, the row stays, emailed = 0, --unsent lists it.
LOC=$(curl -s -D "$STATE/h" -o /dev/null -w '%{http_code} %{redirect_url}' \
  --data-urlencode "talk_title=Form post talk" --data-urlencode "abstract=This one came from a browser without JavaScript." \
  --data-urlencode "format=demo" --data-urlencode "preferred_event=2026-11-02" --data-urlencode "name=Form Speaker" \
  --data-urlencode "email=fail@example.com" --data-urlencode "signature_name=Form Speaker" --data-urlencode "agreed=1" \
  --data-urlencode "website=" --data-urlencode "t=$(( $(ms) - 60000 ))" --data-urlencode "release_version=$VERSION" "$URL/api/speak") || true
record "form post (no JS) redirects" "303 /speak/thanks/" "${LOC/$URL/}" "$([[ "$LOC" == "303 $URL/speak/thanks/" ]] && curl -fs -o /dev/null "$URL/speak/thanks/" && [ "$(count fail@example.com)" = 1 ] && echo 1)"
record "  security headers on 303" "nosniff, DENY" "$(secure && echo 'nosniff, DENY' || echo missing)" "$(secure && echo 1)"
FID=$(query "SELECT id FROM submissions WHERE email = 'fail@example.com'")
sleep 1 # let the failed send finish
E=$(query "SELECT emailed FROM submissions WHERE id = '$FID'")
TRIED=$(grep -c 'fail@example.com' "$STATE/mail.log" || true)
record "  email fails: row kept, emailed=0" "rows=1, emailed=0, tried" "rows=$(count fail@example.com), emailed=$E, tried=$TRIED" "$([ "$(count fail@example.com)" = 1 ] && [ "$E" = 0 ] && [ "$TRIED" -ge 1 ] && echo 1)"
UNSENT=$(bash scripts/releases.sh --persist-to "$STATE/a" --unsent 2>/dev/null || true)
record "  releases.sh --unsent lists only it" "fail@ only" "$(grep -o '[a-z0-9]*@example.com' <<<"$UNSENT" | sort -u | tr '\n' ' ')" \
  "$(grep -qF '"fail@example.com"' <<<"$UNSENT" && ! grep -qF 'valid1@example.com' <<<"$UNSENT" && echo 1)"

# 3. Validation.
post "$(body '{email:"noagree@example.com"} | del(.agreed)')"
record "missing agree" "400" "$CODE" "$([ "$CODE" = 400 ] && says 'I agree' && [ "$(count noagree@example.com)" = 0 ] && echo 1)"
record "  security headers on 400" "nosniff, DENY" "$(secure && echo 'nosniff, DENY' || echo missing)" "$(secure && echo 1)"
post "$(body '{email:"minor@example.com", minor:true}')"
record "minor without guardian" "400" "$CODE" "$([ "$CODE" = 400 ] && says guardian && [ "$(count minor@example.com)" = 0 ] && echo 1)"
post "$(body '{email:"proto@example.com", format:"constructor"}')"
record "format=constructor" "400" "$CODE" "$([ "$CODE" = 400 ] && says 'format' && [ "$(count proto@example.com)" = 0 ] && echo 1)"
post "$(body '{email:"feb30@example.com", preferred_event:"2026-02-30"}')"
record "preferred_event 2026-02-30" "400" "$CODE" "$([ "$CODE" = 400 ] && says 'meetup' && [ "$(count feb30@example.com)" = 0 ] && echo 1)"

# 4. Bots and stale pages.
post "$(body '{email:"bot@example.com", website:"http://spam.example"}')"
record "honeypot" "200, no row" "$CODE, rows=$(count bot@example.com)" "$([ "$CODE" = 200 ] && [ "$(count bot@example.com)" = 0 ] && echo 1)"
post "$(body "{email:\"fast@example.com\", t:$(ms)}")"
record "submit faster than 3 s" "400" "$CODE" "$([ "$CODE" = 400 ] && says fast && [ "$(count fast@example.com)" = 0 ] && echo 1)"
post "$(body '{email:"stale@example.com", release_version:"2025-01-old"}')"
record "stale release_version" "409" "$CODE" "$([ "$CODE" = 409 ] && says 'release wording changed' && [ "$(count stale@example.com)" = 0 ] && echo 1)"
post "$(body '{email:"nover@example.com"} | del(.release_version)')"
record "missing release_version" "409" "$CODE" "$([ "$CODE" = 409 ] && [ "$(count nover@example.com)" = 0 ] && echo 1)"

# 5. Transport: other sites, other content types, oversized bodies.
post "$(body '{email:"xsite@example.com"}')" -H 'Origin: https://evil.example'
record "cross-site Origin" "403" "$CODE" "$([ "$CODE" = 403 ] && [ "$(count xsite@example.com)" = 0 ] && echo 1)"
CT=text/plain post "$(body '{email:"plain@example.com"}')"
record "Content-Type text/plain" "415" "$CODE" "$([ "$CODE" = 415 ] && [ "$(count plain@example.com)" = 0 ] && echo 1)"
BIG=$(body "{email:\"big@example.com\", links:\"$(head -c 80000 /dev/zero | tr '\0' 'x')\"}")
post "$BIG"
record "80 KB body (Content-Length)" "413" "$CODE" "$([ "$CODE" = 413 ] && [ "$(count big@example.com)" = 0 ] && echo 1)"
post "$BIG" -H 'Transfer-Encoding: chunked'
record "80 KB body (chunked, no Content-Length)" "413" "$CODE" "$([ "$CODE" = 413 ] && [ "$(count big@example.com)" = 0 ] && echo 1)"

# 6. Release only (kind "release", /speak/release/) for a recorded talk. Title and meetup come from the build's
#    talks.json, never the browser, and no abstract is needed.
TALK=$(jq -r 'keys[0] // empty' dist/speak/talks.json)
TALK_TITLE=$(jq -r --arg k "$TALK" '.[$k].title // empty' dist/speak/talks.json)
TALK_EVENT=$(jq -r --arg k "$TALK" '.[$k].event // empty' dist/speak/talks.json)
release() { body "{kind:\"release\", talk:\"$TALK\", talk_title:\"Spoofed title\", preferred_event:\"any\"} | del(.abstract, .format) + $1"; }
grep -qF "value=\"$TALK\"" dist/speak/release/index.html && grep -qF "$RELEASE_SNIPPET" dist/speak/release/index.html \
  && record "release page lists talks + release text" "present" "present" 1 || record "release page lists talks + release text" "present" "missing" 0
post "$(release '{email:"nosign@example.com", signature_name:""}')"
record "release only, missing signature" "400" "$CODE" "$([ "$CODE" = 400 ] && says 'sign the release' && [ "$(count nosign@example.com)" = 0 ] && echo 1)"
post "$(release '{email:"badtalk@example.com", talk:"not-a-talk"}')"
record "release only, unknown talk" "400" "$CODE" "$([ "$CODE" = 400 ] && says 'Pick the talk' && [ "$(count badtalk@example.com)" = 0 ] && echo 1)"
# A filled honeypot stores nothing but still answers like success, so this checks the no-JS redirect without using up the rate limit.
LOC=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --data-urlencode "kind=release" --data-urlencode "website=x" "$URL/api/speak") || true
record "release form post (no JS) redirects" "303 /speak/release/thanks/" "${LOC/$URL/}" "$([[ "$LOC" == "303 $URL/speak/release/thanks/" ]] && curl -fs -o /dev/null "$URL/speak/release/thanks/" && echo 1)"

# 7. Third stored submit (release only, minor with guardian) is fine; the 4th in 10 minutes from the same IP is not.
post "$(release '{email:"release@example.com", minor:true, guardian_name:"Parent Name"}')" -H "Origin: $URL"
RID=$(jq -r '.id // empty' <<<"$RESP")
IFS=$'\t' read -r KIND RTITLE REVENT ABSTRACT GUARDIAN < <(query "SELECT kind, talk_title, preferred_event, length(abstract), guardian_name FROM submissions WHERE id = '$RID'") || true
record "release only, minor with guardian" "200 ok+id" "$CODE ${RID:0:8}" "$([ "$CODE" = 200 ] && [ -n "$RID" ] && echo 1)"
record "  row kind/meetup/guardian" "release/$TALK_EVENT/Parent Name" "$KIND/$REVENT/$GUARDIAN" "$([ "$KIND/$REVENT/$GUARDIAN" = "release/$TALK_EVENT/Parent Name" ] && [ "$ABSTRACT" = 0 ] && echo 1)"
record "  row talk_title from the build" "${TALK_TITLE:0:24}" "${RTITLE:0:24}" "$([ -n "$TALK_TITLE" ] && [ "$RTITLE" = "$TALK_TITLE" ] && echo 1)"
post "$(body '{email:"valid4@example.com"}')"
record "4th submit in 10 minutes" "429" "$CODE" "$([ "$CODE" = 429 ] && says 'Too many' && [ "$(count valid4@example.com)" = 0 ] && echo 1)"

# 8. Other methods.
CODE=$(curl -s -D "$STATE/h" -o /dev/null -w '%{http_code}' "$URL/api/speak")
record "GET /api/speak" "405" "$CODE" "$([ "$CODE" = 405 ] && echo 1)"
record "  security headers on 405" "nosniff, DENY" "$(secure && echo 'nosniff, DENY' || echo missing)" "$(secure && echo 1)"

# 9. Server B (no email configured): 6 parallel posts from one IP admit exactly 3, all with emailed = 2.
rm -f "$STATE/par"
P=()
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w '%{http_code}\n' -H 'Content-Type: application/json' --data-binary "$(body "{email:\"par$i@example.com\"}")" "$URL_B/api/speak" >>"$STATE/par" &
  P+=($!)
done
wait "${P[@]}"
N=$(DB=b query "SELECT COUNT(*) FROM submissions")
OKS=$(grep -c '^200$' "$STATE/par" || true) LIMITED=$(grep -c '^429$' "$STATE/par" || true)
record "6 parallel posts, one IP (server B)" "3 rows, 3x200, 3x429" "$N rows, ${OKS}x200, ${LIMITED}x429" "$([ "$N" = 3 ] && [ "$OKS" = 3 ] && [ "$LIMITED" = 3 ] && echo 1)"
record "  no email configured: emailed=2" "2" "$(DB=b query "SELECT group_concat(DISTINCT emailed) FROM submissions")" "$([ "$(DB=b query "SELECT group_concat(DISTINCT emailed) FROM submissions")" = 2 ] && echo 1)"

# 10. Server C (no IP_SALT): fails closed.
BASE=$URL_C post "$(body '{email:"nosalt@example.com"}')"
record "no IP_SALT (server C)" "500 Not configured" "$CODE $(jq -r '.error // empty' <<<"$RESP")" "$([ "$CODE" = 500 ] && says 'Not configured' && echo 1)"

# 11. releases.sh keeps arguments out of SQL.
bash scripts/releases.sh --persist-to "$STATE/a" --name "x'; DROP TABLE submissions; --" >/dev/null 2>&1 && CODE=0 || CODE=$?
record "releases.sh rejects a quote in --name" "exit 2" "exit $CODE" "$([ "$CODE" = 2 ] && echo 1)"

# 12. Release gate: an upcoming event can't list a speaker who has no release on file. Past events don't count.
printf -- '- id: has-release\n  release: abc\n- id: no-release\n' >"$STATE/speakers.yaml"
gate() { # lineup for a future event; a past event always lists no-release
  printf -- '- id: "2099-01-05"\n  start: 2099-01-05T18:00:00-06:00\n  end: 2099-01-05T20:00:00-06:00\n  lineup: [%s]\n- id: "2020-01-06"\n  start: 2020-01-06T18:00:00-06:00\n  end: 2020-01-06T20:00:00-06:00\n  lineup: [no-release]\n' "$1" >"$STATE/events.yaml"
  GATE_OUT=$(node scripts/check-releases.mjs "$STATE/events.yaml" "$STATE/speakers.yaml" 2>&1) && CODE=0 || CODE=$?
}
gate has-release
record "release gate, all lineup released" "exit 0" "exit $CODE" "$([ "$CODE" = 0 ] && echo 1)"
gate "has-release, no-release"
record "release gate, lineup speaker unreleased" "exit 1" "exit $CODE" "$([ "$CODE" = 1 ] && [[ "$GATE_OUT" == *"2099-01-05: no-release"* ]] && echo 1)"

printf '\n%-44s %-32s %-32s %s\n' CASE EXPECTED ACTUAL RESULT
printf '%s\n' "${ROWS[@]}"
echo
if [ "$FAILS" = 0 ]; then echo "All ${#ROWS[@]} checks passed."; else echo "$FAILS of ${#ROWS[@]} checks failed. Server logs:"; tail -n 15 "$STATE"/a.log "$STATE"/b.log "$STATE"/c.log; exit 1; fi
