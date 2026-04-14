#!/bin/sh
set -e

DATA_PATH="${DATA_DIR:-./data}"

mkdir -p "$DATA_PATH"
chown -R meting:meting "$DATA_PATH" 2>/dev/null || true

exec su-exec meting "$@"
