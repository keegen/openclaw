#!/usr/bin/env node
/**
 * If TELEGRAM_OWNER_USER_ID is set, merge Telegram DM allowlist into state openclaw.json
 * so you do not need Render Shell to approve pairing (browser shell is often flaky).
 */
import fs from "node:fs";
import path from "node:path";

const stateDir = process.env.OPENCLAW_STATE_DIR?.trim();
const rawId = process.env.TELEGRAM_OWNER_USER_ID?.trim();
if (!stateDir || !rawId) {
  process.exit(0);
}

const configPath = path.join(stateDir, "openclaw.json");
if (!fs.existsSync(configPath)) {
  process.exit(0);
}

const allowEntry = /^\d+$/.test(rawId) ? Number(rawId) : rawId;
let cfg;
try {
  cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
} catch {
  process.stderr.write(`render-merge-telegram-owner: invalid JSON at ${configPath}\n`);
  process.exit(1);
}

cfg.channels = cfg.channels ?? {};
cfg.channels.telegram = cfg.channels.telegram ?? {};
cfg.channels.telegram.dmPolicy = "allowlist";
cfg.channels.telegram.allowFrom = [allowEntry];

fs.writeFileSync(configPath, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
process.stdout.write(
  `render-merge-telegram-owner: set channels.telegram dmPolicy=allowlist allowFrom=[${allowEntry}]\n`,
);
