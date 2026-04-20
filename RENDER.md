# Render deployment notes

This fork ships a default OpenClaw config and workspace templates that are **copied once** into the persistent disk (`OPENCLAW_STATE_DIR`, `OPENCLAW_WORKSPACE_DIR`) on first container start. See `scripts/render-entrypoint.sh`.

## Required environment variables (Dashboard)

| Variable | Purpose |
| -------- | ------- |
| `OPENAI_API_KEY` | Model provider for `openai/*` models (set in Render → Environment). |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token from [@BotFather](https://t.me/BotFather). |
| `OPENCLAW_GATEWAY_TOKEN` | Control UI / WebSocket auth (Blueprint can `generateValue: true`). |

## Optional environment variables

| Variable | Purpose |
| -------- | ------- |
| `BRAVE_API_KEY` | Better web search via Brave Search API ([Brave Search API](https://brave.com/search/api/)). |
| `PERPLEXITY_API_KEY` | Alternative search/research backend. |
| `FIRECRAWL_API_KEY` | Web fetch / crawl via Firecrawl. |

## Telegram access

- **Default:** `channels.telegram.dmPolicy` is `pairing` in `deploy/openclaw.json`. DM the bot, then in Render **Shell** run `openclaw pairing list telegram` and `openclaw pairing approve telegram <CODE>`.
- **If the bot “reads” messages but never answers:** check **Logs** for model or provider errors. The Docker image must include the **`openai`** bundled extension (see `Dockerfile` `OPENCLAW_EXTENSIONS`) so `openai/gpt-5.4` can run; also confirm `OPENAI_API_KEY` is set in the dashboard.
- **Pairing:** until you approve a pairing code, the assistant will not run a full reply for DMs (you should still receive a short pairing message with a code when pairing is working).
- **Skip pairing (single owner):** edit `/data/.openclaw/openclaw.json` on the disk (or edit `deploy/openclaw.json` in git and redeploy after removing the existing file on disk) to set `dmPolicy` to `allowlist` and add your numeric Telegram user ID to `allowFrom`. Empty `allowFrom` with `allowlist` is invalid.

## Changing models or tools

- Edit `deploy/openclaw.json` in this repo, commit, and redeploy. **Note:** the entrypoint only copies `openclaw.json` when the file is **missing** on the persistent disk. To pick up a new template from git, remove or replace `/data/.openclaw/openclaw.json` in the Render Shell (back it up first if needed).
- Same idea for workspace bootstrap files under `workspace/`: only missing files are copied from the image into `/data/workspace`.

## Heartbeat

Heartbeat is disabled by default (`agents.defaults.heartbeat.every: "0m"`) to avoid surprise token usage. Enable it in config when you are ready; see [Gateway configuration reference](https://docs.openclaw.ai/gateway/configuration-reference#agentsdefaultsheartbeat).
