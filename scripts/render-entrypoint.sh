#!/usr/bin/env bash
# Seed persistent disk on Render (/data) with default config and workspace files
# on first boot only, then start the gateway.
set -euo pipefail

STATE_DIR="${OPENCLAW_STATE_DIR:-/data/.openclaw}"
WORKSPACE_DIR="${OPENCLAW_WORKSPACE_DIR:-/data/workspace}"
# Gateway reads OPENCLAW_STATE_DIR; without export, seeds go to /data but the
# process still defaults to ~/.openclaw (breaks health checks and Control UI).
export OPENCLAW_STATE_DIR="${STATE_DIR}"
export OPENCLAW_WORKSPACE_DIR="${WORKSPACE_DIR}"

# Render's HTTP proxy targets $PORT (web services default 10000). Listening on a
# different port fails health checks ("no open ports detected").
if [[ "${RENDER:-}" == "true" ]]; then
  export OPENCLAW_GATEWAY_PORT="${PORT:-10000}"
fi

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

# Optional: skip Telegram pairing when Render Shell is unavailable — set
# TELEGRAM_OWNER_USER_ID in the dashboard (numeric id from @userinfobot).
node /app/scripts/render-merge-telegram-owner.mjs
node /app/scripts/render-ensure-control-ui-origins.mjs

exec node /app/openclaw.mjs gateway --allow-unconfigured --bind lan
