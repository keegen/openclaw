---
name: composio
description: Use Composio MCP tools for connected apps (Google Calendar, Gmail, Slack, etc.). Use when the user asks to read or change data in a third-party service that is wired through Composio, or when calendar/email tasks should go through Composio instead of ad-hoc APIs.
---

# Composio MCP (OpenClaw)

## Preconditions

- The gateway config defines **`mcp.servers.composio`** (HTTP MCP) and **`COMPOSIO_API_KEY`** is set in the environment so `${COMPOSIO_API_KEY}` resolves at config load.
- The user must complete **OAuth / kit connection** for each toolkit (e.g. Google Calendar) in the **Composio dashboard** for the same Composio project as the API key. Without that, tool calls fail with auth errors.

## How to work

1. Prefer **read** operations first (list calendars, list events in a window) before creating or updating.
2. Use the **materialized tool names** exposed in the session (often prefixed with the server id, e.g. `composio_*`). Do not invent tool names.
3. For **time ranges**, honor **`agents.defaults.userTimezone`** in config when the user does not specify a zone; state the zone in replies when ambiguity matters.
4. If tools are missing or calls fail with 401/403, tell the user to open Composio, confirm the **Google Calendar** (or other) integration is connected, then retry—do not ask them to paste API keys into chat.

## Safety

- Do not paste Composio keys, OAuth tokens, or refresh tokens into messages or workspace files.
- For destructive actions (delete event, send email), confirm intent in one short question when the user was vague.
