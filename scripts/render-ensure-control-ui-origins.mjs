#!/usr/bin/env node
/**
 * On Render, the gateway binds non-loopback; Control UI then requires either
 * gateway.controlUi.allowedOrigins or dangerouslyAllowHostHeaderOriginFallback.
 * Persisted openclaw.json from older images may lack this — patch before start.
 * (CLI `--bind lan` can override a loopback bind in config, so we do not infer
 * bind mode from the file alone.)
 */
import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";

if (process.env.RENDER !== "true") {
  process.exit(0);
}

const stateDir = process.env.OPENCLAW_STATE_DIR?.trim();
if (!stateDir) {
  process.exit(0);
}

const configPath = path.join(stateDir, "openclaw.json");
if (!fs.existsSync(configPath)) {
  process.exit(0);
}

let cfg;
try {
  cfg = JSON5.parse(fs.readFileSync(configPath, "utf8"));
} catch (err) {
  process.stderr.write(
    `render-ensure-control-ui-origins: could not parse ${configPath} (${String(err)}); skipping.\n`,
  );
  process.exit(0);
}

const controlUi = cfg.gateway?.controlUi ?? {};
const origins = controlUi.allowedOrigins;
const hasOrigins =
  Array.isArray(origins) && origins.some((o) => typeof o === "string" && o.trim().length > 0);
if (hasOrigins || controlUi.dangerouslyAllowHostHeaderOriginFallback === true) {
  process.exit(0);
}

cfg.gateway = cfg.gateway ?? {};
cfg.gateway.controlUi = {
  ...cfg.gateway.controlUi,
  dangerouslyAllowHostHeaderOriginFallback: true,
};

fs.writeFileSync(configPath, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
process.stdout.write(
  "render-ensure-control-ui-origins: set gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true\n",
);
