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
| `TELEGRAM_OWNER_USER_ID` | Your numeric Telegram user id; entrypoint sets DM `allowlist` so you can skip Shell pairing (see below). |

## Telegram access (no Render Shell required)

If the Render web **Shell** disconnects before you can run commands, use this instead:

1. In Telegram, DM **[@userinfobot](https://t.me/userinfobot)** (or **[@getidsbot](https://t.me/getidsbot)**) and copy your **numeric user id** (digits only).
2. In Render → **Environment**, add **`TELEGRAM_OWNER_USER_ID`** with that value (plain digits, no quotes).
3. **Save** — Render will redeploy. On each start, `scripts/render-entrypoint.sh` merges that id into `/data/.openclaw/openclaw.json` as `channels.telegram.dmPolicy: "allowlist"` and `allowFrom: [<your id>]`, so your DMs are authorized without pairing CLI.

**Security:** anyone who knows your numeric Telegram id could theoretically impersonate that id in config; keep your Render project private and rotate the bot token if leaked.

### Optional: Shell / pairing (when Shell works)

- **Pairing:** `openclaw pairing list telegram` then `openclaw pairing approve telegram <CODE>`.
- **If the bot “reads” messages but never answers:** check **Logs** for model or provider errors. The Docker image must include the **`openai`** bundled extension (see `Dockerfile` `OPENCLAW_EXTENSIONS`) so `openai/gpt-5.4` can run; also confirm `OPENAI_API_KEY` is set in the dashboard.
- With **`dmPolicy: "pairing"`** (and no `TELEGRAM_OWNER_USER_ID`), DMs stay blocked until you approve a code; pairing messages can fail to appear if Telegram delivery errors occur—prefer **`TELEGRAM_OWNER_USER_ID`** for a one-owner bot.

## Changing models or tools

- Edit `deploy/openclaw.json` in this repo, commit, and redeploy. **Note:** the entrypoint only copies `openclaw.json` when the file is **missing** on the persistent disk. To pick up a new template from git, remove or replace `/data/.openclaw/openclaw.json` in the Render Shell (back it up first if needed).
- Same idea for workspace bootstrap files under `workspace/`: only missing files are copied from the image into `/data/workspace`.

## Heartbeat

Heartbeat is disabled by default (`agents.defaults.heartbeat.every: "0m"`) to avoid surprise token usage. Enable it in config when you are ready; see [Gateway configuration reference](https://docs.openclaw.ai/gateway/configuration-reference#agentsdefaultsheartbeat).
