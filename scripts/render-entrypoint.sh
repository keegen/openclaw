#!/usr/bin/env bash
# Seed persistent disk on Render (/data) with default config and workspace files
# on first boot only, then start the gateway.
set -euo pipefail

STATE_DIR="${OPENCLAW_STATE_DIR:-/data/.openclaw}"
WORKSPACE_DIR="${OPENCLAW_WORKSPACE_DIR:-/data/workspace}"

mkdir -p "${STATE_DIR}" "${WORKSPACE_DIR}"

if [[ ! -f "${STATE_DIR}/openclaw.json" ]]; then
  cp /app/deploy/openclaw.json "${STATE_DIR}/openclaw.json"
fi

if [[ -d /app/deploy/workspace ]]; then
  for f in /app/deploy/workspace/*; do
    [[ -e "$f" ]] || continue
    base="$(basename "$f")"
    dst="${WORKSPACE_DIR}/${base}"
    if [[ ! -e "$dst" ]]; then
      cp -a "$f" "$dst"
    fi
  done
fi

exec node /app/openclaw.mjs gateway --allow-unconfigured --bind lan
