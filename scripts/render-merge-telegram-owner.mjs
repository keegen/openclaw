#!/usr/bin/env node
/**
 * If TELEGRAM_OWNER_USER_ID is set, merge Telegram DM allowlist into state openclaw.json
 * so you do not need Render Shell to approve pairing (browser shell is often flaky).
 */
import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";

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
  cfg = JSON5.parse(fs.readFileSync(configPath, "utf8"));
} catch (err) {
  process.stderr.write(
    `render-merge-telegram-owner: could not parse ${configPath} (${String(err)}); skipping merge so the gateway can start.\n`,
  );
  process.exit(0);
}

cfg.channels = cfg.channels ?? {};
cfg.channels.telegram = cfg.channels.telegram ?? {};
cfg.channels.telegram.dmPolicy = "allowlist";
cfg.channels.telegram.allowFrom = [allowEntry];

fs.writeFileSync(configPath, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
process.stdout.write(
  `render-merge-telegram-owner: set channels.telegram dmPolicy=allowlist allowFrom=[${allowEntry}]\n`,
);
