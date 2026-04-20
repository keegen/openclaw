# Heartbeat — main assistant

Periodic checks for your default agent. Alerts go to Telegram when something needs attention; otherwise reply `HEARTBEAT_OK`.

tasks:
  - name: follow-up-scan
    interval: 1h
    prompt: "Check if anything from recent conversations needs a follow-up, reminder, or next step. Surface only items that are actionable now."

  - name: daily-priorities
    interval: 6h
    prompt: "Review my priorities (USER.md) and gently check in: am I on track today? If you have a concrete suggestion or nudge, share it. Keep it to 2-3 sentences."

  - name: golf-prep
    interval: 12h
    prompt: "If there is an upcoming tournament, practice session, or golf-related deadline within the next few days, surface a short reminder or prep note. Otherwise skip."

## General instructions

- Keep alerts short: 1–4 sentences max. No essays.
- If nothing needs attention after all due tasks, reply `HEARTBEAT_OK`.
- Do not rehash old conversations or invent tasks.
- Tone: warm, encouraging, practical — match `SOUL.md`.
