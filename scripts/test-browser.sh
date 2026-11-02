#!/usr/bin/env bash
# Runs the Playwright browser tests against a disposable, seeded Listory database.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=18476
ENGINE=podman
command -v podman >/dev/null 2>&1 || ENGINE=docker
NAME="listory-browser-test-$$"
cleanup() {
    "$ENGINE" rm -f "$NAME" >/dev/null 2>&1 || true
    "$ENGINE" network rm "$NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT
# Builds the PHP image on first run, as dev.sh does.
"$REPO/scripts/php.sh" php -v >/dev/null
"$ENGINE" network create "$NAME" >/dev/null
"$ENGINE" run -d --name "$NAME" --network "$NAME" --network-alias backend \
    -v "$REPO:/work/listory:z" -w /work/listory/server \
    -e LISTORY_DB=/tmp/listory-browser.sqlite -e LISTORY_ORIGIN="http://backend:$PORT" \
    listory-php:8.3-rust sh -c "php standalone/tests/browser-fixture.php && exec php -S 0.0.0.0:$PORT standalone/public/router.php" >/dev/null
"$ENGINE" run --rm --network "$NAME" \
    -v "$REPO:/work/listory:z" -w /work/listory/client \
    -e LISTORY_TEST_URL="http://backend:$PORT" \
    mcr.microsoft.com/playwright:v1.58.2-noble \
    npx playwright test -c playwright.config.ts "$@"
