#!/usr/bin/env bash
# Local SQLite application, using the PHP development image.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMMAND="${1:-serve}"
[ "$#" -eq 0 ] || shift
mkdir -p "$REPO/.standalone/sessions"
chmod 700 "$REPO/.standalone" "$REPO/.standalone/sessions"
ENGINE=podman
command -v podman >/dev/null 2>&1 || ENGINE=docker
# Run as the host user so the SQLite file and sessions are not owned by root.
# Rootless podman already maps the host user, so this is docker-only, as in php.sh.
USER_ARGS=()
if [ "$ENGINE" = docker ]; then
    USER_ARGS=(--user "$(id -u):$(id -g)")
fi
# Ensure the development image exists for both CLI and server commands.
"$REPO/scripts/php.sh" php -v >/dev/null
if [ "$COMMAND" != serve ]; then
    exec "$ENGINE" run --rm -i "${USER_ARGS[@]}" -v "$REPO:/work/listory:z" -w /work/listory/server \
        -e LISTORY_DB=/work/listory/.standalone/listory.sqlite \
        listory-php:8.3-rust php standalone/cli.php "$COMMAND" "$@"
fi
exec "$ENGINE" run --rm -p "127.0.0.1:${LISTORY_DEV_PORT:-18474}:8080" \
    "${USER_ARGS[@]}" -v "$REPO:/work/listory:z" -w /work/listory/server \
    -e LISTORY_DB=/work/listory/.standalone/listory.sqlite \
    -e LISTORY_SESSION_PATH=/work/listory/.standalone/sessions \
    -e LISTORY_ORIGIN="http://localhost:${LISTORY_DEV_PORT:-18474}" \
    listory-php:8.3-rust php -S 0.0.0.0:8080 standalone/public/router.php
