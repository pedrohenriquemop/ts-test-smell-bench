import { describe, it, expect } from "vitest";
import {
  parsePluginConfig,
  serializePluginConfig,
  type PluginConfig,
  DEFAULT_PLUGIN_CONFIG,
} from "../plugins/discovery.js";


describe("plugin-discovery", () => {

  describe("parsePluginConfig", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("returns default config for empty string", () => {
          const config = parsePluginConfig("");
          expect(config).toEqual(DEFAULT_PLUGIN_CONFIG);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});